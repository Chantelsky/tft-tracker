import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import riotRoutes from './routes/riot.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
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
