import { Router } from 'express'

const router = Router()

router.get(['/coshippers/health'], (req, res) => {
  res.json({ ok: true, route: 'coshippers' })
})

// placeholder endpoint (optional)
router.get(['/coshippers', '/co-shippers'], (req, res) => {
  res.status(501).json({ success: false, error: 'Co-shippers API not implemented yet' })
})

export default router