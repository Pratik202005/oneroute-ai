"""
main.py
FastAPI server for OneRoute AI.
Port: 8000
Called by Backend Node.js on port 5000.

Endpoints:
  GET  /                             health check
  GET  /health                       health check
  POST /predict                      price prediction
  POST /fairness                     fairness check
  POST /analyze                      predict + fairness together
  GET  /market-prices/{commodity}    raw market prices
  GET  /average-price/{commodity}    average price
  GET  /state-comparison/{commodity} compare states
  GET  /recent-predictions           last predictions
"""

import os
from typing           import Optional
from fastapi          import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic         import BaseModel, Field
from dotenv           import load_dotenv

from services.predictionService import predict_fair_price
from services.fairnessService   import check_market_fairness
from services.marketDataService import (
    get_market_prices,
    get_average_price,
    get_state_comparison,
)
from firebase import get_recent_predictions

load_dotenv()


# ─────────────────────────────────────────
# APP SETUP
# ─────────────────────────────────────────
app = FastAPI(
    title       = "OneRoute AI Service",
    description = (
        "Price prediction and market fairness detection. "
        "Data: Agmarknet Government Data 2024-2025. "
        "Commodities: Wheat, Cotton, Apple, Rubber."
    ),
    version = "2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)


# ─────────────────────────────────────────
# REQUEST MODELS
# ─────────────────────────────────────────
class PredictionRequest(BaseModel):
    product:     str = Field(..., example="Wheat")
    source:      str = Field(..., example="Mumbai")
    destination: str = Field(..., example="Pune")
    quantity:    int = Field(100, example=100, ge=1, le=100000)


class FairnessRequest(BaseModel):
    product:         str            = Field(...,  example="Cotton")
    source:          str            = Field(...,  example="Mumbai")
    destination:     str            = Field(...,  example="Pune")
    quantity:        int            = Field(100,  example=100, ge=1)
    predicted_price: Optional[float]= Field(None, example=7200.0)


class AnalyzeRequest(BaseModel):
    product:     str = Field(..., example="Apple")
    source:      str = Field(..., example="Shimla")
    destination: str = Field(..., example="Delhi")
    quantity:    int = Field(100, example=100, ge=1)


# ─────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service":     "OneRoute AI",
        "status":      "running 🚀",
        "version":     "2.0.0",
        "commodities": ["Wheat", "Cotton", "Apple", "Rubber"],
        "data_source": "Agmarknet Government Data (2024-2025)",
        "endpoints": {
            "predict":          "POST /predict",
            "fairness":         "POST /fairness",
            "analyze":          "POST /analyze",
            "market_prices":    "GET  /market-prices/{commodity}",
            "average_price":    "GET  /average-price/{commodity}",
            "state_comparison": "GET  /state-comparison/{commodity}",
            "recent":           "GET  /recent-predictions",
            "docs":             "GET  /docs",
        },
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "OneRoute AI"}


@app.post("/predict")
def predict_price(request: PredictionRequest):
    """Predicts fair price for a commodity."""
    try:
        print(f"\n📨 /predict → {request.product} | "
              f"{request.source} → {request.destination} | "
              f"{request.quantity}kg")

        result = predict_fair_price(
            product     = request.product,
            source      = request.source,
            destination = request.destination,
            quantity    = request.quantity,
        )

        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result["message"])

        return result

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ /predict error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/fairness")
def check_fairness(request: FairnessRequest):
    """Checks if market prices are fair or unfair."""
    try:
        print(f"\n📨 /fairness → {request.product} | "
              f"{request.source} → {request.destination}")

        result = check_market_fairness(
            product         = request.product,
            source          = request.source,
            destination     = request.destination,
            quantity        = request.quantity,
            predicted_price = request.predicted_price,
        )

        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result["message"])

        return result

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ /fairness error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    """Runs prediction AND fairness check together."""
    try:
        print(f"\n📨 /analyze → {request.product} | "
              f"{request.source} → {request.destination}")

        prediction = predict_fair_price(
            product     = request.product,
            source      = request.source,
            destination = request.destination,
            quantity    = request.quantity,
        )

        if prediction.get("status") == "error":
            raise HTTPException(
                status_code=400, detail=prediction["message"]
            )

        fairness = check_market_fairness(
            product         = request.product,
            source          = request.source,
            destination     = request.destination,
            quantity        = request.quantity,
            predicted_price = prediction["predicted_price"],
        )

        return {
            "prediction": prediction,
            "fairness":   fairness,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ /analyze error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/market-prices/{commodity}")
def market_prices(commodity: str, state: str = None):
    """Returns raw market prices from BigQuery."""
    try:
        prices = get_market_prices(commodity, state)
        return {
            "commodity": commodity,
            "state":     state or "All India",
            "count":     len(prices),
            "prices":    prices,
            "source":    "Agmarknet Government Data (2024-2025)",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/average-price/{commodity}")
def average_price(commodity: str, state: str = None):
    """Returns average market price."""
    try:
        avg = get_average_price(commodity, state)
        if not avg:
            raise HTTPException(
                status_code=404,
                detail=f"No data for {commodity}" +
                       (f" in {state}" if state else "")
            )
        return avg
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/state-comparison/{commodity}")
def state_comparison(commodity: str):
    """Compares average prices across all states."""
    try:
        states = get_state_comparison(commodity)
        return {
            "commodity": commodity,
            "count":     len(states),
            "states":    states,
            "note":      "Sorted cheapest state first",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/recent-predictions")
def recent_predictions(limit: int = 10):
    """Returns recent predictions from Firestore."""
    try:
        preds = get_recent_predictions(limit)
        return {
            "count":       len(preds),
            "predictions": preds,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────
# START SERVER
# ─────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))

    print("\n" + "=" * 50)
    print("🚀 OneRoute AI Service Starting...")
    print("=" * 50)
    print(f"   Port:        {port}")
    print(f"   Project:     {os.getenv('GOOGLE_CLOUD_PROJECT')}")
    print(f"   BigQuery:    {os.getenv('BIGQUERY_DATASET')}."
          f"{os.getenv('BIGQUERY_TABLE')}")
    print(f"   Commodities: Wheat, Cotton, Apple, Rubber")
    print(f"   API Docs:    http://localhost:{port}/docs")
    print("=" * 50 + "\n")

    uvicorn.run(
        "main:app",
        host   = "0.0.0.0",
        port   = port,
        reload = True,
    )
