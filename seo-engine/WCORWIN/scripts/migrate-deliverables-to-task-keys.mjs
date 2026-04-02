/**
 * migrate-deliverables-to-task-keys.mjs
 *
 * Migrates existing phase-level deliverable chips to per-task keys.
 * Run AFTER Lobe deploys the per-task UI.
 *
 * Usage: node scripts/migrate-deliverables-to-task-keys.mjs
 *
 * Mapping (phase-level → task-level):
 *   kickoff | GBP Access — Verification Report  → kickoff:1  (GBP Profile Optimization task)
 *   month1  | XML Sitemap — GSC Verification    → month1:3
 *   month1  | GSC Baseline — March 2026         → month1:1   (meta descriptions baseline / GSC)
 *   month1  | Title Tags + Meta Descriptions    → month1:0
 *   month1  | LocalBusiness Schema              → month1:2
 *   month1  | Top 20 Target Keywords            → month1:5
 *   month1  | GBP Profile Audit                 → month1:4
 */

const CONVEX_URL = 'https://kindred-scorpion-550.convex.cloud';
const PROJECT_ID = 'wcorwin';

const LABEL_TO_TASK_KEY = {
  'GBP Access — Verification Report': 'kickoff:1',
  'XML Sitemap — GSC Verification': 'month1:3',
  'GSC Baseline — March 2026': 'month1:1',
  'Title Tags + Meta Descriptions — All Key Pages': 'month1:0',
  'LocalBusiness Schema — JSON-LD Validation': 'month1:2',
  'Top 20 Target Keywords — Baseline': 'month1:5',
  'GBP Profile Audit': 'month1:4',
};

async function query(path, args) {
  const r = await fetch(`${CONVEX_URL}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  });
  return r.json();
}

async function mutation(path, args) {
  const r = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  });
  return r.json();
}

async function run() {
  console.log('Fetching existing deliverables...');
  const result = await query('wcorwinTasks:getDeliverables', { projectId: PROJECT_ID });
  const items = result.value || [];
  console.log(`Found ${items.length} deliverables`);

  for (const item of items) {
    const newKey = LABEL_TO_TASK_KEY[item.label];
    if (!newKey) {
      console.log(`  SKIP (no mapping): ${item.label}`);
      continue;
    }
    if (item.milestoneKey === newKey) {
      console.log(`  SKIP (already migrated): ${item.label} → ${newKey}`);
      continue;
    }

    console.log(`  MIGRATE: "${item.label}"  ${item.milestoneKey} → ${newKey}`);

    // Add new entry with task key
    const addResult = await mutation('wcorwinTasks:addDeliverable', {
      projectId: PROJECT_ID,
      milestoneKey: newKey,
      label: item.label,
      ...(item.url ? { url: item.url } : {}),
      type: item.type,
      addedAt: item.addedAt,
      ...(item.markdownContent ? { markdownContent: item.markdownContent } : {}),
    });

    if (addResult.status !== 'success') {
      console.error(`  ERROR adding ${item.label}:`, addResult);
      continue;
    }

    // Remove old entry
    const removeResult = await mutation('wcorwinTasks:removeDeliverable', { id: item._id });
    if (removeResult.status !== 'success') {
      console.error(`  ERROR removing old ${item.label}:`, removeResult);
    } else {
      console.log(`  DONE: ${item.label}`);
    }
  }

  console.log('\nMigration complete. Verify at https://wcorwin.anthonytatis.com');
}

run().catch(console.error);
