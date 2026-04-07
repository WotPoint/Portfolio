export interface Project {
  id: string
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
  techStack: string // JSON string → string[]
  screenshots: string // JSON string → string[]
  videoUrl: string | null
  liveUrl: string | null
  githubUrl: string | null
  order: number
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface SiteConfig {
  nameRu: string
  nameEn: string
  roleRu: string
  roleEn: string
  bioRu: string
  bioEn: string
  skills: string // JSON string → string[]
  telegramUrl: string
  email: string
  githubUrl: string
}

export type Lang = 'ru' | 'en'
