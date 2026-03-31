#!/usr/bin/env node
/**
 * sync-content.mjs
 * Pushes content/*.md files into Convex sydneyDeliverables table.
 * Run from sydneyspillman/ root: node scripts/sync-content.mjs
 * Skips entries that already exist (matched by milestoneKey + label).
 */
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')

// Use prod Convex deployment URL
const convexUrl = 'https://unique-crab-445.convex.cloud'

const PROJECT_ID = 'sydney-spillman'

// Mapping: content file → milestone key + label
const CONTENT_MAP = [
  { file: '01-client-intake.md',       milestoneKey: '1-DISCOVERY SESSION', label: 'Client Intake' },
  { file: '01-brand-positioning.md',   milestoneKey: '1-DISCOVERY SESSION', label: 'Brand Positioning' },
  { file: '01-competitor-audit.md',    milestoneKey: '1-DISCOVERY SESSION', label: 'Competitor Audit' },
  { file: '02-direction-options.md',   milestoneKey: '1-MOOD + DIRECTION',  label: 'Direction Options' },
  { file: '02-mood-board.md',          milestoneKey: '1-MOOD + DIRECTION',  label: 'Mood Board' },
]

async function convexQuery(path, args) {
  const res = await fetch(`${convexUrl}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  })
  const data = await res.json()
  if (data.status === 'error') throw new Error(`Query failed: ${data.errorMessage}`)
  return data.value
}

async function convexMutation(path, args) {
  const res = await fetch(`${convexUrl}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  })
  const data = await res.json()
  if (data.status === 'error') throw new Error(`Mutation failed: ${data.errorMessage}`)
  return data.value
}

// Fetch existing deliverables to avoid duplicates
const existing = await convexQuery('sydneyTasks:getDeliverables', { projectId: PROJECT_ID })
const existingKeys = new Set(existing.map(d => `${d.milestoneKey}|${d.label}`))

console.log(`Found ${existing.length} existing deliverables in Convex.\n`)

let added = 0
let skipped = 0

for (const { file, milestoneKey, label } of CONTENT_MAP) {
  const key = `${milestoneKey}|${label}`
  if (existingKeys.has(key)) {
    console.log(`  skip  ${label} (already in Convex)`)
    skipped++
    continue
  }

  const filePath = join(root, 'content', file)
  const markdownContent = await readFile(filePath, 'utf-8').catch(() => null)
  if (!markdownContent) {
    console.log(`  miss  ${label} (file not found: ${file})`)
    continue
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

  console.log(`  added ${label} → ${milestoneKey}`)
  added++
}

console.log(`\nDone: ${added} added, ${skipped} skipped.`)
