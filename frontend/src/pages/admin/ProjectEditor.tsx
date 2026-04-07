import { useEffect, useState, FormEvent, ChangeEvent, DragEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  uploadScreenshots,
  deleteUpload,
} from '../../lib/api'
import type { Project } from '../../types'

type FormData = {
  slug: string
  titleRu: string
  titleEn: string
  taglineRu: string
  taglineEn: string
  problemRu: string
  problemEn: string
  beforeRu: string
  beforeEn: string
  solutionRu: string
  solutionEn: string
  valueRu: string
  valueEn: string
  techStack: string
  videoUrl: string
  liveUrl: string
  githubUrl: string
  order: number
  visible: boolean
  screenshots: string[]
}

const EMPTY: FormData = {
  slug: '', titleRu: '', titleEn: '', taglineRu: '', taglineEn: '',
  problemRu: '', problemEn: '', beforeRu: '', beforeEn: '',
  solutionRu: '', solutionEn: '', valueRu: '', valueEn: '',
  techStack: '', videoUrl: '', liveUrl: '', githubUrl: '',
  order: 0, visible: true, screenshots: [],
}

function projectToForm(p: Project): FormData {
  return {
    slug: p.slug,
    titleRu: p.titleRu, titleEn: p.titleEn,
    taglineRu: p.taglineRu, taglineEn: p.taglineEn,
    problemRu: p.problemRu, problemEn: p.problemEn,
    beforeRu: p.beforeRu, beforeEn: p.beforeEn,
    solutionRu: p.solutionRu, solutionEn: p.solutionEn,
    valueRu: p.valueRu, valueEn: p.valueEn,
    techStack: (JSON.parse(p.techStack || '[]') as string[]).join(', '),
    videoUrl: p.videoUrl || '', liveUrl: p.liveUrl || '', githubUrl: p.githubUrl || '',
    order: p.order, visible: p.visible,
    screenshots: JSON.parse(p.screenshots || '[]') as string[],
  }
}

