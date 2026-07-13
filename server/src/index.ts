import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import riotRoutes from './routes/riot.js'
import authRoutes from './routes/auth.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())
app.use(express.json())

// api health check endpoint, returns a simple JSON response indicating the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', riotRoutes)
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
