const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const IMGS_DIR = path.join(__dirname, '..', 'public', 'imgs')
const RAW_DIR = path.join(IMGS_DIR, 'raw')

if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true })

const files = fs.readdirSync(IMGS_DIR).filter(f => /\.png$/i.test(f))

if (!files.length) {
  console.log('No PNG files found in', IMGS_DIR)
  process.exit(0)
}

console.log(`Converting ${files.length} PNG(s)...\n`)

;(async () => {
  let totalBefore = 0
  let totalAfter = 0

  for (const file of files) {
    const src = path.join(IMGS_DIR, file)
    const base = file.replace(/\.png$/i, '')
    const dst = path.join(IMGS_DIR, `${base}.webp`)
    const archive = path.join(RAW_DIR, file)

    const before = fs.statSync(src).size
    totalBefore += before

    await sharp(src)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(dst)

    const after = fs.statSync(dst).size
    totalAfter += after

    fs.renameSync(src, archive)

    const pct = ((1 - after / before) * 100).toFixed(1)
    console.log(`  ${file.padEnd(20)} ${(before / 1024).toFixed(0).padStart(6)} KB  →  ${(after / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)`)
  }

  const savedPct = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
  console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB  (-${savedPct}%)`)
  console.log(`Originals moved to: ${path.relative(process.cwd(), RAW_DIR)}`)
})().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
