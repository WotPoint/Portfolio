import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Public: get all config as key-value object
router.get('/', async (_req: Request, res: Response) => {
  const configs = await prisma.siteConfig.findMany()
  const result: Record<string, string> = {}
  for (const c of configs) {
    result[c.key] = c.value
  }
  res.json(result)
})

// Admin: update config keys
router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const updates = req.body as Record<string, string>
  await Promise.all(
    Object.entries(updates).map(([key, value]) =>
      prisma.siteConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  )
  res.json({ ok: true })
})

export default router
