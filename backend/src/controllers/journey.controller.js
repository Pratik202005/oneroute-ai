import { getJourney, updateJourneyStatus } from '../services/journey.service.js';

export const getJourneyController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const journey = await getJourney(id);
    if (!journey) {
      return res.status(404).json({ success: false, error: 'Journey not found' });
    }
    res.json({ success: true, data: journey });
  } catch (error) {
    next(error);
  }
};

export const updateJourneyController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateJourneyStatus(id, status);
    res.json({ success: true, message: 'Journey updated successfully' });
  } catch (error) {
    next(error);
  }
};
