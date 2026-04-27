import { Router } from 'express'

import processRequestRoutes from './processRequest.routes.js'
import journeyRoutes from './journey.routes.js'
import coshippersRoutes from './coshippers.routes.js'
import chatRoutes from './chat.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ ok: true, scope: 'api', time: new Date().toISOString() })
})

router.use(processRequestRoutes)
router.use(journeyRoutes)
router.use(coshippersRoutes)
router.use(chatRoutes)

export default router