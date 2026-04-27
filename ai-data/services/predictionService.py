"""
predictionService.py
Main prediction service.
Predicts fair price for a commodity.

Commodities: Wheat, Cotton, Apple, Rubber
Data:        Agmarknet Government Data 2024-2025
"""

import os
from dotenv import load_dotenv

from services.marketDataService import (
    get_average_price,
    get_price_trend,
    get_market_prices,
    get_cheapest_markets,
)
from models.priceModel  import predict_with_vertex_ai
from firebase           import save_prediction

load_dotenv()


# ─────────────────────────────────────────
# COMMODITY CONFIG
# MSP Source: Government of India 2024-25
# ─────────────────────────────────────────
COMMODITY_CONFIG = {
    "Wheat": {
        "msp_price":   2275,
        "price_unit":  "Rs/Quintal",
        "main_states": [
            "Punjab", "Haryana", "Uttar Pradesh",
            "Madhya Pradesh", "Rajasthan", "Bihar",
        ],
        "season":      "Rabi (Harvest: Mar-Apr)",
        "description": "Major food grain crop",
    },
    "Cotton": {
        "msp_price":   7121,
        "price_unit":  "Rs/Quintal",
        "main_states": [
            "Gujarat", "Maharashtra", "Telangana",
            "Andhra Pradesh", "Punjab", "Haryana",
        ],
        "season":      "Kharif (Harvest: Oct-Dec)",
        "description": "Cash crop for textile industry",
    },
    "Apple": {
        "msp_price":   None,
        "price_unit":  "Rs/Quintal",
        "main_states": [
            "Himachal Pradesh", "Jammu & Kashmir",
            "Uttarakhand",
        ],
        "season":      "Aug-Nov",
        "description": "Premium horticulture crop",
    },
    "Rubber": {
        "msp_price":   None,
        "price_unit":  "Rs/Quintal",
        "main_states": [
            "Kerala", "Tamil Nadu",
            "Karnataka", "Assam", "Tripura",
        ],
        "season":      "Year Round",
        "description": "Industrial raw material",
    },
}

VALID_COMMODITIES = {key.lower(): key for key in COMMODITY_CONFIG}


# ─────────────────────────────────────────
# MAIN PREDICTION FUNCTION
# ─────────────────────────────────────────
def predict_fair_price(
    product: str,
    source: str,
    destination: str,
    quantity: int = 100,
) -> dict:
    """
    Predicts fair price for a commodity.

    Args:
        product:     "Wheat" / "Cotton" / "Apple" / "Rubber"
        source:      "Mumbai"
        destination: "Pune"
        quantity:    100 (in kg)

    Returns:
        Full prediction result dict
    """

    print("\n" + "=" * 50)
    print("🔮 PREDICTION SERVICE")
    print("=" * 50)
    print(f"   Product:     {product}")
    print(f"   Route:       {source} → {destination}")
    print(f"   Quantity:    {quantity} kg")

    # ── Validate commodity ──────────────────────────────────
    commodity_key = VALID_COMMODITIES.get(product.lower().strip())

    if not commodity_key:
        return {
            "status":  "error",
            "message": (
                f"Commodity '{product}' not supported. "
                f"Supported: Wheat, Cotton, Apple, Rubber"
            ),
        }

    config = COMMODITY_CONFIG[commodity_key]
    print(f"✅ Commodity: {commodity_key}")

    # ── Map cities to states ────────────────────────────────
    source_state      = get_state_from_city(source)
    destination_state = get_state_from_city(destination)

    # ── Fetch from BigQuery ─────────────────────────────────
    print("\n📊 Fetching from BigQuery...")

    dest_avg = get_average_price(commodity_key, destination_state)
    if not dest_avg:
        print(f"   ⚠️  No state data, using national avg")
        dest_avg = get_average_price(commodity_key)

    source_avg = get_average_price(commodity_key, source_state)
    if not source_avg:
        source_avg = get_average_price(commodity_key)

    trend_data = get_price_trend(commodity_key, destination_state)
    if not trend_data:
        trend_data = get_price_trend(commodity_key)

    best_markets = get_cheapest_markets(
        commodity_key, destination_state, top_n=5
    )

    # ── Run prediction model ────────────────────────────────
    print("\n🤖 Running prediction model...")

    predicted_total = predict_with_vertex_ai(
        product     = commodity_key,
        source      = source,
        destination = destination,
        quantity    = quantity,
        trend_data  = trend_data,
        msp_price   = config["msp_price"],
        dest_state  = destination_state,
    )

    # ── Calculate per unit prices ───────────────────────────
    predicted_per_kg      = round(predicted_total / quantity, 2)
    predicted_per_quintal = round(predicted_per_kg * 100, 2)

    # ── Build result ────────────────────────────────────────
    result = {
        "status":      "success",
        "product":     commodity_key,
        "source":      source,
        "destination": destination,
        "quantity_kg": quantity,

        "predicted_price":       round(predicted_total, 2),
        "predicted_per_kg":      predicted_per_kg,
        "predicted_per_quintal": predicted_per_quintal,
        "price_unit":            "Rs/Quintal",

        "msp_price":             config["msp_price"],
        "source_avg_price": (
            round(source_avg["avg_price"], 2) if source_avg else None
        ),
        "destination_avg_price": (
            round(dest_avg["avg_price"], 2) if dest_avg else None
        ),
        "destination_min_price": (
            round(dest_avg["min_price"], 2) if dest_avg else None
        ),
        "destination_max_price": (
            round(dest_avg["max_price"], 2) if dest_avg else None
        ),

        "trend_data":    trend_data,
        "best_markets":  best_markets,
        "data_points":   dest_avg["total_records"] if dest_avg else 0,
        "confidence":    calculate_confidence(dest_avg, trend_data),

        "main_states":   config["main_states"],
        "season":        config["season"],
        "description":   config["description"],

        "data_source":   "Agmarknet Government Data (2024-2025)",
        "source_state":  source_state,
        "dest_state":    destination_state,
    }

    print("\n" + "─" * 40)
    print("✅ PREDICTION DONE")
    print(f"   Total:     ₹{predicted_total:,.2f}")
    print(f"   Per KG:    ₹{predicted_per_kg:,.2f}")
    print(f"   Confidence:{result['confidence']}")
    print("─" * 40)

    save_prediction(commodity_key, source, destination, result)
    return result


