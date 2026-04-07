import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

dotenv.config()

import authRouter from './routes/auth'
import projectsRouter from './routes/projects'
import configRouter from './routes/config'
import uploadRouter from './routes/upload'

const app = express()
const PORT = process.env.PORT || 3001
const prisma = new PrismaClient()

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

// Serve uploaded files (persistent volume in production)
const uploadsDir = process.env.NODE_ENV === 'production'
  ? '/data/uploads'
  : path.join(__dirname, '../uploads')
app.use('/uploads', express.static(uploadsDir))

// API routes
app.use('/api/auth', authRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/config', configRouter)
app.use('/api/upload', uploadRouter)

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

async function autoSeed() {
  const count = await prisma.siteConfig.count()
  if (count > 0) return

  console.log('🌱 Empty database detected, running auto-seed...')

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin123!', 10
  )
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'kirkaif@gmail.com' },
    update: {},
    create: { email: process.env.ADMIN_EMAIL || 'kirkaif@gmail.com', password: hashedPassword },
  })

  const configs = [
    { key: 'nameRu', value: 'Константин' },
    { key: 'nameEn', value: 'Konstantin' },
    { key: 'roleRu', value: 'Fullstack разработчик' },
    { key: 'roleEn', value: 'Full-Stack Developer' },
    { key: 'bioRu', value: 'Создаю веб-приложения с нуля — от дизайна до деплоя. Python, Node.js, React, TypeScript. 2 года опыта в разработке полного стека, UI/UX дизайне и работе с базами данных.' },
    { key: 'bioEn', value: 'I build web applications from scratch — from design to deployment. Python, Node.js, React, TypeScript. 2 years of experience in full-stack development, UI/UX design, and database work.' },
    { key: 'skills', value: JSON.stringify(['React','TypeScript','Node.js','Python','PostgreSQL','Prisma','Docker','Git','UI/UX','REST API','WebRTC','Socket.io']) },
    { key: 'telegramUrl', value: 'https://t.me/Herasova' },
    { key: 'email', value: 'kirkaif@gmail.com' },
    { key: 'githubUrl', value: '' },
  ]
  for (const c of configs) {
    await prisma.siteConfig.upsert({ where: { key: c.key }, update: {}, create: c })
  }

  const projects = [
    {
      slug: 'voischat', titleRu: 'VoisChat', titleEn: 'VoisChat',
      taglineRu: 'Голосовой чат для геймеров', taglineEn: 'Voice chat for gamers',
      problemRu: 'Русскоязычным геймерам нужен надёжный голосовой чат без зависимости от иностранных сервисов.',
      problemEn: 'Russian-speaking gamers need a reliable voice chat without dependency on foreign services.',
      beforeRu: 'Discord — иностранный сервис с рисками блокировки, без русской поддержки.',
      beforeEn: 'Discord — a foreign service with blocking risks, no Russian support.',
      solutionRu: 'Discord-подобный мессенджер с WebRTC через mediasoup SFU, шумоподавлением AI (RNNoise), каналами и реал-тайм чатом.',
      solutionEn: 'Discord-like messenger with WebRTC via mediasoup SFU, AI noise cancellation (RNNoise), channels and real-time chat.',
      valueRu: '• Работает в России\n• Минимальная задержка WebRTC SFU\n• AI шумоподавление\n• JWT авторизация\n• E2E тесты',
      valueEn: '• Works in Russia\n• Minimal latency via WebRTC SFU\n• AI noise cancellation\n• Secure JWT auth\n• E2E tests',
      techStack: JSON.stringify(['React 19','TypeScript','Fastify','PostgreSQL','Socket.io','WebRTC','mediasoup','RNNoise','Tailwind v4']),
      screenshots: '[]', videoUrl: null, liveUrl: 'https://voixgg.ru', githubUrl: null, order: 1,
    },
    {
      slug: 'finance-tracker', titleRu: 'Финансовый трекер', titleEn: 'Finance Tracker',
      taglineRu: 'Личные финансы под контролем', taglineEn: 'Personal finances under control',
      problemRu: 'Невозможно понять, куда уходят деньги — траты не структурированы, цели не отслеживаются.',
      problemEn: 'Impossible to understand where money goes — expenses not structured, goals not tracked.',
      beforeRu: 'Хаотичные записи в телефоне или таблицах, без аналитики и визуализации.',
      beforeEn: 'Chaotic notes on phone or in spreadsheets, no analytics or visualization.',
      solutionRu: 'Многоаккаунтный финтрекер с транзакциями, бюджетами по категориям, целями и аналитикой.',
      solutionEn: 'Multi-account finance tracker with transactions, category budgets, goals and analytics.',
      valueRu: '• Полная картина финансов\n• Визуальная аналитика (Recharts)\n• Отслеживание целей\n• Экспорт в Excel\n• Drag-and-drop',
      valueEn: '• Complete financial picture\n• Visual analytics (Recharts)\n• Goal tracking\n• Excel export\n• Drag-and-drop',
      techStack: JSON.stringify(['React 18','TypeScript','Node.js','PostgreSQL','Prisma','Recharts','Zustand','TailwindCSS']),
      screenshots: '[]', videoUrl: null, liveUrl: 'https://finansy-herasova.amvera.io', githubUrl: null, order: 2,
    },
    {
      slug: 'crm-system', titleRu: 'CRM система', titleEn: 'CRM System',
      taglineRu: 'Управление продажами и клиентами', taglineEn: 'Sales & Client Management',
      problemRu: 'Команды продаж теряют сделки из-за разрозненных данных в таблицах и email-переписке.',
      problemEn: 'Sales teams lose deals due to fragmented data in spreadsheets and email threads.',
      beforeRu: 'Менеджеры ведут клиентов в Excel, задачи теряются в мессенджерах.',
      beforeEn: 'Managers tracked clients in Excel, tasks got lost in messengers.',
      solutionRu: 'CRM с Kanban-доской, управлением клиентами, задачами, дашбордами и AI-поиском (RAG).',
      solutionEn: 'CRM with Kanban board, client management, tasks, dashboards and AI search (RAG).',
      valueRu: '• Единое пространство команды\n• AI-поиск (RAG + Groq)\n• Telegram интеграция\n• Роли менеджер/супервайзер\n• Kanban',
      valueEn: '• Unified team workspace\n• AI search (RAG + Groq)\n• Telegram integration\n• Role-based access\n• Kanban board',
      techStack: JSON.stringify(['React','TypeScript','Node.js','PostgreSQL','Prisma','JWT','Telegram Bot','RAG/AI','Groq']),
      screenshots: '[]', videoUrl: null, liveUrl: 'https://crm-heras-herasova.amvera.io', githubUrl: null, order: 3,
    },
  ]
  for (const p of projects) {
    await prisma.project.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, visible: true } })
  }

  console.log('✅ Auto-seed completed')
}

autoSeed()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
