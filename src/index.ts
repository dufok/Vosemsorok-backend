// Fix BigInt JSON serialization (folder_mtime field is BigInt in Prisma)
(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

import app from './app'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
