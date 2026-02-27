import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = Router();

const PORTFOLIO_DIR = process.env.PORTFOLIO_DIR || "/var/lib/pgsql/portfolio";

// GET /images/:slug/web/:filename
router.get("/:slug/web/:filename", (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const filename = req.params.filename as string; // e.g. "1.jpg"

  if (!filename) {
    return res.status(400).json({ error: "Missing filename" });
  }

  // Basic safety: no directory traversal
  if (slug.includes("..") || filename.includes("..")) {
    return res.status(400).json({ error: "Invalid path" });
  }

  // We know all optimized images live under web/
  const filePath = path.join(PORTFOLIO_DIR, slug, "web", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Image not found" });
  }

  return res.sendFile(filePath);
});

export default router;
