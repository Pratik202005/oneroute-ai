"""
marketDataService.py
Reads government agricultural price data from BigQuery.

Data source: Agmarknet (agmarknet.gov.in)
Years:       2024, 2025
Commodities: Wheat, Cotton, Apple, Rubber

Columns in BigQuery:
  state, district, market, commodity,
  date, arrival_quantity, arrival_unit,
  modal_price, price_unit
"""

import os
from dotenv import load_dotenv
from google.cloud import bigquery

load_dotenv()


# ─────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "oneroute-ai")
DATASET_ID = os.getenv("BIGQUERY_DATASET",     "oneroute_market_data")
TABLE_ID   = os.getenv("BIGQUERY_TABLE",       "agmarknet_prices_clean")
FULL_TABLE = f"`{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`"


# ─────────────────────────────────────────
# BIGQUERY CLIENT
# ─────────────────────────────────────────
def get_bigquery_client():
    """Returns BigQuery client."""
    try:
        client = bigquery.Client(project=PROJECT_ID)
        return client
    except Exception as e:
        print(f"❌ BigQuery connection failed: {e}")
        return None


# ─────────────────────────────────────────
# GET MARKET PRICES
# ─────────────────────────────────────────
def get_market_prices(commodity: str, state: str = None) -> list:
    """
    Gets recent market prices for a commodity
    from last 30 days.

    Args:
        commodity: "Wheat" / "Cotton" / "Apple" / "Rubber"
        state:     "Maharashtra" (optional)

    Returns:
        List of market price records
    """
    try:
        client = get_bigquery_client()
        if not client:
            return []

        state_filter = (
            f"AND LOWER(state) = LOWER('{state}')"
            if state else ""
        )

        query = f"""
            SELECT
                state,
                district,
                market,
                commodity,
                date,
                arrival_quantity,
                arrival_unit,
                modal_price,
                price_unit
            FROM
                {FULL_TABLE}
            WHERE
                LOWER(commodity) = LOWER('{commodity}')
                {state_filter}
                AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
                AND modal_price IS NOT NULL
                AND modal_price > 0
            ORDER BY
                date        DESC,
                modal_price ASC
            LIMIT 50
        """

        print(f"🔍 Fetching: {commodity} | {state or 'All India'}")
        results = client.query(query).result()

        prices = []
        for row in results:
            prices.append({
                "state":            str(row.state            or ""),
                "district":         str(row.district         or ""),
                "market":           str(row.market           or ""),
                "commodity":        str(row.commodity        or ""),
                "date":             str(row.date),
                "arrival_quantity": float(row.arrival_quantity or 0),
                "arrival_unit":     str(row.arrival_unit     or "Tonnes"),
                "modal_price":      float(row.modal_price),
                "price_unit":       str(row.price_unit       or "Rs/Quintal"),
            })

        print(f"✅ Found {len(prices)} market records")
        return prices

    except Exception as e:
        print(f"❌ get_market_prices error: {e}")
        return []


# ─────────────────────────────────────────
# GET AVERAGE PRICE
# ─────────────────────────────────────────
def get_average_price(commodity: str, state: str = None) -> dict:
    """
    Calculates average modal price from last 30 days.

    Args:
        commodity: "Apple"
        state:     "Himachal Pradesh"

    Returns:
        {
          "commodity":     "Apple",
          "avg_price":     8950.0,
          "min_price":     7500.0,
          "max_price":     11000.0,
          "total_records": 245,
          "avg_arrival":   28.5
        }
        Returns None if no data found.
    """
    try:
        client = get_bigquery_client()
        if not client:
            return None

        state_filter = (
            f"AND LOWER(state) = LOWER('{state}')"
            if state else ""
        )

        query = f"""
            SELECT
                commodity,
                ROUND(AVG(modal_price),      2) AS avg_price,
                ROUND(MIN(modal_price),      2) AS min_price,
                ROUND(MAX(modal_price),      2) AS max_price,
                COUNT(*)                         AS total_records,
                ROUND(AVG(arrival_quantity), 2) AS avg_arrival
            FROM
                {FULL_TABLE}
            WHERE
                LOWER(commodity) = LOWER('{commodity}')
                {state_filter}
                AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
                AND modal_price > 0
            GROUP BY
                commodity
            LIMIT 1
        """

        results = client.query(query).result()

        for row in results:
            return {
                "commodity":     str(row.commodity),
                "avg_price":     float(row.avg_price),
                "min_price":     float(row.min_price),
                "max_price":     float(row.max_price),
                "total_records": int(row.total_records),
                "avg_arrival":   float(row.avg_arrival or 0),
                "source":        "Agmarknet Government Data (2024-2025)",
            }

        print(f"⚠️  No average data for {commodity} | {state}")
        return None

    except Exception as e:
        print(f"❌ get_average_price error: {e}")
        return None


