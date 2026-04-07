import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много попыток. Попробуйте через 15 минут.' },
  skipSuccessfulRequests: true,
})

router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Email и пароль обязательны' })
    return
  }

  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) {
    res.status(401).json({ error: 'Неверные данные' })
    return
  }

  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) {
    res.status(401).json({ error: 'Неверные данные' })
    return
  }

  const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  })

  res.json({ token })
})

router.put('/password', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Заполните все поля' })
    return
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Пароль должен быть минимум 8 символов' })
    return
  }

  const admin = await prisma.admin.findUnique({ where: { id: req.adminId } })
  if (!admin) {
    res.status(404).json({ error: 'Пользователь не найден' })
    return
  }

  const valid = await bcrypt.compare(currentPassword, admin.password)
  if (!valid) {
    res.status(401).json({ error: 'Неверный текущий пароль' })
    return
  }

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.admin.update({ where: { id: req.adminId }, data: { password: hashed } })

  res.json({ ok: true })
})

export default router
