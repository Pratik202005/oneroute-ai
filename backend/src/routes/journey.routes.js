import { Router } from 'express'

const router = Router()

router.get(['/journey/health'], (req, res) => {
  res.json({ ok: true, route: 'journey' })
})

// placeholder endpoint (optional)
router.get(['/journey/:requestId'], (req, res) => {
  res.status(501).json({ success: false, error: 'Journey API not implemented yet' })
})

export default router