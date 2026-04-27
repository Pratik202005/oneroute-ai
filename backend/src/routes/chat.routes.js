import { Router } from 'express'

const router = Router()

router.get(['/chat/health'], (req, res) => {
  res.json({ ok: true, route: 'chat' })
})

// placeholder endpoint (optional)
router.post(['/message'], (req, res) => {
  res.status(501).json({ success: false, error: 'Chat API not implemented yet' })
})

export default router