// Client-side image compression
async function compressImage(file: File, maxWidth = 1920, quality = 0.82): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file)
          const name = file.name.replace(/\.[^.]+$/, '.jpg')
          resolve(new File([blob], name, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

export default function AdminProjectEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [form, setForm] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'ru' | 'en'>('ru')
  const [dragOver, setDragOver] = useState<number | null>(null)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  useEffect(() => {
    if (isNew) return
    adminGetProjects()
      .then((projects) => {
        const project = projects.find((p) => p.id === id)
        if (project) setForm(projectToForm(project))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id, isNew])

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const remaining = 5 - form.screenshots.length
    if (remaining <= 0) return
    setUploading(true)
    try {
      const compressed = await Promise.all(files.slice(0, remaining).map(compressImage))
      const urls = await uploadScreenshots(compressed)
      setField('screenshots', [...form.screenshots, ...urls])
    } catch {
      setError('Ошибка загрузки файлов')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleRemoveShot(url: string) {
    const filename = url.split('/').pop()!
    try { await deleteUpload(filename) } catch { /* ignore */ }
    setField('screenshots', form.screenshots.filter((s) => s !== url))
  }

  // Drag-and-drop reordering
  function onDragStart(e: DragEvent, index: number) {
    setDraggedIdx(index)
    e.dataTransfer.effectAllowed = 'move'
  }
  function onDragOver(e: DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(index)
  }
  function onDrop(e: DragEvent, index: number) {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index) {
      setDragOver(null); setDraggedIdx(null); return
    }
    const updated = [...form.screenshots]
    const [moved] = updated.splice(draggedIdx, 1)
    updated.splice(index, 0, moved)
    setField('screenshots', updated)
    setDragOver(null); setDraggedIdx(null)
  }
  function onDragEnd() {
    setDragOver(null); setDraggedIdx(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const techArr = form.techStack.split(',').map((s) => s.trim()).filter(Boolean)
      const payload = {
        ...form,
        techStack: JSON.stringify(techArr),
        screenshots: JSON.stringify(form.screenshots),
        videoUrl: form.videoUrl || null,
        liveUrl: form.liveUrl || null,
        githubUrl: form.githubUrl || null,
      }
      if (isNew) await adminCreateProject(payload)
      else await adminUpdateProject(id!, payload)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="font-mono text-sm text-muted">Загрузка...</span>
      </div>
    )
  }

  const inputCls = 'w-full bg-surface border border-border px-4 py-2.5 text-primary font-jakarta text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-dim'
  const textareaCls = 'w-full bg-surface border border-border px-4 py-2.5 text-primary font-jakarta text-sm focus:outline-none focus:border-accent transition-colors resize-none'
  const labelCls = 'block font-mono text-xs text-muted mb-1.5 uppercase tracking-wider'

  const bilingualFields: { key: 'tagline' | 'problem' | 'before' | 'solution' | 'value'; label: string; rows: number }[] = [
    { key: 'tagline', label: 'Tagline', rows: 2 },
    { key: 'problem', label: 'Проблема / Problem', rows: 3 },
    { key: 'before', label: 'Как было / Before', rows: 3 },
    { key: 'solution', label: 'Решение / Solution', rows: 4 },
    { key: 'value', label: 'Ценность / Value', rows: 4 },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Admin nav */}
      <header className="border-b border-border sticky top-0 bg-bg/95 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-mono text-xs text-muted hover:text-primary transition-colors">
              ← Проекты
            </Link>
            <span className="font-syne font-bold text-sm text-primary">
              {isNew ? 'Новый проект' : `Редактировать: ${form.titleRu || '...'}`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Preview button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs border border-border px-3 py-1.5 text-muted hover:border-accent hover:text-accent transition-all"
            >
              Preview ↗
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Slug + order */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Slug (URL)</label>
              <input className={inputCls} value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="my-project" required />
            </div>
            <div>
              <label className={labelCls}>Порядок</label>
              <input type="number" className={inputCls} value={form.order} onChange={(e) => setField('order', Number(e.target.value))} />
            </div>
          </div>

          {/* Visible toggle */}
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <div onClick={() => setField('visible', !form.visible)} className={`w-10 h-5 rounded-full transition-colors relative ${form.visible ? 'bg-accent' : 'bg-border'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-bg transition-transform ${form.visible ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="font-mono text-xs text-muted">{form.visible ? 'Видимый на сайте' : 'Скрыт'}</span>
          </label>

          {/* Titles */}
          <div>
            <p className="font-mono text-xs text-accent mb-4 uppercase tracking-wider">Названия</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Название (RU)</label>
                <input className={inputCls} value={form.titleRu} onChange={(e) => setField('titleRu', e.target.value)} placeholder="CRM Система" required />
              </div>
              <div>
                <label className={labelCls}>Title (EN)</label>
                <input className={inputCls} value={form.titleEn} onChange={(e) => setField('titleEn', e.target.value)} placeholder="CRM System" required />
              </div>
            </div>
          </div>

          {/* Bilingual content with tabs */}
          <div>
            <div className="flex items-center gap-1 mb-6">
              <p className="font-mono text-xs text-accent uppercase tracking-wider mr-4">Контент</p>
              {(['ru', 'en'] as const).map((l) => (
                <button key={l} type="button" onClick={() => setActiveTab(l)}
                  className={`font-mono text-xs px-3 py-1 border transition-all ${activeTab === l ? 'border-accent text-accent' : 'border-border text-muted hover:border-accent/50'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="space-y-5">
              {bilingualFields.map(({ key, label, rows }) => {
                const fieldKey = (activeTab === 'ru' ? `${key}Ru` : `${key}En`) as keyof FormData
                return (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <textarea className={textareaCls} rows={rows}
                      value={form[fieldKey] as string}
                      onChange={(e) => setField(fieldKey, e.target.value)} required />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <label className={labelCls}>Стек (через запятую)</label>
            <input className={inputCls} value={form.techStack} onChange={(e) => setField('techStack', e.target.value)} placeholder="React, TypeScript, Node.js" />
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-xs text-accent mb-4 uppercase tracking-wider">Ссылки</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Live URL</label>
                <input type="url" className={inputCls} value={form.liveUrl} onChange={(e) => setField('liveUrl', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>GitHub URL</label>
                <input type="url" className={inputCls} value={form.githubUrl} onChange={(e) => setField('githubUrl', e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className={labelCls}>Video URL (embed)</label>
                <input type="url" className={inputCls} value={form.videoUrl} onChange={(e) => setField('videoUrl', e.target.value)} placeholder="https://youtube.com/embed/..." />
              </div>
            </div>
          </div>

          {/* Screenshots with drag-and-drop */}
          <div>
            <p className="font-mono text-xs text-accent mb-2 uppercase tracking-wider">
              Скриншоты ({form.screenshots.length}/5)
            </p>
            <p className="font-mono text-xs text-dim mb-4">
              Перетаскивай для изменения порядка. Изображения автоматически сжимаются.
            </p>

            {form.screenshots.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {form.screenshots.map((url, i) => (
                  <div
                    key={url}
                    draggable
                    onDragStart={(e) => onDragStart(e, i)}
                    onDragOver={(e) => onDragOver(e, i)}
                    onDrop={(e) => onDrop(e, i)}
                    onDragEnd={onDragEnd}
                    className={`relative group aspect-video bg-surface-2 border overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
                      dragOver === i ? 'border-accent scale-105' : 'border-border'
                    } ${draggedIdx === i ? 'opacity-40' : ''}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {/* Drag handle indicator */}
                    <div className="absolute top-1 left-1 w-5 h-5 bg-bg/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-muted text-xs">⠿</span>
                    </div>
                    {/* Order number */}
                    <div className="absolute bottom-1 left-1 bg-bg/70 px-1.5 font-mono text-xs text-muted">
                      {i + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveShot(url)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-900/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {form.screenshots.length < 5 && (
              <label className="flex items-center gap-3 cursor-pointer border border-dashed border-border px-5 py-4 hover:border-accent/50 transition-colors w-fit">
                <span className="font-mono text-xs text-muted">
                  {uploading ? 'Загрузка и сжатие...' : '+ Загрузить скриншоты'}
                </span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            )}
          </div>

          {error && (
            <p className="font-mono text-xs text-red-400 border border-red-900/40 px-3 py-2">{error}</p>
          )}

          <div className="flex gap-4 pt-4 border-t border-border">
            <button type="submit" disabled={saving}
              className="bg-accent text-bg font-syne font-bold text-sm px-8 py-3 hover:bg-white transition-colors disabled:opacity-50">
              {saving ? 'Сохранение...' : isNew ? 'Создать' : 'Сохранить'}
            </button>
            <Link to="/admin"
              className="border border-border font-syne font-bold text-sm px-8 py-3 text-muted hover:border-accent hover:text-accent transition-all">
              Отмена
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
