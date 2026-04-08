import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useLang } from '../../contexts/LangContext'
import type { Project } from '../../types'

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { t } = useLang()
  const [expanded, setExpanded] = useState(false)
  const [activeShot, setActiveShot] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const title = t(project.titleRu, project.titleEn)
  const tagline = t(project.taglineRu, project.taglineEn)
  const problem = t(project.problemRu, project.problemEn)
  const before = t(project.beforeRu, project.beforeEn)
  const solution = t(project.solutionRu, project.solutionEn)
  const value = t(project.valueRu, project.valueEn)

  const techStack: string[] = JSON.parse(project.techStack || '[]')
  const screenshots: string[] = JSON.parse(project.screenshots || '[]')

  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
      className="border border-border hover:border-accent/30 transition-colors"
    >
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 sm:p-6 md:p-8 flex items-start justify-between gap-3 group"
      >
        <div className="flex items-start gap-4 min-w-0">
          <span className="font-mono text-xs text-dim pt-1 flex-shrink-0">{num}</span>
          <div className="min-w-0">
            <h3 className="font-syne font-extrabold text-xl sm:text-2xl md:text-3xl text-primary group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="font-mono text-xs text-muted mt-1">{tagline}</p>
            {/* Tech stack preview */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {techStack.slice(0, 4).map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
              {techStack.length > 4 && (
                <span className="tech-tag">+{techStack.length - 4}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-mono text-xs border border-border px-2 sm:px-3 py-1.5 text-muted hover:border-accent hover:text-accent transition-all hidden sm:inline-flex items-center gap-1"
            >
              {t('Открыть', 'Live')} ↗
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-mono text-xs border border-border w-8 h-8 flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all sm:hidden"
              aria-label={t('Открыть', 'Live')}
            >
              ↗
            </a>
          )}
          <motion.div
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-8 h-8 border border-border flex items-center justify-center text-muted group-hover:border-accent group-hover:text-accent transition-all flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
            </svg>
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-t border-border px-6 md:px-8 py-8">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Left: problem/solution/value */}
                <div className="space-y-8">
                  {/* Problem */}
                  <div>
                    <p className="section-label mb-3">
                      {t('Проблема', 'Problem')}
                    </p>
                    <p className="font-jakarta text-sm text-muted leading-relaxed">
                      {problem}
                    </p>
                  </div>

                  {/* Before */}
                  <div>
                    <p className="section-label mb-3">
                      {t('Как было раньше', 'Before')}
                    </p>
                    <div className="border-l-2 border-dim pl-4">
                      <p className="font-jakarta text-sm text-muted leading-relaxed italic">
                        {before}
                      </p>
                    </div>
                  </div>

                  {/* Solution */}
                  <div>
                    <p className="section-label mb-3">
                      {t('Решение', 'Solution')}
                    </p>
                    <p className="font-jakarta text-sm text-muted leading-relaxed">
                      {solution}
                    </p>
                  </div>

                  {/* Value */}
                  <div>
                    <p className="section-label mb-3">
                      {t('Ценность', 'Value')}
                    </p>
                    <div className="space-y-2">
                      {value.split('\n').filter(Boolean).map((line, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-accent text-xs mt-0.5 flex-shrink-0">▸</span>
                          <p className="font-jakarta text-sm text-muted">
                            {line.replace(/^•\s*/, '')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Full tech stack */}
                  <div>
                    <p className="section-label mb-3">
                      {t('Стек', 'Stack')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {techStack.map((tech) => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: screenshots + video */}
                <div className="space-y-6">
                  {/* Screenshots */}
                  <div>
                    <p className="section-label mb-3">
                      {t('Скриншоты', 'Screenshots')}
                    </p>

                    {screenshots.length > 0 ? (
                      <>
                        {/* Main screenshot */}
                        <div className="aspect-video bg-surface-2 border border-border overflow-hidden mb-2">
                          <img
                            src={screenshots[activeShot]}
                            alt={`${title} screenshot ${activeShot + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Thumbnails */}
                        {screenshots.length > 1 && (
                          <div className="flex gap-2">
                            {screenshots.map((src, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveShot(i)}
                                className={`flex-1 aspect-video bg-surface-2 border overflow-hidden transition-all ${
                                  activeShot === i ? 'border-accent' : 'border-border'
                                }`}
                              >
                                <img
                                  src={src}
                                  alt=""
                                  className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Placeholder grid */
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="aspect-video bg-surface-2 border border-dashed border-border flex items-center justify-center"
                          >
                            <span className="font-mono text-xs text-dim">
                              {t('скриншот', 'screenshot')} {i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video demo */}
                  <div>
                    <p className="section-label mb-3">
                      {t('Видео-демо', 'Video Demo')}
                    </p>
                    {project.videoUrl ? (
                      <div className="aspect-video bg-surface-2 border border-border overflow-hidden">
                        <iframe
                          src={project.videoUrl}
                          className="w-full h-full"
                          allowFullScreen
                          title={`${title} demo`}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-surface-2 border border-dashed border-border flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 border border-dashed border-border rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-dim" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <span className="font-mono text-xs text-dim">
                          {t('видео-демо', 'video demo')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 border border-accent/40 px-5 py-3 hover:bg-accent-dim transition-all"
                    >
                      <span className="font-syne font-bold text-sm text-accent">
                        {t('Открыть проект', 'Open Project')}
                      </span>
                      <svg className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
