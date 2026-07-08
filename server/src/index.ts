import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.get('/api/account/:gameName/:tagLine', async (req, res) => {
    const {gameName, tagLine} = req.params
    const apiKey = process.env.RIOT_API_KEY

    // Account lookup (Riot ID -> PUUID) uses the "asia" regional cluster, even for OCE players. TFT match data uses "sea" instead (api/matches route)
    try {
        const response = await fetch(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
            { headers: { 'X-Riot-Token': apiKey! } }
        )

        if (!response.ok) {
            return res.status(response.status).json({error: 'Account not found'})
        }

        const data = await response.json()
        res.json(data)
    } catch (error ) {
        console.error('Account lookup failed:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

app.get('/api/matches/:puuid', async (req, res) => {
    const {puuid} = req.params
    const apiKey = process.env.RIOT_API_KEY

    try {
        const response = await fetch(`https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids`,
            { headers: {'X-Riot-Token': apiKey! } }
        )

        if (!response.ok) {
            return res.status(response.status).json({error: 'Could not fetch matches'})
        }

        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error('Match history lookup failed:', error)
        res.status(500).json({ error: 'Server error'})
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})