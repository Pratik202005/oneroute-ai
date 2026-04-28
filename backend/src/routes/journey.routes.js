import { Router } from 'express'

const router = Router()

router.get(['/journey/health'], (req, res) => {
  res.json({ ok: true, route: 'journey' })
})

import { getJourneyController, updateJourneyController } from '../controllers/journey.controller.js'

router.get(['/journey/:id'], getJourneyController)
router.put(['/journey/:id'], updateJourneyController)

export default router