"""
priceModel.py
Price prediction logic.

Priority:
  1. Trained ML model (saved_model/price_model.pkl)
  2. Trend regression on BigQuery data
  3. MSP based (Wheat, Cotton)
  4. Market average fallback (Apple, Rubber)
"""

import os
import pickle
import numpy as np
from pathlib import Path


# ─────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────
MODEL_DIR      = Path(__file__).parent.parent / "saved_model"
MODEL_PATH     = MODEL_DIR / "price_model.pkl"
COMM_ENC_PATH  = MODEL_DIR / "commodity_encoder.pkl"
STATE_ENC_PATH = MODEL_DIR / "state_encoder.pkl"


# ─────────────────────────────────────────
# LOAD MODEL
# ─────────────────────────────────────────
def load_models():
    """Loads trained ML model and encoders from disk."""
    try:
        if not MODEL_PATH.exists():
            print("⚠️  No trained model found, will use fallback")
            return None, None, None

        with open(MODEL_PATH,     "rb") as f:
            model = pickle.load(f)
        with open(COMM_ENC_PATH,  "rb") as f:
            commodity_encoder = pickle.load(f)
        with open(STATE_ENC_PATH, "rb") as f:
            state_encoder = pickle.load(f)

        print("✅ Trained ML model loaded")
        return model, commodity_encoder, state_encoder

    except Exception as e:
        print(f"⚠️  Model load error: {e}")
        return None, None, None


# Load once at startup
MODEL, COMMODITY_ENCODER, STATE_ENCODER = load_models()


# ─────────────────────────────────────────
# BASE PRICES (FALLBACK)
# Source: Govt of India MSP + Market 2024-25
# ─────────────────────────────────────────
COMMODITY_BASE_PRICES = {
    "wheat":  2275,    # MSP Rs/Quintal
    "cotton": 7121,    # MSP Rs/Quintal
    "apple":  9000,    # Market avg Rs/Quintal
    "rubber": 18500,   # Market avg Rs/Quintal
}


# ─────────────────────────────────────────
# MAIN PREDICT FUNCTION
# ─────────────────────────────────────────
def predict_with_vertex_ai(
    product: str,
    source: str,
    destination: str,
    quantity: int,
    trend_data: list,
    msp_price: float  = None,
    dest_state: str   = None,
) -> float:
    """
    Predicts fair total price for given quantity.

    Args:
        product:    "Wheat"
        source:     "Mumbai"
        destination:"Pune"
        quantity:   100 (kg)
        trend_data: monthly price list from BigQuery
        msp_price:  Government MSP (Rs/Quintal)
        dest_state: "Maharashtra"

    Returns:
        Total price in Rs for given quantity
    """

    print(f"\n🤖 Price Model")
    print(f"   Product:  {product} | Qty: {quantity}kg")

    product_lower = product.lower()
    month = __import__("datetime").datetime.now().month
    year  = __import__("datetime").datetime.now().year

    # ── Method 1: Trained ML Model ──────────────────────────
    if MODEL and COMMODITY_ENCODER and STATE_ENCODER:
        try:
            state_to_use       = dest_state or destination
            known_commodities  = list(COMMODITY_ENCODER.classes_)
            known_states       = list(STATE_ENCODER.classes_)

            commodity_match = next(
                (c for c in known_commodities
                 if product.lower() in c.lower()),
                None
            )
            state_match = next(
                (s for s in known_states
                 if state_to_use.lower() in s.lower()),
                None
            )

            if commodity_match and state_match:
                comm_enc  = COMMODITY_ENCODER.transform([commodity_match])[0]
                state_enc = STATE_ENCODER.transform([state_match])[0]

                X = np.array([[
                    comm_enc, state_enc,
                    month, year, 25.0
                ]])

                predicted_per_quintal = float(MODEL.predict(X)[0])

                if predicted_per_quintal > 0:
                    per_kg = predicted_per_quintal / 100
                    total  = round(per_kg * quantity, 2)
                    print(f"   Method: Trained ML Model")
                    print(f"   ₹{predicted_per_quintal:.2f}/quintal → ₹{total} total")
                    return total

        except Exception as e:
            print(f"   ⚠️  ML model error: {e}")

    # ── Method 2: Trend Regression ──────────────────────────
    if trend_data and len(trend_data) >= 3:
        result = predict_from_trend(trend_data, quantity)
        if result > 0:
            return result

    # ── Method 3: MSP Based ─────────────────────────────────
    if msp_price and msp_price > 0:
        market_per_quintal = msp_price * 1.08
        per_kg             = market_per_quintal / 100
        total              = round(per_kg * quantity, 2)
        print(f"   Method: MSP Based → ₹{total}")
        return total

    # ── Method 4: Fallback ───────────────────────────────────
    base   = COMMODITY_BASE_PRICES.get(product_lower, 3000)
    per_kg = base / 100
    total  = round(per_kg * quantity, 2)
    print(f"   Method: Fallback → ₹{total}")
    return total


# ─────────────────────────────────────────
# TREND REGRESSION
# ─────────────────────────────────────────
def predict_from_trend(trend_data: list, quantity: int) -> float:
    """
    Linear regression on monthly price trend.

    Args:
        trend_data: [{"month": "2024-01", "avg_price": 2300}, ...]
        quantity:   100 (kg)

    Returns:
        Total price in Rs
    """
    try:
        from sklearn.linear_model import LinearRegression

        prices = [float(item["avg_price"]) for item in trend_data]

        X = np.array(range(len(prices))).reshape(-1, 1)
        Y = np.array(prices)

        model = LinearRegression()
        model.fit(X, Y)

        next_step             = np.array([[len(prices)]])
        predicted_per_quintal = float(model.predict(next_step)[0])

        if predicted_per_quintal <= 0:
            predicted_per_quintal = prices[-1]

        per_kg = predicted_per_quintal / 100
        total  = round(per_kg * quantity, 2)

        print(f"   Method: Trend Regression")
        print(f"   ₹{predicted_per_quintal:.2f}/quintal → ₹{total} total")
        return total

    except Exception as e:
        print(f"   ⚠️  Trend error: {e}")
        return 0.0
