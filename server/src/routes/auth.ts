import { Router } from 'express'
import { signup, login } from '../services/auth.js'
import { requireAuth } from '../middleware/auth.js'
import { getAccountByRiotId } from '../services/riotApi.js'
import { prisma } from '../db.js'

const router = Router()

router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await signup(email, password)
    res.status(201).json(result)
  } catch (error) {
    if ((error as Error).message === 'Email is already in use') {
      res.status(400).json({ error: (error as Error).message })
    } else {
      res.status(500).json({ error: (error as Error).message })
    }
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await login(email, password)
    res.status(200).json(result)
  } catch (error) {
    if ((error as Error).message === 'Invalid credentials') {
      res.status(401).json({ error: (error as Error).message })
    } else {
      res.status(500).json({ error: (error as Error).message })
    }
  }
})

router.get('/me', requireAuth, async (req, res) => {
  res.json({ userId: req.userId })
})

router.post('/link-riot-account', requireAuth, async (req, res) => {
  const { gameName, tagLine } = req.body
  const userId = req.userId

  try {
    const account = await getAccountByRiotId(gameName, tagLine)
    const riotAccount = await prisma.riotAccount.create({
      data: {
        puuid: account.puuid,
        gameName: account.gameName,
        tagLine: account.tagLine,
        userId: userId!,
      },
    })

    res.status(201).json(riotAccount)
  } catch (error) {
    console.error('Linking Riot account failed:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
