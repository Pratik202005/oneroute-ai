import { Router } from 'express'

const router = Router()

router.get(['/coshippers/health'], (req, res) => {
  res.json({ ok: true, route: 'coshippers' })
})

import { getCoShippers } from '../controllers/coshippers.controller.js'

router.get(['/coshippers', '/co-shippers'], getCoShippers)

export default router