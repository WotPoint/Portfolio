import { useEffect, useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getConfig, adminUpdateConfig, changePassword } from '../../lib/api'
import type { SiteConfig } from '../../types'

export default function AdminSiteConfig() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [config, setConfig] = useState<Partial<SiteConfig>>({})
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwdError, setPwdError] = useState('')
  const [pwdSaved, setPwdSaved] = useState(false)
  const [pwdSaving, setPwdSaving] = useState(false)
  const [skillsInput, setSkillsInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getConfig()
      .then((c) => {
        const cfg = c as unknown as SiteConfig
        setConfig(cfg)
        const skills: string[] = cfg.skills ? JSON.parse(cfg.skills) : []
        setSkillsInput(skills.join(', '))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function setField(key: keyof SiteConfig, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault()
    setPwdError('')
    if (newPassword !== confirmPassword) {
      setPwdError('Пароли не совпадают')
      return
    }
    if (newPassword.length < 8) {
      setPwdError('Минимум 8 символов')
      return
    }
    setPwdSaving(true)
    try {
      await changePassword(currentPassword, newPassword)
      setPwdSaved(true)
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
      setTimeout(() => setPwdSaved(false), 3000)
    } catch (err) {
      setPwdError(err instanceof Error ? err.message : 'Ошибка')
    } finally {
      setPwdSaving(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const skillsArr = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const payload = {
      ...config,
      skills: JSON.stringify(skillsArr),
    }
    try {
      await adminUpdateConfig(payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    'w-full bg-surface border border-border px-4 py-2.5 text-primary font-jakarta text-sm focus:outline-none focus:border-accent transition-colors'
  const textareaCls =
    'w-full bg-surface border border-border px-4 py-2.5 text-primary font-jakarta text-sm focus:outline-none focus:border-accent transition-colors resize-none'
  const labelCls = 'block font-mono text-xs text-muted mb-1.5 uppercase tracking-wider'

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="font-mono text-sm text-muted">Загрузка...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Admin nav */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-syne font-bold text-sm text-accent">Admin</span>
            <nav className="flex items-center gap-4">
              <Link to="/admin" className="font-mono text-xs text-muted hover:text-primary transition-colors">
                Проекты
              </Link>
              <Link to="/admin/config" className="font-mono text-xs text-primary border-b border-accent pb-0.5">
                Настройки
              </Link>
              <a href="/" className="font-mono text-xs text-muted hover:text-primary transition-colors">
                ← Сайт
              </a>
            </nav>
          </div>
          <button
            onClick={() => { signOut(); navigate('/admin/login') }}
            className="font-mono text-xs text-muted hover:text-red-400 transition-colors"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-syne font-extrabold text-2xl text-primary mb-8">
          Настройки сайта
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Names & roles */}
          <div>
            <p className="font-mono text-xs text-accent mb-4 uppercase tracking-wider">Имя и роль</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Имя (RU)</label>
                <input
                  className={inputCls}
                  value={config.nameRu || ''}
                  onChange={(e) => setField('nameRu', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Name (EN)</label>
                <input
                  className={inputCls}
                  value={config.nameEn || ''}
                  onChange={(e) => setField('nameEn', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Роль (RU)</label>
                <input
                  className={inputCls}
                  value={config.roleRu || ''}
                  onChange={(e) => setField('roleRu', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Role (EN)</label>
                <input
                  className={inputCls}
                  value={config.roleEn || ''}
                  onChange={(e) => setField('roleEn', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="font-mono text-xs text-accent mb-4 uppercase tracking-wider">Биография</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Bio (RU)</label>
                <textarea
                  className={textareaCls}
                  rows={4}
                  value={config.bioRu || ''}
                  onChange={(e) => setField('bioRu', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Bio (EN)</label>
                <textarea
                  className={textareaCls}
                  rows={4}
                  value={config.bioEn || ''}
                  onChange={(e) => setField('bioEn', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className={labelCls}>Технологии (через запятую)</label>
            <input
              className={inputCls}
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, Python"
            />
          </div>

          {/* Contacts */}
          <div>
            <p className="font-mono text-xs text-accent mb-4 uppercase tracking-wider">Контакты</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Telegram URL</label>
                <input
                  type="url"
                  className={inputCls}
                  value={config.telegramUrl || ''}
                  onChange={(e) => setField('telegramUrl', e.target.value)}
                  placeholder="https://t.me/..."
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  className={inputCls}
                  value={config.email || ''}
                  onChange={(e) => setField('email', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>GitHub URL</label>
                <input
                  type="url"
                  className={inputCls}
                  value={config.githubUrl || ''}
                  onChange={(e) => setField('githubUrl', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-bg font-syne font-bold text-sm px-8 py-3 hover:bg-white transition-colors disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            {saved && (
              <span className="font-mono text-xs text-accent">
                ✓ Сохранено
              </span>
            )}
          </div>
        </form>

        {/* Password change section */}
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="font-syne font-extrabold text-xl text-primary mb-6">
            Смена пароля
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
            <div>
              <label className={labelCls}>Текущий пароль</label>
              <input
                type="password"
                className={inputCls}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Новый пароль</label>
              <input
                type="password"
                className={inputCls}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Минимум 8 символов"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Повторите новый пароль</label>
              <input
                type="password"
                className={inputCls}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {pwdError && (
              <p className="font-mono text-xs text-red-400 border border-red-900/40 px-3 py-2">
                {pwdError}
              </p>
            )}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={pwdSaving}
                className="bg-accent text-bg font-syne font-bold text-sm px-6 py-2.5 hover:bg-white transition-colors disabled:opacity-50"
              >
                {pwdSaving ? 'Сохранение...' : 'Сменить пароль'}
              </button>
              {pwdSaved && (
                <span className="font-mono text-xs text-accent">✓ Пароль изменён</span>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
