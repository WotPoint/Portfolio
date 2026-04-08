import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '../../contexts/LangContext'
import type { SiteConfig } from '../../types'

interface ContactProps {
  config: SiteConfig | null
}

export default function Contact({ config }: ContactProps) {
  const { t } = useLang()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [copied, setCopied] = useState(false)

  const telegramUrl = config?.telegramUrl || 'https://t.me/Herasova'
  const telegramHandle = telegramUrl.replace(/^https?:\/\/t\.me\//, '@')
  const email = config?.email || 'kirkaif@gmail.com'

  function copyEmail() {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  }

  return (
    <section id="contact" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="section-rule mb-16"
        >
          <span className="section-label">
            <span className="text-dim mr-2">04</span>
            {t('Контакт', 'Contact')}
          </span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-primary leading-tight mb-6 whitespace-pre-line">
              {t('Готов к\nновым проектам', 'Open to\nnew projects')}
            </h2>
            <p className="font-jakarta text-muted leading-relaxed">
              {t(
                'Если у вас есть интересный проект или вакансия — напишите мне. Отвечу быстро.',
                'If you have an interesting project or job opportunity — reach out. I respond quickly.'
              )}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 border border-border p-5 hover:border-accent transition-all"
            >
              <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-accent group-hover:bg-accent-dim transition-all flex-shrink-0">
                <svg className="w-5 h-5 text-muted group-hover:text-accent transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div>
                <p className="font-mono text-xs text-dim mb-1">Telegram</p>
                <p className="font-syne font-semibold text-primary group-hover:text-accent transition-colors">
                  {telegramHandle}
                </p>
              </div>
              <svg className="w-4 h-4 text-dim ml-auto group-hover:text-accent group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>

            {/* Email with copy button */}
            <div className="flex items-stretch border border-border hover:border-accent transition-all group">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 p-5 flex-1 min-w-0"
              >
                <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-accent group-hover:bg-accent-dim transition-all flex-shrink-0">
                  <svg className="w-5 h-5 text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-dim mb-1">Email</p>
                  <p className="font-syne font-semibold text-primary group-hover:text-accent transition-colors truncate">
                    {email}
                  </p>
                </div>
              </a>

              {/* Copy button */}
              <button
                onClick={copyEmail}
                title={t('Скопировать email', 'Copy email')}
                className="border-l border-border px-4 flex items-center text-muted hover:text-accent hover:bg-accent-dim transition-all flex-shrink-0"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
