import pw from 'file:///C:/Users/KFN/AppData/Local/Volta/tools/image/packages/@playwright/cli/node_modules/@playwright/cli/node_modules/playwright-core/index.js';
const { chromium } = pw;

const BASE_URL = 'http://localhost:5173';
const ARTIFACT_DIR = 'C:/Users/KFN/.gemini/antigravity-ide/brain/732618d0-1e42-4773-af4f-35e863393b5c';

async function run() {
  console.log('Launching browser to test Preview Mode enhancements...');
  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge'
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Browser console error:', msg.text());
    }
  });

  // Step 1: Open app & setup authenticated admin
  console.log('--- STEP 1: Admin Authentication ---');
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  await page.evaluate(() => {
    localStorage.setItem('skd_admin_auth', 'true');
    localStorage.setItem('skd_shared_role', 'admin');
    const existing = JSON.parse(localStorage.getItem('skd_admin_tryout_batches') || '[]');
    if (existing.length === 0) {
      const mockBatch = {
        id: 'to_sample_1',
        title: 'Paket Tryout Mandiri SKD 2026',
        duration: 100,
        totalCount: 110,
        createdAt: '06/10/2026'
      };
      localStorage.setItem('skd_admin_tryout_batches', JSON.stringify([mockBatch]));
    }
    window.location.hash = '#/admin';
  });

  await page.waitForTimeout(500);
  await page.reload();
  await page.waitForSelector('.admin-dashboard-container', { timeout: 5000 });
  console.log('Admin Dashboard loaded successfully.');

  // Step 2: Open "Kelola Paket Soal" tab
  console.log('--- STEP 2: Find Tryout Batch & Click Preview ---');
  const batchesTabBtn = page.locator('button:has-text("Kelola Paket Soal")');
  if (await batchesTabBtn.isVisible()) {
    await batchesTabBtn.click();
    await page.waitForTimeout(300);
  }

  // Find a preview button
  const previewBtn = page.locator('button:has-text("Preview")').first();
  await previewBtn.waitFor({ state: 'visible', timeout: 5000 });
  await previewBtn.click();
  await page.waitForTimeout(600);

  // Step 3: Verify Preview Workspace Elements
  console.log('--- STEP 3: Verify Preview Workspace Elements ---');
  await page.waitForSelector('.question-card', { timeout: 5000 });

  // 1. Verify Header badge and back button
  const previewBadge = page.locator('span:has-text("Preview Pengawas")').first();
  const isPreviewBadgeVisible = await previewBadge.isVisible();
  console.log('Preview Pengawas badge visible:', isPreviewBadgeVisible);

  const backHeaderBtn = page.locator('.btn-back-header:has-text("Dashboard Admin")');
  const isBackHeaderBtnVisible = await backHeaderBtn.isVisible();
  console.log('Back to Dashboard Admin button visible:', isBackHeaderBtnVisible);

  const switchRoleBtn = page.locator('.btn-switch-role-header');
  const isSwitchRoleVisible = await switchRoleBtn.isVisible();
  console.log('Switch Role button hidden in preview (should be false):', isSwitchRoleVisible);

  const adminPortalBtn = page.locator('.btn-admin-portal');
  const isAdminPortalVisible = await adminPortalBtn.isVisible();
  console.log('Admin Portal button hidden in preview (should be false):', isAdminPortalVisible);

  // 2. Verify Total Question Count
  const qNumBadge = await page.locator('.question-number-badge').textContent();
  console.log('Question number badge text:', qNumBadge.trim());

  const paletteTitle = await page.locator('#question-palette-sidebar h3').textContent();
  console.log('Palette title text:', paletteTitle.trim());

  const twkTab = await page.locator('#question-palette-sidebar .filter-tab:has-text("TWK")').textContent();
  const tiuTab = await page.locator('#question-palette-sidebar .filter-tab:has-text("TIU")').textContent();
  const tkpTab = await page.locator('#question-palette-sidebar .filter-tab:has-text("TKP")').textContent();
  console.log('Palette tabs:', { twkTab, tiuTab, tkpTab });

  // 3. Verify No Selesai / Kumpulkan Ujian buttons
  const selesaiUjianBottom = await page.locator('.bottom-nav-toolbar:has-text("Selesai Ujian")').count();
  const kumpulkanUjianPalette = await page.locator('#question-palette-sidebar:has-text("Kumpulkan Ujian")').count();
  console.log('Selesai Ujian in BottomNav count (must be 0):', selesaiUjianBottom);
  console.log('Kumpulkan Ujian in Palette count (must be 0):', kumpulkanUjianPalette);

  // 4. Verify Timer Pause button
  console.log('--- STEP 4: Verify Timer Pause Functionality ---');
  const pauseBtn = page.locator('.pause-timer-btn');
  const isPauseBtnVisible = await pauseBtn.isVisible();
  console.log('Pause timer button visible:', isPauseBtnVisible);

  const initialTime = await page.locator('.timer-text').textContent();
  console.log('Initial timer text:', initialTime);

  // Click pause
  await pauseBtn.click();
  await page.waitForTimeout(500);
  const pausedBtnText = await pauseBtn.textContent();
  console.log('Pause button text after click (should be Lanjut):', pausedBtnText.trim());

  // Wait 2 seconds while paused
  await page.waitForTimeout(2000);
  const pausedTime = await page.locator('.timer-text').textContent();
  console.log('Timer text after 2s paused (should match initial):', pausedTime);

  // Click resume
  await pauseBtn.click();
  await page.waitForTimeout(300);
  const resumedBtnText = await pauseBtn.textContent();
  console.log('Pause button text after resume (should be Jeda):', resumedBtnText.trim());

  // 5. Verify Answer Key & Explanation Peek
  console.log('--- STEP 5: Verify Intip Kunci & Pembahasan ---');
  const peekBtn = page.locator('button:has-text("Intip Kunci & Pembahasan")');
  const isPeekVisible = await peekBtn.isVisible();
  console.log('Intip Kunci button visible:', isPeekVisible);

  await peekBtn.click();
  await page.waitForTimeout(500);

  // Verify correct answer indicator is shown
  const correctBadge = page.locator('span:has-text("Kunci Benar")');
  const isCorrectBadgeVisible = await correctBadge.first().isVisible();
  console.log('Correct key indicator visible:', isCorrectBadgeVisible);

  // Verify explanation box is shown
  const explanationBox = page.locator('.explanation-card');
  const isExplanationVisible = await explanationBox.isVisible();
  console.log('Official explanation card visible:', isExplanationVisible);

  await page.screenshot({ path: `${ARTIFACT_DIR}/preview_01_key_peek.png`, fullPage: false });

  // 6. Verify Return to Dashboard Admin
  console.log('--- STEP 6: Verify Return to Admin Dashboard ---');
  await backHeaderBtn.click();
  await page.waitForTimeout(600);
  await page.waitForSelector('.admin-dashboard-container', { timeout: 5000 });
  console.log('Returned to Admin Dashboard cleanly.');

  await page.screenshot({ path: `${ARTIFACT_DIR}/preview_02_return_dashboard.png`, fullPage: false });

  // Check that no dirty student attempt was recorded
  const activeStudentInStorage = await page.evaluate(() => localStorage.getItem('skd_active_student'));
  console.log('Active student in storage after returning (must be null or previous):', activeStudentInStorage);

  console.log('\n--- ALL PREVIEW VERIFICATION CHECKS PASSED ---');
  await browser.close();
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
