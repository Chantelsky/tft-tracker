import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'

export async function signup(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    throw new Error('Email already in use')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  })

  const JWT_SECRET = process.env.JWT_SECRET!
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

  return { user: { id: user.id, email: user.email }, token }
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Invalid credentials')
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    throw new Error('Invalid credentials')
  }

  const JWT_SECRET = process.env.JWT_SECRET!
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

  return { user: { id: user.id, email: user.email }, token }
}
