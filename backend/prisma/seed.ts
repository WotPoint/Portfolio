import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin123!',
    10
  )
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'kirkaif@gmail.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'kirkaif@gmail.com',
      password: hashedPassword,
    },
  })

  // Site config
  const configs = [
    { key: 'nameRu', value: 'Константин' },
    { key: 'nameEn', value: 'Konstantin' },
    { key: 'roleRu', value: 'Fullstack разработчик' },
    { key: 'roleEn', value: 'Full-Stack Developer' },
    {
      key: 'bioRu',
      value:
        'Создаю веб-приложения с нуля — от дизайна до деплоя. Python, Node.js, React, TypeScript. 2 года опыта в разработке полного стека, UI/UX дизайне и работе с базами данных.',
    },
    {
      key: 'bioEn',
      value:
        'I build web applications from scratch — from design to deployment. Python, Node.js, React, TypeScript. 2 years of experience in full-stack development, UI/UX design, and database work.',
    },
    {
      key: 'skills',
      value: JSON.stringify([
        'React',
        'TypeScript',
        'Node.js',
        'Python',
        'PostgreSQL',
        'Prisma',
        'Docker',
        'Git',
        'UI/UX',
        'REST API',
        'WebRTC',
        'Socket.io',
      ]),
    },
    { key: 'telegramUrl', value: 'https://t.me/Herasova' },
    { key: 'email', value: 'kirkaif@gmail.com' },
    { key: 'githubUrl', value: '' },
  ]

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }

  // Projects
  const projects = [
    {
      slug: 'voischat',
      titleRu: 'VoisChat',
      titleEn: 'VoisChat',
      taglineRu: 'Голосовой чат для геймеров',
      taglineEn: 'Voice chat for gamers',
      problemRu:
        'Русскоязычным геймерам нужен надёжный голосовой чат без зависимости от иностранных сервисов.',
      problemEn:
        'Russian-speaking gamers need a reliable voice chat without dependency on foreign services.',
      beforeRu:
        'Discord — иностранный сервис с рисками блокировки, без русской поддержки и адаптации под локальный рынок.',
      beforeEn:
        'Discord — a foreign service with blocking risks, no Russian support, not adapted for the local market.',
      solutionRu:
        'Discord-подобный голосовой мессенджер с WebRTC через mediasoup SFU, шумоподавлением через AI (RNNoise WASM), каналами и реал-тайм чатом на Socket.io.',
      solutionEn:
        'Discord-like voice messenger with WebRTC via mediasoup SFU, AI noise cancellation (RNNoise WASM), channels and real-time chat on Socket.io.',
      valueRu:
        '• Работает в России без блокировок\n• Минимальная задержка через WebRTC SFU\n• Профессиональное шумоподавление AI\n• Безопасная JWT авторизация\n• E2E тесты на Playwright',
      valueEn:
        '• Works in Russia without blocks\n• Minimal latency via WebRTC SFU\n• Professional AI noise cancellation\n• Secure JWT authentication\n• E2E tests with Playwright',
      techStack: JSON.stringify([
        'React 19',
        'TypeScript',
        'Fastify',
        'PostgreSQL',
        'Socket.io',
        'WebRTC',
        'mediasoup',
        'RNNoise',
        'Tailwind v4',
        'Playwright',
      ]),
      screenshots: JSON.stringify([]),
      videoUrl: '',
      liveUrl: 'https://voixgg.ru',
      githubUrl: '',
      order: 1,
    },
    {
      slug: 'finance-tracker',
      titleRu: 'Финансовый трекер',
      titleEn: 'Finance Tracker',
      taglineRu: 'Личные финансы под контролем',
      taglineEn: 'Personal finances under control',
      problemRu:
        'Невозможно понять, куда уходят деньги — траты не структурированы, бюджет не планируется, цели не отслеживаются.',
      problemEn:
        'Impossible to understand where money goes — expenses not structured, budget not planned, goals not tracked.',
      beforeRu:
        'Хаотичные записи в телефоне или таблицах, без аналитики, без визуализации, без напоминаний по бюджету.',
      beforeEn:
        'Chaotic notes on phone or in spreadsheets, no analytics, no visualization, no budget alerts.',
      solutionRu:
        'Многоаккаунтный финтрекер с управлением транзакциями, бюджетами по категориям, финансовыми целями, календарём и интерактивными аналитическими графиками.',
      solutionEn:
        'Multi-account finance tracker with transaction management, category budgets, financial goals, calendar view, and interactive analytics charts.',
      valueRu:
        '• Полная картина финансов в одном месте\n• Визуальная аналитика и графики (Recharts)\n• Отслеживание целей и бюджетов\n• Экспорт в Excel\n• Drag-and-drop интерфейс',
      valueEn:
        '• Complete financial picture in one place\n• Visual analytics and charts (Recharts)\n• Goal and budget tracking\n• Excel export\n• Drag-and-drop interface',
      techStack: JSON.stringify([
        'React 18',
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'Prisma',
        'Recharts',
        'Zustand',
        'TailwindCSS',
        'Vitest',
        'dnd-kit',
      ]),
      screenshots: JSON.stringify([]),
      videoUrl: '',
      liveUrl: 'https://finansy-herasova.amvera.io',
      githubUrl: '',
      order: 2,
    },
    {
      slug: 'crm-system',
      titleRu: 'CRM система',
      titleEn: 'CRM System',
      taglineRu: 'Управление продажами и клиентами',
      taglineEn: 'Sales & Client Management',
      problemRu:
        'Команды продаж теряют сделки из-за разрозненных данных в таблицах и email-переписке — нет единой картины по клиентам, задачам и воронке продаж.',
      problemEn:
        'Sales teams lose deals due to fragmented data in spreadsheets and email threads — no unified view of clients, tasks, and sales pipeline.',
      beforeRu:
        'Менеджеры ведут клиентов в Excel, задачи теряются в мессенджерах, руководитель не видит реальной картины продаж.',
      beforeEn:
        'Managers tracked clients in Excel, tasks got lost in messengers, supervisors had no real-time sales visibility.',
      solutionRu:
        'Полноценная CRM с Kanban-доской сделок, управлением клиентами, системой задач, дашбордами для менеджеров и супервайзеров, интеграцией с Telegram и AI-поиском по документам (RAG).',
      solutionEn:
        'Full CRM with deal Kanban board, client management, task system, role-based dashboards for managers and supervisors, Telegram integration, and AI document search (RAG).',
      valueRu:
        '• Единое пространство для всей команды\n• AI-поиск по базе знаний (RAG + Groq)\n• Интеграция с Telegram ботом\n• Разграничение ролей (менеджер / супервайзер)\n• Kanban-доска сделок',
      valueEn:
        '• Unified workspace for the whole team\n• AI knowledge base search (RAG + Groq)\n• Telegram bot integration\n• Role-based access (manager / supervisor)\n• Deal Kanban board',
      techStack: JSON.stringify([
        'React',
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'Prisma',
        'JWT',
        'Telegram Bot',
        'RAG/AI',
        'Groq',
        'Google Sheets API',
      ]),
      screenshots: JSON.stringify([]),
      videoUrl: '',
      liveUrl: 'https://crm-heras-herasova.amvera.io',
      githubUrl: '',
      order: 3,
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    })
  }

  console.log('✅ Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
