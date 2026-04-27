"""
fairnessService.py
Compares market prices vs AI predicted price.
Gives verdict for each market.

Verdict Rules:
  > +30%  → Very Unfair  (red)    score: 10
  > +20%  → Unfair       (orange) score: 30
  > +10%  → Monitor      (yellow) score: 60
  ±10%   → Fair         (green)  score: 85
  < -5%  → Best Deal    (gold)   score: 100
"""

from services.marketDataService import (
    get_market_prices,
    get_state_comparison,
)
from services.predictionService import (
    predict_fair_price,
    get_state_from_city,
)


# ─────────────────────────────────────────
# MAIN FAIRNESS FUNCTION
# ─────────────────────────────────────────
def check_market_fairness(
    product: str,
    source: str,
    destination: str,
    quantity: int          = 100,
    predicted_price: float = None,
) -> dict:
    """
    Checks fairness of market prices.

    Args:
        product:         "Wheat"
        source:          "Mumbai"
        destination:     "Pune"
        quantity:        100 (kg)
        predicted_price: optional (avoids duplicate prediction)

    Returns:
        Full fairness result dict
    """

    print("\n" + "=" * 50)
    print("⚖️  FAIRNESS SERVICE")
    print("=" * 50)
    print(f"   Product:     {product}")
    print(f"   Route:       {source} → {destination}")
    print(f"   Quantity:    {quantity} kg")

    # ── Get predicted fair price ────────────────────────────
    if not predicted_price or predicted_price <= 0:
        print("\n🔮 Getting prediction first...")
        prediction = predict_fair_price(
            product, source, destination, quantity
        )
        if prediction.get("status") == "error":
            return prediction
        predicted_price = prediction["predicted_price"]

    print(f"\n   AI Fair Price: ₹{predicted_price:,.2f}")
    predicted_per_kg = predicted_price / quantity

    # ── Get market prices from BigQuery ────────────────────
    destination_state = get_state_from_city(destination)
    print(f"\n📊 Fetching market prices for {destination_state}...")

    market_prices = get_market_prices(product, destination_state)
    if not market_prices:
        print("   ⚠️  No state data, fetching national prices...")
        market_prices = get_market_prices(product)

    if not market_prices:
        return {
            "status":  "no_data",
            "verdict": "No Data Available",
            "score":   50,
            "color":   "gray",
            "message": f"No market data found for {product}.",
        }

    # ── Analyze each market ─────────────────────────────────
    print(f"\n🔍 Analyzing {len(market_prices)} markets...")
    analyzed_markets = []

    for mkt in market_prices:
        market_per_quintal = mkt["modal_price"]
        market_per_kg      = market_per_quintal / 100
        market_total       = market_per_kg * quantity

        diff_pct = (
            ((market_per_kg - predicted_per_kg) / predicted_per_kg) * 100
            if predicted_per_kg > 0 else 0.0
        )

        verdict, color, score, emoji = classify_price(diff_pct)

        analyzed_markets.append({
            "state":    mkt["state"],
            "district": mkt["district"],
            "market":   mkt["market"],
            "date":     mkt["date"],

            "modal_price_quintal": market_per_quintal,
            "modal_price_kg":      round(market_per_kg,  2),
            "total_price":         round(market_total,   2),
            "price_unit":          mkt["price_unit"],

            "arrival_quantity":    mkt["arrival_quantity"],
            "arrival_unit":        mkt["arrival_unit"],

            "diff_percent": round(diff_pct, 1),
            "verdict":      verdict,
            "color":        color,
            "score":        score,
            "emoji":        emoji,
        })

    # ── Sort cheapest first ─────────────────────────────────
    analyzed_markets.sort(key=lambda x: x["modal_price_kg"])

    best_market  = analyzed_markets[0]  if analyzed_markets else None
    worst_market = analyzed_markets[-1] if analyzed_markets else None

    # ── Count verdicts ──────────────────────────────────────
    total         = len(analyzed_markets)
    unfair_count  = sum(
        1 for m in analyzed_markets if m["color"] in ("red", "orange")
    )
    fair_count    = sum(
        1 for m in analyzed_markets if m["color"] in ("green", "gold")
    )
    monitor_count = total - unfair_count - fair_count

    # ── Overall verdict ─────────────────────────────────────
    overall = get_overall_verdict(unfair_count, fair_count, total)

    # ── Average market price ────────────────────────────────
    avg_market_total = (
        sum(m["total_price"] for m in analyzed_markets) / total
        if total > 0 else 0
    )
    overcharge_pct = (
        round(
            ((avg_market_total - predicted_price) / predicted_price) * 100,
            1,
        )
        if predicted_price > 0 else 0
    )

    # ── State comparison ────────────────────────────────────
    state_comparison = get_state_comparison(product)

    # ── Final result ────────────────────────────────────────
    result = {
        "status":  "success",
        "product": product,
        "source":  source,
        "destination":       destination,
        "quantity_kg":       quantity,

        "verdict":           overall["verdict"],
        "score":             overall["score"],
        "color":             overall["color"],
        "emoji":             overall["emoji"],
        "summary":           overall["summary"],

        "predicted_price":   round(predicted_price,    2),
        "avg_market_price":  round(avg_market_total,   2),
        "overcharge_percent": overcharge_pct,

        "markets":               analyzed_markets,
        "best_market":           best_market,
        "worst_market":          worst_market,
        "total_markets_checked": total,
        "unfair_count":          unfair_count,
        "fair_count":            fair_count,
        "monitor_count":         monitor_count,

        "state_comparison":  state_comparison,
        "destination_state": destination_state,
        "data_source":       "Agmarknet Government Data (2024-2025)",
    }

    print("\n" + "─" * 40)
    print("✅ FAIRNESS CHECK DONE")
    print(f"   Verdict:  {overall['verdict']}")
    print(f"   Score:    {overall['score']}/100")
    print(f"   Markets:  {total}")
    print(f"   Unfair:   {unfair_count}")
    print("─" * 40)

    return result