# ─────────────────────────────────────────
# GET PRICE TREND (6 MONTHS)
# ─────────────────────────────────────────
def get_price_trend(commodity: str, state: str = None) -> list:
    """
    Gets monthly average price for last 6 months.
    Used by priceModel.py for regression prediction.

    Args:
        commodity: "Rubber"
        state:     "Kerala"

    Returns:
        [
          {
            "month":         "2024-07",
            "avg_price":     18200.0,
            "min_price":     17000.0,
            "max_price":     19500.0,
            "total_arrival": 520.0,
            "market_count":  45
          },
          ...
        ]
    """
    try:
        client = get_bigquery_client()
        if not client:
            return []

        state_filter = (
            f"AND LOWER(state) = LOWER('{state}')"
            if state else ""
        )

        query = f"""
            SELECT
                FORMAT_DATE('%Y-%m', date)       AS month,
                ROUND(AVG(modal_price),      2)  AS avg_price,
                ROUND(MIN(modal_price),      2)  AS min_price,
                ROUND(MAX(modal_price),      2)  AS max_price,
                ROUND(SUM(arrival_quantity), 2)  AS total_arrival,
                COUNT(*)                          AS market_count
            FROM
                {FULL_TABLE}
            WHERE
                LOWER(commodity) = LOWER('{commodity}')
                {state_filter}
                AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 180 DAY)
                AND modal_price > 0
            GROUP BY
                month
            ORDER BY
                month ASC
        """

        results = client.query(query).result()

        trend = []
        for row in results:
            trend.append({
                "month":         str(row.month),
                "avg_price":     float(row.avg_price),
                "min_price":     float(row.min_price),
                "max_price":     float(row.max_price),
                "total_arrival": float(row.total_arrival or 0),
                "market_count":  int(row.market_count),
            })

        print(f"✅ Trend: {len(trend)} months for {commodity}")
        return trend

    except Exception as e:
        print(f"❌ get_price_trend error: {e}")
        return []


# ─────────────────────────────────────────
# GET CHEAPEST MARKETS
# ─────────────────────────────────────────
def get_cheapest_markets(
    commodity: str,
    state: str = None,
    top_n: int = 5
) -> list:
    """
    Gets top N cheapest markets from last 7 days.

    Args:
        commodity: "Cotton"
        state:     "Gujarat"
        top_n:     5

    Returns:
        List of cheapest markets sorted by price
    """
    try:
        client = get_bigquery_client()
        if not client:
            return []

        state_filter = (
            f"AND LOWER(state) = LOWER('{state}')"
            if state else ""
        )

        query = f"""
            SELECT
                state,
                district,
                market,
                commodity,
                date,
                modal_price,
                arrival_quantity,
                arrival_unit,
                price_unit
            FROM
                {FULL_TABLE}
            WHERE
                LOWER(commodity) = LOWER('{commodity}')
                {state_filter}
                AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
                AND modal_price    > 0
                AND arrival_quantity > 0
            ORDER BY
                modal_price ASC
            LIMIT {top_n}
        """

        results = client.query(query).result()

        markets = []
        for row in results:
            markets.append({
                "state":            str(row.state            or ""),
                "district":         str(row.district         or ""),
                "market":           str(row.market           or ""),
                "commodity":        str(row.commodity        or ""),
                "date":             str(row.date),
                "modal_price":      float(row.modal_price),
                "arrival_quantity": float(row.arrival_quantity or 0),
                "arrival_unit":     str(row.arrival_unit     or "Tonnes"),
                "price_unit":       str(row.price_unit       or "Rs/Quintal"),
                "tag":              "Best Deal ⭐",
            })

        return markets

    except Exception as e:
        print(f"❌ get_cheapest_markets error: {e}")
        return []


# ─────────────────────────────────────────
# GET STATE COMPARISON
# ─────────────────────────────────────────
def get_state_comparison(commodity: str) -> list:
    """
    Compares average prices across all states.

    Args:
        commodity: "Rubber"

    Returns:
        List of states sorted cheapest first
    """
    try:
        client = get_bigquery_client()
        if not client:
            return []

        query = f"""
            SELECT
                state,
                commodity,
                ROUND(AVG(modal_price), 2)  AS avg_price,
                ROUND(MIN(modal_price), 2)  AS min_price,
                ROUND(MAX(modal_price), 2)  AS max_price,
                COUNT(DISTINCT market)       AS num_markets,
                COUNT(*)                     AS total_records
            FROM
                {FULL_TABLE}
            WHERE
                LOWER(commodity) = LOWER('{commodity}')
                AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
                AND modal_price > 0
            GROUP BY
                state,
                commodity
            ORDER BY
                avg_price ASC
        """

        results = client.query(query).result()

        states = []
        for row in results:
            states.append({
                "state":         str(row.state         or ""),
                "commodity":     str(row.commodity     or ""),
                "avg_price":     float(row.avg_price),
                "min_price":     float(row.min_price),
                "max_price":     float(row.max_price),
                "num_markets":   int(row.num_markets),
                "total_records": int(row.total_records),
            })

        return states

    except Exception as e:
        print(f"❌ get_state_comparison error: {e}")
        return []
