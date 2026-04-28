import { db } from '../config/firebase.js';

export async function findCoShippers(destination) {
  try {
    const snapshot = await db.collection('journeys')
      .where('request.destination', '==', destination)
      .where('status', '==', 'active')
      .get();
      
    const coShippers = [];
    snapshot.forEach(doc => {
      coShippers.push({ id: doc.id, ...doc.data() });
    });
    
    return coShippers;
  } catch (error) {
    console.error('Error fetching co-shippers:', error);
    return [];
  }
}
