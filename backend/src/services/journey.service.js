import { db } from '../config/firebase.js';

export async function getJourney(journeyId) {
  try {
    const doc = await db.collection('journeys').doc(journeyId).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error fetching journey:', error);
    throw error;
  }
}

export async function updateJourneyStatus(journeyId, status) {
  try {
    await db.collection('journeys').doc(journeyId).update({ status });
    return true;
  } catch (error) {
    console.error('Error updating journey:', error);
    throw error;
  }
}
