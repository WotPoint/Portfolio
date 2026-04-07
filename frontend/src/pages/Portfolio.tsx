import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Projects from '../components/sections/Projects'
import Contact from '../components/sections/Contact'
import CustomCursor from '../components/ui/CustomCursor'
import Ticker from '../components/ui/Ticker'
import ErrorBoundary from '../components/ui/ErrorBoundary'
import { getProjects, getConfig } from '../lib/api'
import type { Project, SiteConfig } from '../types'

const DEFAULT_TICKER_ITEMS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL',
  'Prisma', 'Docker', 'WebRTC', 'Socket.io', 'REST API', 'UI/UX',
]

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProjects(), getConfig()])
      .then(([p, c]) => {
        setProjects(p)
        setConfig(c as unknown as SiteConfig)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const tickerItems = config?.skills
    ? JSON.parse(config.skills) as string[]
    : DEFAULT_TICKER_ITEMS

  return (
    <div className="min-h-screen bg-bg text-primary">
      <CustomCursor />
      <Navbar />
      <main>
        <ErrorBoundary>
          <Hero config={config} />
        </ErrorBoundary>

        <Ticker items={tickerItems} />

        <ErrorBoundary>
          <About config={config} />
        </ErrorBoundary>

        <Ticker items={[...tickerItems].reverse()} />

        <ErrorBoundary>
          <Projects projects={projects} loading={loading} />
        </ErrorBoundary>

        <ErrorBoundary>
          <Contact config={config} />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
