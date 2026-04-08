import { useLang } from '../../contexts/LangContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-dim">
          © {new Date().getFullYear()} Konstantin. {t('Все права защищены.', 'All rights reserved.')}
        </span>
        <span className="font-mono text-xs text-dim">
          {t('Разработано с нуля', 'Built from scratch')} — React + Node.js
        </span>
      </div>
    </footer>
  )
}
