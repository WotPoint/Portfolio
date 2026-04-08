import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '../../contexts/LangContext'
import type { SiteConfig } from '../../types'

interface AboutProps {
  config: SiteConfig | null
}

export default function About({ config }: AboutProps) {
  const { t } = useLang()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const skills: string[] = config?.skills
    ? JSON.parse(config.skills)
    : ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Prisma', 'Docker', 'Git']

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  }

  return (
    <section id="about" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="section-rule mb-16"
        >
          <span className="section-label">
            <span className="text-dim mr-2">02</span>
            {t('Обо мне', 'About')}
          </span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-primary mb-6 leading-tight whitespace-pre-line">
              {t('Строю продукты,\nа не просто код', 'I build products,\nnot just code')}
            </h2>
            <p className="font-jakarta text-muted leading-relaxed mb-6">
              {config
                ? t(config.bioRu, config.bioEn)
                : t(
                    'Фулстак разработчик с 2 годами опыта. Создаю веб-приложения с нуля — от дизайна до деплоя.',
                    'Full-stack developer with 2 years of experience. Building web applications from scratch — from design to deployment.'
                  )}
            </p>

            <div className="space-y-3">
              {[
                {
                  icon: '⬡',
                  label: t('UI/UX дизайн', 'UI/UX Design'),
                  desc: t('Figma, прототипы, пользовательский опыт', 'Figma, prototypes, user experience'),
                },
                {
                  icon: '⬡',
                  label: t('Backend разработка', 'Backend Development'),
                  desc: t('REST API, базы данных, аутентификация', 'REST API, databases, authentication'),
                },
                {
                  icon: '⬡',
                  label: t('Деплой', 'Deployment'),
                  desc: t('Docker, Linux, CI/CD, облачные платформы', 'Docker, Linux, CI/CD, cloud platforms'),
                },
              ].map(({ icon, label, desc }) => (
                <div key={label} className="flex gap-3 group">
                  <span className="text-accent mt-0.5 text-xs">{icon}</span>
                  <div>
                    <p className="font-jakarta text-sm font-medium text-primary">
                      {label}
                    </p>
                    <p className="font-jakarta text-xs text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            transition={{ delay: 0.2 }}
          >
            <p className="section-label mb-6">{t('Технологии', 'Tech Stack')}</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className="tech-tag cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            {/* Experience box */}
            <div className="mt-10 border border-border p-6 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 0% 100%, rgba(200,255,0,0.05) 0%, transparent 60%)',
                }}
              />
              <p className="font-mono text-xs text-dim mb-3">
                {t('// ОПЫТ', '// EXPERIENCE')}
              </p>
              <p className="font-syne font-extrabold text-5xl text-accent">2+</p>
              <p className="font-jakarta text-sm text-muted mt-2">
                {t('года в fullstack разработке', 'years in fullstack development')}
              </p>
              <div className="mt-4 h-px bg-border" />
              <p className="font-mono text-xs text-muted mt-4">
                Python · Node.js · React · TypeScript
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
