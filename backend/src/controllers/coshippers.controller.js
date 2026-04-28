import { findCoShippers } from '../services/matching.service.js';

export const getCoShippers = async (req, res, next) => {
  try {
    const { destination } = req.query;
    if (!destination) {
      return res.status(400).json({ success: false, error: 'Destination query parameter is required' });
    }
    
    const coshippers = await findCoShippers(destination);
    res.json({ success: true, count: coshippers.length, data: coshippers });
  } catch (error) {
    next(error);
  }
};
