import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Public: get all visible projects
router.get('/', async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })
  res.json(projects)
})

// Public: get single project by slug
router.get('/:slug', async (req: Request, res: Response) => {
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
  })
  if (!project || !project.visible) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.json(project)
})

// Admin: get all projects (including hidden)
router.get('/admin/all', authMiddleware, async (_req: AuthRequest, res: Response) => {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  })
  res.json(projects)
})

// Admin: create project
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const project = await prisma.project.create({ data: req.body })
  res.status(201).json(project)
})

// Admin: update project
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: req.body,
  })
  res.json(project)
})

// Admin: delete project
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  await prisma.project.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

// Admin: reorder projects
router.post('/admin/reorder', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { orders } = req.body as { orders: { id: string; order: number }[] }
  await Promise.all(
    orders.map(({ id, order }) =>
      prisma.project.update({ where: { id }, data: { order } })
    )
  )
  res.json({ ok: true })
})

export default router
