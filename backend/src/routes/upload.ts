import { Router, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    if (ext && mime) cb(null, true)
    else cb(new Error('Only images are allowed'))
  },
})

router.post(
  '/',
  authMiddleware,
  upload.array('screenshots', 5),
  (req: AuthRequest, res: Response) => {
    const files = req.files as Express.Multer.File[]
    const urls = files.map((f) => `/uploads/${f.filename}`)
    res.json({ urls })
  }
)

router.delete('/:filename', authMiddleware, (req: AuthRequest, res: Response) => {
  const filename = path.basename(req.params.filename)
  const filepath = path.join(uploadsDir, filename)
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
  res.json({ ok: true })
})

export default router
