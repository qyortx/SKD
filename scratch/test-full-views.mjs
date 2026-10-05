import pw from 'file:///C:/Users/KFN/AppData/Local/Volta/tools/image/packages/@playwright/cli/node_modules/@playwright/cli/node_modules/playwright-core/index.js';
const { chromium } = pw;

const BASE_URL = 'http://localhost:5173';
const ARTIFACT_DIR = 'C:/Users/KFN/.gemini/antigravity-ide/brain/732618d0-1e42-4773-af4f-35e863393b5c';

async function testFull() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to portal...');
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  // Go to Admin -> Preview Tryout to enter exam mode
  await page.click('.btn-role-admin');
  await page.waitForSelector('.modal-pin-dialog');
  await page.fill('.pin-input', 'admin123');
  await page.click('.modal-pin-dialog .btn-confirm');
  await page.waitForSelector('.admin-dashboard-container');

  // Ensure a batch exists
  const hasBatches = await page.locator('.btn-manage-q-badge').count();
  if (hasBatches === 0) {
    console.log('Generating test batch...');
    await page.fill('.batch-form-grid input[type="text"]', 'Paket Simulasi CPNS 2026');
    await page.click('.batch-submit-row button');
    await page.waitForSelector('.btn-manage-q-badge');
  }

  // Preview batch
  await page.locator('button.btn-table-action', { hasText: 'Preview' }).first().click();
  await page.waitForSelector('.main-workspace');

  console.log('Capturing Exam Workspace in Light Mode...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/07_student_exam_workspace_tailwind.png` });

  // Answer question A
  await page.keyboard.press('a');
  await page.waitForTimeout(200);

  // Toggle Dark Mode
  const themeToggle = page.locator('.main-header button[title*="Tema"]');
  await themeToggle.click();
  await page.waitForTimeout(300);

  console.log('Capturing Exam Workspace in Dark Mode...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/08_student_exam_dark_mode_tailwind.png` });

  // Switch back to light mode
  await themeToggle.click();
  await page.waitForTimeout(200);

  // Click Finish Exam (using .btn-finish from BottomNav)
  await page.click('.btn-finish');
  await page.waitForSelector('.summary-stats-grid');
  console.log('Capturing Confirm Modal...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/09_confirm_modal_tailwind.png` });

  // Confirm finish in ConfirmModal
  await page.click('.btn-confirm', { hasText: 'Ya, Selesaikan Ujian' });
  await page.waitForSelector('.result-modal-card');
  console.log('Capturing Result Modal...');
  await page.screenshot({ path: `${ARTIFACT_DIR}/10_result_modal_tailwind.png` });

  console.log('All full view screenshots captured successfully.');
  await browser.close();
}

testFull().catch(err => {
  console.error(err);
  process.exit(1);
});
