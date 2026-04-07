import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../../contexts/LangContext'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '#projects', label: t('Проекты', 'Projects') },
    { href: '#about', label: t('Обо мне', 'About') },
    { href: '#contact', label: t('Контакт', 'Contact') },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/90 backdrop-blur-md border-b border-border' : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-syne font-bold text-sm tracking-widest text-primary uppercase hover:text-accent transition-colors"
        >
          K<span className="text-accent">.</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-jakarta text-sm text-muted hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            className="font-mono text-xs border border-border px-3 py-1 text-muted hover:border-accent hover:text-accent transition-all"
          >
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-muted hover:text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span
              className={`block h-px bg-current transition-all origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
            />
            <span
              className={`block h-px bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-px bg-current transition-all origin-center ${menuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-jakarta text-sm text-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                className="font-mono text-xs border border-border px-3 py-1 text-muted hover:border-accent hover:text-accent transition-all w-fit"
              >
                {lang === 'ru' ? 'EN' : 'RU'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
