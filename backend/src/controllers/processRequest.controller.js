import { buildProcessRequestResult } from '../services/processRequest.service.js'

export async function processRequestController(req, res, next) {
  try {
    const { product, quantity, source, destination, time } = req.body || {}

    // Basic validation (MVP)
    if (!product || !quantity || !source || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: product, quantity, source, destination',
      })
    }

    const result = await buildProcessRequestResult({
      product,
      quantity,
      source,
      destination,
      time: time || '',
    })

    return res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}