# ─────────────────────────────────────────
# CLASSIFY SINGLE MARKET
# ─────────────────────────────────────────
def classify_price(diff_percent: float):
    """
    Classifies market based on % difference
    from predicted fair price.

    Returns: (verdict, color, score, emoji)
    """
    if diff_percent > 30:
        return ("Very Unfair - Avoid", "red",    10,  "🚨")
    elif diff_percent > 20:
        return ("Unfair Market",        "orange", 30,  "⚠️")
    elif diff_percent > 10:
        return ("Monitor Closely",      "yellow", 60,  "👀")
    elif diff_percent >= -5:
        return ("Fair Price",           "green",  85,  "✅")
    else:
        return ("Best Deal",            "gold",  100,  "⭐")


# ─────────────────────────────────────────
# OVERALL VERDICT
# ─────────────────────────────────────────
def get_overall_verdict(
    unfair_count: int,
    fair_count: int,
    total: int
) -> dict:
    """Determines overall verdict based on market counts."""

    if total == 0:
        return {
            "verdict": "No Data",
            "score":   50,
            "color":   "gray",
            "emoji":   "❓",
            "summary": "Not enough data.",
        }

    unfair_ratio = unfair_count / total
    fair_ratio   = fair_count   / total

    if unfair_ratio >= 0.6:
        return {
            "verdict": "Unfair Market Zone",
            "score":   15,
            "color":   "red",
            "emoji":   "🚨",
            "summary": (
                f"{unfair_count} out of {total} markets are "
                f"overcharging. Be very careful."
            ),
        }
    elif unfair_ratio >= 0.35:
        return {
            "verdict": "Partially Unfair",
            "score":   45,
            "color":   "orange",
            "emoji":   "⚠️",
            "summary": (
                f"{unfair_count} markets are unfair. "
                f"Compare carefully before deciding."
            ),
        }
    elif fair_ratio >= 0.7:
        return {
            "verdict": "Fair Market Zone",
            "score":   88,
            "color":   "green",
            "emoji":   "✅",
            "summary": (
                f"{fair_count} out of {total} markets offer "
                f"fair prices. Good time to sell."
            ),
        }
    else:
        return {
            "verdict": "Monitor Closely",
            "score":   60,
            "color":   "yellow",
            "emoji":   "👀",
            "summary": "Mixed conditions. Check individual markets.",
        }
