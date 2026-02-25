import { Router, Request, Response } from "express"
import path from "path"
import fs from "fs"

const router = Router()
const PORTFOLIO_DIR = process.env.PORTFOLIO_DIR || "/srv/data/portfolio"

// GET /images/10-2025-JUNION/photo_01.png
router.get("/:slug/:filename", (req: Request, res: Response) => {
  const slug = String(req.params.slug)
  const filename = String(req.params.filename)

  if (slug.includes("..") || filename.includes("..")) {
    res.status(400).json({ error: "Invalid path" })
    return
  }

  const filePath = path.join(PORTFOLIO_DIR, slug, filename)

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Image not found" })
    return
  }

  res.sendFile(filePath)
})

export default router

