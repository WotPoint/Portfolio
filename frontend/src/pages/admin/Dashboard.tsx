import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminGetProjects, adminDeleteProject, adminReorderProjects } from '../../lib/api'
import type { Project } from '../../types'

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    adminGetProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить проект "${title}"?`)) return
    setDeleting(id)
    try {
      await adminDeleteProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert('Ошибка при удалении')
    } finally {
      setDeleting(null)
    }
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return
    const updated = [...projects]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    const reordered = updated.map((p, i) => ({ ...p, order: i + 1 }))
    setProjects(reordered)
    await adminReorderProjects(reordered.map((p) => ({ id: p.id, order: p.order })))
  }

  async function handleMoveDown(index: number) {
    if (index === projects.length - 1) return
    const updated = [...projects]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    const reordered = updated.map((p, i) => ({ ...p, order: i + 1 }))
    setProjects(reordered)
    await adminReorderProjects(reordered.map((p) => ({ id: p.id, order: p.order })))
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Admin nav */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-syne font-bold text-sm text-accent">Admin</span>
            <nav className="flex items-center gap-4">
              <Link
                to="/admin"
                className="font-mono text-xs text-primary border-b border-accent pb-0.5"
              >
                Проекты
              </Link>
              <Link
                to="/admin/config"
                className="font-mono text-xs text-muted hover:text-primary transition-colors"
              >
                Настройки
              </Link>
              <a
                href="/"
                className="font-mono text-xs text-muted hover:text-primary transition-colors"
              >
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

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-syne font-extrabold text-2xl text-primary">
            Проекты
          </h1>
          <Link
            to="/admin/projects/new"
            className="bg-accent text-bg font-syne font-bold text-xs px-5 py-2.5 hover:bg-white transition-colors"
          >
            + Добавить проект
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface border border-border animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-border p-16 text-center">
            <p className="font-mono text-sm text-dim mb-4">Проектов пока нет</p>
            <Link
              to="/admin/projects/new"
              className="font-mono text-xs text-accent hover:underline"
            >
              Добавить первый проект
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="flex items-center gap-4 bg-surface border border-border px-5 py-4 hover:border-accent/30 transition-colors"
              >
                {/* Order controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-dim hover:text-muted disabled:opacity-20 transition-colors text-xs leading-none"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === projects.length - 1}
                    className="text-dim hover:text-muted disabled:opacity-20 transition-colors text-xs leading-none"
                  >
                    ▼
                  </button>
                </div>

                <span className="font-mono text-xs text-dim w-6">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="font-syne font-semibold text-sm text-primary truncate">
                    {project.titleRu}
                  </p>
                  <p className="font-mono text-xs text-muted truncate">
                    {project.taglineRu}
                  </p>
                </div>

                {/* Visible badge */}
                <span
                  className={`font-mono text-xs px-2 py-0.5 ${
                    project.visible
                      ? 'text-accent border border-accent/30'
                      : 'text-dim border border-dim'
                  }`}
                >
                  {project.visible ? 'visible' : 'hidden'}
                </span>

                {/* Live link */}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-muted hover:text-accent transition-colors"
                  >
                    ↗
                  </a>
                )}

                {/* Actions */}
                <Link
                  to={`/admin/projects/${project.id}`}
                  className="font-mono text-xs border border-border px-3 py-1 text-muted hover:border-accent hover:text-accent transition-all"
                >
                  Изменить
                </Link>
                <button
                  onClick={() => handleDelete(project.id, project.titleRu)}
                  disabled={deleting === project.id}
                  className="font-mono text-xs border border-border px-3 py-1 text-muted hover:border-red-900 hover:text-red-400 transition-all disabled:opacity-50"
                >
                  {deleting === project.id ? '...' : 'Удалить'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
