import express from 'express'
import cors from 'cors'
import projectsRouter from './routes/projects'
import imagesRouter from './routes/images'

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://vosemsorok.com',
    'https://www.vosemsorok.com',
  ]
}));

app.use(express.json())
app.use('/api/projects', projectsRouter)
app.use('/images', imagesRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

export default app
