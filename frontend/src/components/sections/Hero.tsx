import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../contexts/LangContext'
import type { SiteConfig } from '../../types'

interface HeroProps {
  config: SiteConfig | null
}

export default function Hero({ config }: HeroProps) {
  const { t } = useLang()
  const cursorRef = useRef<HTMLSpanElement>(null)

  // Blinking cursor effect
  useEffect(() => {
    const el = cursorRef.current
    if (!el) return
    const id = setInterval(() => {
      el.style.opacity = el.style.opacity === '0' ? '1' : '0'
    }, 530)
    return () => clearInterval(id)
  }, [])

  const name = config ? t(config.nameRu, config.nameEn) : 'Konstantin'
  const role = config ? t(config.roleRu, config.roleEn) : t('Fullstack разработчик', 'Full-Stack Developer')
  const bio = config ? t(config.bioRu, config.bioEn) : ''

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden grid-bg noise">
      {/* Accent blob */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(200,255,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          {/* Label */}
          <motion.p variants={item} className="section-label mb-6">
            {t('Портфолио разработчика', 'Developer Portfolio')}
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={item}
            className="font-syne font-extrabold leading-none mb-4"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            {name}
            <span ref={cursorRef} className="text-accent ml-1">
              _
            </span>
          </motion.h1>

          {/* Role */}
          <motion.div variants={item} className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-accent" />
            <p className="font-mono text-sm text-muted tracking-widest uppercase">
              {role}
            </p>
          </motion.div>

          {/* Bio */}
          {bio && (
            <motion.p
              variants={item}
              className="font-jakarta text-base text-muted leading-relaxed max-w-xl mb-10"
            >
              {bio}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 bg-accent text-bg font-syne font-bold text-sm px-6 py-3 hover:bg-white transition-colors"
            >
              {t('Смотреть проекты', 'View Projects')}
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-border text-primary font-syne font-bold text-sm px-6 py-3 hover:border-accent hover:text-accent transition-all"
            >
              {t('Связаться', 'Get in Touch')}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="mt-16 flex flex-wrap gap-8 border-t border-border pt-8"
          >
            {[
              { num: '2+', label: t('года опыта', 'years exp.') },
              { num: '3+', label: t('проекта запущено', 'shipped projects') },
              { num: '5+', label: t('технологий', 'technologies') },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="font-syne font-extrabold text-3xl text-accent">
                  {num}
                </p>
                <p className="font-mono text-xs text-muted mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-dim">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  )
}
