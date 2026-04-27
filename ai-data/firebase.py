"""
firebase.py
Connects to Google Firestore
Saves and reads prediction results
"""

import os
from dotenv import load_dotenv
from google.cloud import firestore

load_dotenv()


# ─────────────────────────────────────────
# GET FIRESTORE CLIENT
# ─────────────────────────────────────────
def get_firestore_client():
    """
    Returns Firestore client.
    Uses Google Cloud credentials automatically.
    No key file needed after gcloud auth login.
    """
    try:
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        db = firestore.Client(project=project_id)
        return db

    except Exception as e:
        print(f"❌ Firebase connection failed: {e}")
        return None


# ─────────────────────────────────────────
# SAVE PREDICTION TO FIRESTORE
# ─────────────────────────────────────────
def save_prediction(
    product: str,
    source: str,
    destination: str,
    result: dict
) -> bool:
    """
    Saves prediction result to Firestore.

    Collection: predictions
    Document:   auto generated ID

    Args:
        product:     "Wheat"
        source:      "Mumbai"
        destination: "Pune"
        result:      full prediction dict

    Returns:
        True if saved successfully
        False if failed
    """
    try:
        db = get_firestore_client()
        if not db:
            print("⚠️  Firebase not connected, skipping save")
            return False

        doc_ref = db.collection("predictions").document()
        doc_ref.set({
            "product":     product,
            "source":      source,
            "destination": destination,
            "result":      result,
            "timestamp":   firestore.SERVER_TIMESTAMP,
        })

        print(f"✅ Saved to Firestore: {doc_ref.id}")
        return True

    except Exception as e:
        print(f"❌ Firestore save error: {e}")
        return False


# ─────────────────────────────────────────
# GET RECENT PREDICTIONS
# ─────────────────────────────────────────
def get_recent_predictions(limit: int = 10) -> list:
    """
    Fetches recent predictions from Firestore.

    Args:
        limit: how many records to fetch

    Returns:
        List of prediction dicts
    """
    try:
        db = get_firestore_client()
        if not db:
            return []

        docs = (
            db.collection("predictions")
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(limit)
            .stream()
        )

        results = []
        for doc in docs:
            data       = doc.to_dict()
            data["id"] = doc.id
            results.append(data)

        return results

    except Exception as e:
        print(f"❌ Firestore read error: {e}")
        return []
