import pw from 'file:///C:/Users/KFN/AppData/Local/Volta/tools/image/packages/@playwright/cli/node_modules/@playwright/cli/node_modules/playwright-core/index.js';
const { chromium } = pw;

const BASE_URL = 'http://localhost:5173';
const ARTIFACT_DIR = 'C:/Users/KFN/.gemini/antigravity-ide/brain/732618d0-1e42-4773-af4f-35e863393b5c';

async function run() {
  console.log('Launching browser to test UI & Features...');
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

  // TEST 1: Role Selection & PIN Modal Layout
  console.log('--- TEST 1: Role Selection & PIN Modal Layout ---');
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  // Click "Masuk Sebagai Admin" to open PIN modal
  const adminBtn = page.locator('.btn-role-admin');
  await adminBtn.click();
  await page.waitForSelector('.modal-pin-dialog');

  // Verify PIN modal layout & buttons
  const cancelBtn = page.locator('.modal-pin-dialog .btn-cancel');
  const confirmBtn = page.locator('.modal-pin-dialog .btn-confirm');
  
  const cancelBox = await cancelBtn.boundingBox();
  const confirmBox = await confirmBtn.boundingBox();
  console.log('Cancel Button Box:', cancelBox);
  console.log('Confirm Button Box:', confirmBox);

  // Ensure they are not overlapping and have proper separation
  if (confirmBox.x <= cancelBox.x + cancelBox.width - 2) {
    throw new Error('Buttons are overlapping or touching without gap!');
  }
  console.log('PASS: Modal buttons have proper spacing and distinct bounding boxes.');

  // Screenshot PIN modal for visual proof
  await page.screenshot({ path: `${ARTIFACT_DIR}/01_fixed_pin_modal.png` });

  // TEST 2: Admin Login & Batch Question Manager
  console.log('--- TEST 2: Admin Login & Batch Question Manager ---');
  await page.fill('.pin-input', 'admin123');
  await confirmBtn.click();

  // Wait for Admin Dashboard to appear
  await page.waitForSelector('.admin-dashboard-container');
  console.log('PASS: Logged into Admin Dashboard.');

  // Check URL hash is #/admin
  console.log('Current URL:', page.url());

  // Create a batch first if none exists
  const hasBatches = await page.locator('.btn-manage-q-badge').count();
  if (hasBatches === 0) {
    console.log('Generating test batch...');
    await page.fill('.batch-form-grid input[type="text"]', 'Paket Simulasi Utama CPNS 2026');
    await page.click('.batch-submit-row button');
    await page.waitForSelector('.btn-manage-q-badge');
    console.log('PASS: Test batch generated.');
  }

  // Click "Kelola Soal" on first batch row
  const kelolaBtn = page.locator('.btn-manage-q-badge').first();
  await kelolaBtn.click();

  // Wait for BatchQuestionManager
  await page.waitForSelector('.batch-q-manager-wrapper');
  console.log('PASS: BatchQuestionManager opened.');
  await page.screenshot({ path: `${ARTIFACT_DIR}/02_batch_question_manager.png` });

  // Click "+ Tambah Soal dari Bank"
  const addFromBankBtn = page.locator('.batch-header-actions .btn-confirm');
  await addFromBankBtn.click();
  await page.waitForSelector('.modal-add-from-bank');
  console.log('PASS: Add from Bank modal opened.');
  await page.screenshot({ path: `${ARTIFACT_DIR}/03_add_from_bank_modal.png` });

  // Close modal
  await page.click('.modal-add-from-bank .btn-cancel');

  // Click "← Kembali ke Paket Tryout"
  await page.click('.btn-back-nav');
  await page.waitForSelector('.admin-tabs-bar');
  console.log('PASS: Back button returned to Admin Batches table.');

  // TEST 3: Admin Synchronization Tab
  console.log('--- TEST 3: Admin Sync Tab ---');
  // Click on "Sinkronisasi Data" tab
  const syncTabBtn = page.locator('.admin-tab-btn', { hasText: 'Sinkronisasi Data' });
  await syncTabBtn.click();
  await page.waitForSelector('.sync-panels-grid');
  console.log('PASS: Sync Tab rendered.');
  await page.screenshot({ path: `${ARTIFACT_DIR}/04_admin_sync_tab.png` });

  // Test Export Sync Code
  await page.click('button:has-text("Salin Kode Sync")');
  console.log('PASS: Copy sync code clicked.');

  // TEST 4: Browser Back & UI Navigation
  console.log('--- TEST 4: Browser Back & UI Navigation ---');
  // Click "← Portal Peran" button in Admin top bar
  const backToPortalBtn = page.locator('.btn-back-header', { hasText: 'Portal Peran' });
  await backToPortalBtn.click();
  await page.waitForSelector('.role-portal-container');
  console.log('PASS: Returned to Role Portal via UI button. URL:', page.url());

  // Navigate to student gatekeeper
  await page.click('.btn-role-student');
  await page.waitForSelector('.student-gatekeeper-container');
  console.log('PASS: Student Gatekeeper opened. URL:', page.url());
  await page.screenshot({ path: `${ARTIFACT_DIR}/05_student_gatekeeper.png` });

  // Click browser Back button
  await page.goBack();
  await page.waitForSelector('.role-portal-container');
  console.log('PASS: Browser Back button navigated to Role Portal. URL:', page.url());

  // Click browser Forward button
  await page.goForward();
  await page.waitForSelector('.student-gatekeeper-container');
  console.log('PASS: Browser Forward button navigated back to Student Gatekeeper. URL:', page.url());

  // Test Student Back to Portal button
  await page.click('.btn-text-secondary', { hasText: 'Kembali ke Pemilihan Peran' });
  await page.waitForSelector('.role-portal-container');
  // TEST 5: Student Exam Workspace Back Button
  console.log('--- TEST 5: Student Exam Workspace Back Button ---');
  // Re-enter Admin
  await page.locator('.btn-role-admin').click();
  await page.waitForSelector('.modal-pin-dialog');
  await page.fill('.pin-input', 'admin123');
  await page.click('.modal-pin-dialog .btn-confirm');
  await page.waitForSelector('.admin-dashboard-container');

  // Click Preview on the batch
  await page.locator('button.btn-table-action', { hasText: 'Preview' }).first().click();
  await page.waitForSelector('.main-workspace');
  console.log('PASS: Exam workspace loaded. URL:', page.url());
  await page.screenshot({ path: `${ARTIFACT_DIR}/06_student_exam_header.png` });

  // Verify "Keluar" button in Header
  const headerBackBtn = page.locator('.main-header .btn-back-header');
  console.log('Header back button text:', await headerBackBtn.innerText());

  // Click "Keluar" and accept dialog
  page.once('dialog', async dialog => {
    console.log('Dialog message:', dialog.message());
    await dialog.accept();
  });
  await headerBackBtn.click();
  await page.waitForSelector('.role-portal-container');
  console.log('PASS: Student back button returned safely to Role Portal. URL:', page.url());

  console.log('ALL TESTS PASSED SUCCESSFULLY!');
  await browser.close();
}

run().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
