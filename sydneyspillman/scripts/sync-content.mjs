#!/usr/bin/env node
/**
 * sync-content.mjs
 * Pushes content/*.md files into Convex sydneyDeliverables table.
 * Images referenced as ./images/filename.ext are embedded as base64 data URIs.
 *
 * Usage:
 *   node scripts/sync-content.mjs                             # skip existing, add new
 *   node scripts/sync-content.mjs --update                    # re-push all (delete + re-add)
 *   node scripts/sync-content.mjs --update --file=01-brand-positioning.md  # single file
 *
 * Run from sydneyspillman/ root.
 */
import { readFile, readdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')

const CONVEX_URL = 'https://unique-crab-445.convex.cloud'
const PROJECT_ID = 'sydney-spillman'
const SITE_URL = 'https://sydneyspillman.anthonytatis.com'

const args = process.argv.slice(2)
const UPDATE_MODE = args.includes('--update')
const SINGLE_FILE = args.find(a => a.startsWith('--file='))?.split('=')[1]

// ── Markdown doc → Convex deliverable mapping ──────────────────────────────
const CONTENT_MAP = [
  { file: '01-client-intake.md',       milestoneKey: '1-DISCOVERY SESSION', label: 'Client Intake' },
  { file: '01-brand-positioning.md',   milestoneKey: '1-DISCOVERY SESSION', label: 'Brand Positioning' },
  { file: '01-competitor-audit.md',    milestoneKey: '1-DISCOVERY SESSION', label: 'Competitor Audit' },
  { file: '02-direction-options.md',   milestoneKey: '1-MOOD + DIRECTION',  label: 'Direction Options' },
  { file: '02-mood-board.md',          milestoneKey: '1-MOOD + DIRECTION',  label: 'Mood Board' },
]

// ── Image mime types ────────────────────────────────────────────────────────
const MIME = {
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
}

// ── Rewrite ./images/filename.ext → hosted Vercel URL ──────────────────────
async function rewriteImageUrls(markdown) {
  // Replace ./images/filename.ext with ${SITE_URL}/images/filename.ext
  return markdown.replace(
    /!\[([^\]]*)\]\(\.\/(images\/[^)]+)\)/g,
    (_, alt, relPath) => `![${alt}](${SITE_URL}/${relPath})`
  )
}

// ── Convex helpers ──────────────────────────────────────────────────────────
async function convexQuery(path, args) {
  const res = await fetch(`${CONVEX_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  })
  const data = await res.json()
  if (data.status === 'error') throw new Error(`Query failed: ${data.errorMessage}`)
  return data.value
}

async function convexMutation(path, args) {
  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  })
  const data = await res.json()
  if (data.status === 'error') throw new Error(`Mutation failed: ${data.errorMessage}`)
  return data.value
}

// ── Main ────────────────────────────────────────────────────────────────────
console.log(`\n🔄  Sydney Deliverables Sync`)
console.log(`    Mode: ${UPDATE_MODE ? 'UPDATE (delete + re-add)' : 'ADD (skip existing)'}`)
if (SINGLE_FILE) console.log(`    File: ${SINGLE_FILE}`)
console.log()

const existing = await convexQuery('sydneyTasks:getDeliverables', { projectId: PROJECT_ID })
const existingByKey = new Map(existing.map(d => [`${d.milestoneKey}|${d.label}`, d]))

console.log(`Found ${existing.length} existing deliverables in Convex.\n`)

let added = 0
let updated = 0
let skipped = 0

const toProcess = SINGLE_FILE
  ? CONTENT_MAP.filter(e => e.file === SINGLE_FILE)
  : CONTENT_MAP

for (const { file, milestoneKey, label } of toProcess) {
  const key = `${milestoneKey}|${label}`
  const existingEntry = existingByKey.get(key)

  const filePath = join(root, 'content', file)
  if (!existsSync(filePath)) {
    console.log(`  miss  ${label} (file not found: ${file})`)
    continue
  }

  const rawMarkdown = await readFile(filePath, 'utf-8')
  const markdownContent = await rewriteImageUrls(rawMarkdown)

  const imagesReferenced = (markdownContent.match(/sydneyspillman\.anthonytatis\.com\/images\//g) || []).length
  if (imagesReferenced > 0) {
    console.log(`    imgs  ${imagesReferenced} image URL(s) rewritten for ${label}`)
  }

  if (existingEntry && !UPDATE_MODE) {
    console.log(`  skip  ${label} (already in Convex — run with --update to refresh)`)
    skipped++
    continue
  }

  if (existingEntry && UPDATE_MODE) {
    await convexMutation('sydneyTasks:removeDeliverable', { id: existingEntry._id })
  }

  await convexMutation('sydneyTasks:addDeliverable', {
    projectId: PROJECT_ID,
    milestoneKey,
    label,
    url: '',
    type: 'md',
    addedAt: Date.now(),
    markdownContent,
  })

  if (existingEntry) {
    console.log(`  ✓ upd  ${label} → ${milestoneKey}`)
    updated++
  } else {
    console.log(`  ✓ add  ${label} → ${milestoneKey}`)
    added++
  }
}

// ── Standalone image deliverables ───────────────────────────────────────────
// Any image in content/images/ NOT embedded in a doc → standalone deliverable
const imagesDir = join(root, 'content', 'images')
if (existsSync(imagesDir)) {
  const imageFiles = (await readdir(imagesDir)).filter(f => MIME[extname(f).toLowerCase()])

  // Collect filenames already referenced in docs
  const embeddedFilenames = new Set()
  for (const { file } of toProcess) {
    const fp = join(root, 'content', file)
    if (!existsSync(fp)) continue
    const md = await readFile(fp, 'utf-8')
    for (const m of md.matchAll(/!\[[^\]]*\]\(\.\/(images\/([^)]+))\)/g)) {
      embeddedFilenames.add(m[2]) // just the filename part
    }
  }

  const standaloneImages = imageFiles.filter(f => !embeddedFilenames.has(f))

  if (standaloneImages.length > 0) {
    console.log(`\nStandalone images (not embedded in any doc): ${standaloneImages.length}`)

    for (const imgFile of standaloneImages) {
      const imgLabel = basename(imgFile, extname(imgFile))
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())

      const milestoneKey = imgFile.startsWith('02-') ? '1-MOOD + DIRECTION' : '1-DISCOVERY SESSION'
      const imgKey = `${milestoneKey}|${imgLabel}`
      const existingImg = existingByKey.get(imgKey)

      if (existingImg && !UPDATE_MODE) {
        console.log(`  skip  ${imgLabel} (image already in Convex)`)
        continue
      }

      const ext = extname(imgFile).toLowerCase()
      const hostedUrl = `${SITE_URL}/images/${imgFile}`

      if (existingImg && UPDATE_MODE) {
        await convexMutation('sydneyTasks:removeDeliverable', { id: existingImg._id })
      }

      await convexMutation('sydneyTasks:addDeliverable', {
        projectId: PROJECT_ID,
        milestoneKey,
        label: imgLabel,
        url: hostedUrl,
        type: ext.replace('.', ''),
        addedAt: Date.now(),
      })

      console.log(`  ✓ img  ${imgLabel} → ${milestoneKey}`)
      added++
    }
  }
}

console.log(`\n✅  Done: ${added} added, ${updated} updated, ${skipped} skipped.\n`)
