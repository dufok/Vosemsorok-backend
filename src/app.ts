import express from 'express'
import cors from 'cors'
import projectsRouter from './routes/projects'
import imagesRouter from './routes/images'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://vosemsorok.com',
  'https://www.vosemsorok.com',
  'https://badpromt.xyz',
  'https://www.badpromt.xyz',
]

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    try {
      const ok = allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(new URL(origin).hostname)
      cb(null, ok)
    } catch {
      cb(null, false)
    }
  },
}));

app.use(express.json())
app.use('/api/projects', projectsRouter)
app.use('/images', imagesRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

export default app
