import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '../../contexts/LangContext'
import ProjectCard from './ProjectCard'
import type { Project } from '../../types'

interface ProjectsProps {
  projects: Project[]
  loading: boolean
}

export default function Projects({ projects, loading }: ProjectsProps) {
  const { t } = useLang()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-rule mb-4"
        >
          <span className="section-label">
            <span className="text-dim mr-2">03</span>
            {t('Проекты', 'Projects')}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-primary leading-tight">
            {t('Что я\nпостроил', 'What I\nbuilt')}
          </h2>
        </motion.div>

        {/* Projects list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-border p-8 animate-pulse"
              >
                <div className="h-8 bg-surface-2 rounded w-48 mb-3" />
                <div className="h-4 bg-surface-2 rounded w-32" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-border p-16 text-center">
            <p className="font-mono text-sm text-dim">
              {t('Проекты скоро появятся', 'Projects coming soon')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