# ─────────────────────────────────────────
# CONFIDENCE LEVEL
# ─────────────────────────────────────────
def calculate_confidence(avg_data: dict, trend_data: list) -> str:
    """Returns High / Medium / Low based on data availability."""
    records      = avg_data["total_records"] if avg_data    else 0
    trend_months = len(trend_data)           if trend_data  else 0

    if records >= 100 and trend_months >= 4:
        return "High"
    elif records >= 30 or trend_months >= 2:
        return "Medium"
    else:
        return "Low"


# ─────────────────────────────────────────
# CITY TO STATE MAP
# ─────────────────────────────────────────
def get_state_from_city(city: str) -> str:
    """
    Maps Indian city name to state name.
    BigQuery data uses state names.
    """

    city_state_map = {
        # Maharashtra
        "mumbai":         "Maharashtra",
        "pune":           "Maharashtra",
        "nagpur":         "Maharashtra",
        "nashik":         "Maharashtra",
        "aurangabad":     "Maharashtra",
        "solapur":        "Maharashtra",
        "kolhapur":       "Maharashtra",
        "satara":         "Maharashtra",
        "sangli":         "Maharashtra",
        "ahmednagar":     "Maharashtra",
        "latur":          "Maharashtra",
        "akola":          "Maharashtra",
        "amravati":       "Maharashtra",

        # Punjab
        "amritsar":       "Punjab",
        "ludhiana":       "Punjab",
        "jalandhar":      "Punjab",
        "patiala":        "Punjab",
        "bathinda":       "Punjab",
        "mohali":         "Punjab",

        # Haryana
        "gurugram":       "Haryana",
        "gurgaon":        "Haryana",
        "faridabad":      "Haryana",
        "ambala":         "Haryana",
        "hisar":          "Haryana",
        "rohtak":         "Haryana",
        "karnal":         "Haryana",
        "panipat":        "Haryana",
        "chandigarh":     "Haryana",

        # Uttar Pradesh
        "lucknow":        "Uttar Pradesh",
        "kanpur":         "Uttar Pradesh",
        "agra":           "Uttar Pradesh",
        "varanasi":       "Uttar Pradesh",
        "prayagraj":      "Uttar Pradesh",
        "allahabad":      "Uttar Pradesh",
        "meerut":         "Uttar Pradesh",
        "mathura":        "Uttar Pradesh",
        "aligarh":        "Uttar Pradesh",
        "moradabad":      "Uttar Pradesh",

        # Madhya Pradesh
        "bhopal":         "Madhya Pradesh",
        "indore":         "Madhya Pradesh",
        "gwalior":        "Madhya Pradesh",
        "jabalpur":       "Madhya Pradesh",
        "ujjain":         "Madhya Pradesh",

        # Rajasthan
        "jaipur":         "Rajasthan",
        "jodhpur":        "Rajasthan",
        "udaipur":        "Rajasthan",
        "kota":           "Rajasthan",
        "bikaner":        "Rajasthan",
        "ajmer":          "Rajasthan",

        # Gujarat
        "ahmedabad":      "Gujarat",
        "surat":          "Gujarat",
        "vadodara":       "Gujarat",
        "rajkot":         "Gujarat",
        "gandhinagar":    "Gujarat",
        "bhavnagar":      "Gujarat",
        "junagadh":       "Gujarat",
        "anand":          "Gujarat",

        # Karnataka
        "bangalore":      "Karnataka",
        "bengaluru":      "Karnataka",
        "mysore":         "Karnataka",
        "hubli":          "Karnataka",
        "mangalore":      "Karnataka",
        "belgaum":        "Karnataka",
        "bellary":        "Karnataka",
        "davangere":      "Karnataka",

        # Kerala
        "kochi":                  "Kerala",
        "thiruvananthapuram":     "Kerala",
        "kozhikode":              "Kerala",
        "kottayam":               "Kerala",
        "thrissur":               "Kerala",
        "kollam":                 "Kerala",
        "palakkad":               "Kerala",
        "alappuzha":              "Kerala",
        "malappuram":             "Kerala",

        # Tamil Nadu
        "chennai":        "Tamil Nadu",
        "coimbatore":     "Tamil Nadu",
        "madurai":        "Tamil Nadu",
        "salem":          "Tamil Nadu",
        "trichy":         "Tamil Nadu",
        "tiruppur":       "Tamil Nadu",
        "vellore":        "Tamil Nadu",

        # Telangana
        "hyderabad":      "Telangana",
        "warangal":       "Telangana",
        "nizamabad":      "Telangana",
        "karimnagar":     "Telangana",

        # Andhra Pradesh
        "vijayawada":     "Andhra Pradesh",
        "visakhapatnam":  "Andhra Pradesh",
        "tirupati":       "Andhra Pradesh",
        "guntur":         "Andhra Pradesh",
        "nellore":        "Andhra Pradesh",
        "kurnool":        "Andhra Pradesh",

        # West Bengal
        "kolkata":        "West Bengal",
        "howrah":         "West Bengal",
        "durgapur":       "West Bengal",
        "asansol":        "West Bengal",
        "siliguri":       "West Bengal",

        # Himachal Pradesh
        "shimla":         "Himachal Pradesh",
        "manali":         "Himachal Pradesh",
        "dharamshala":    "Himachal Pradesh",
        "kullu":          "Himachal Pradesh",
        "solan":          "Himachal Pradesh",
        "mandi":          "Himachal Pradesh",

        # Jammu & Kashmir
        "srinagar":       "Jammu & Kashmir",
        "jammu":          "Jammu & Kashmir",
        "anantnag":       "Jammu & Kashmir",
        "baramulla":      "Jammu & Kashmir",

        # Uttarakhand
        "dehradun":       "Uttarakhand",
        "haridwar":       "Uttarakhand",
        "nainital":       "Uttarakhand",
        "haldwani":       "Uttarakhand",

        # Assam
        "guwahati":       "Assam",
        "dibrugarh":      "Assam",
        "jorhat":         "Assam",
        "silchar":        "Assam",

        # Bihar
        "patna":          "Bihar",
        "gaya":           "Bihar",
        "bhagalpur":      "Bihar",
        "muzaffarpur":    "Bihar",

        # Odisha
        "bhubaneswar":    "Odisha",
        "cuttack":        "Odisha",
        "rourkela":       "Odisha",

        # Delhi
        "delhi":          "Delhi",
        "new delhi":      "Delhi",
    }

    city_lower = city.lower().strip()
    state      = city_state_map.get(city_lower)

    if state:
        print(f"   📍 {city} → {state}")
        return state

    print(f"   ⚠️  City not mapped: '{city}' using as-is")
    return city
