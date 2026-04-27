import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ✅ This forces dotenv to load backend/.env always
dotenv.config({ path: path.join(__dirname, '../.env') })

const PORT = process.env.PORT || 5000

console.log('✅ ENV check: GOOGLE_MAPS_KEY present =', Boolean(process.env.GOOGLE_MAPS_KEY))

app.listen(PORT, () => {
  console.log(`✅ Backend running: http://localhost:${PORT}`)
  console.log(`✅ Health check:     http://localhost:${PORT}/health`)
})