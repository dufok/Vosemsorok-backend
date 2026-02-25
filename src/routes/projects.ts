import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/projects?category=commercial
router.get('/', async (req: Request, res: Response) => {
  const { category } = req.query

  const projects = await prisma.projects.findMany({
    where: category ? { category: String(category) } : undefined,
    orderBy: { project_date: 'desc' },
    include: {
      project_images: {
        orderBy: { display_order: 'asc' },
      },
    },
  })
  res.json(projects)
})

// GET /api/projects/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  const slug = String(req.params.slug)

  const project = await prisma.projects.findUnique({
    where: { slug },
    include: {
      project_images: {
        orderBy: { display_order: 'asc' },
      },
    },
  })

  if (!project) {
    res.status(404).json({ error: 'Project not found' })
    return
  }
  res.json(project)
})

export default router
