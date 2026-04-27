import { Router } from 'express'
import { processRequestController } from '../controllers/processRequest.controller.js'

const router = Router()

// ✅ Smoke-test route (so browser GET works too)
router.get(['/process-request', '/processRequest'], (req, res) => {
  res.json({ ok: true, message: 'process-request route is mounted. Use POST to get results.' })
})

// ✅ Real endpoint (support both names)
router.post(['/process-request', '/processRequest'], processRequestController)

export default router