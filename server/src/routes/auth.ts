import { Router } from 'express'
import { signup, login } from '../services/auth.js'

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

export default router
