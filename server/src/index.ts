import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import riotRoutes from './routes/riot.js'

dotenv.config()
console.log('Key loaded:', process.env.RIOT_API_KEY?.slice(0, 10))

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api', riotRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})