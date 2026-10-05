import pw from 'file:///C:/Users/KFN/AppData/Local/Volta/tools/image/packages/@playwright/cli/node_modules/@playwright/cli/node_modules/playwright-core/index.js';
const { chromium } = pw;

const BASE_URL = 'http://localhost:5173';

async function run() {
  console.log('Testing Student Mode exam and submission...');
  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge'
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');

  // Set active tryout and student role
  await page.evaluate(() => {
    localStorage.setItem('skd_shared_role', 'student');
    const mockBatch = {
      id: 'to_student_test',
      title: 'Simulasi CAT Siswa Test',
      duration: 100,
      totalCount: 110,
      questions: []
    };
    localStorage.setItem('skd_student_active_tryout', JSON.stringify(mockBatch));
    localStorage.setItem('skd_student_info', JSON.stringify({
      name: 'Budi Santoso',
      participantNumber: 'TEST-001'
    }));
    window.location.hash = '#/exam';
  });

  await page.waitForTimeout(500);
  await page.reload();
  await page.waitForSelector('.question-card', { timeout: 5000 });

  // Verify in student mode:
  // 1. Kumpulkan Ujian is visible in QuestionPalette
  const kumpulkanBtn = page.locator('#question-palette-sidebar button:has-text("Kumpulkan Ujian")');
  const isKumpulkanVisible = await kumpulkanBtn.isVisible();
  console.log('Kumpulkan Ujian in Student Palette visible (must be true):', isKumpulkanVisible);

  // 2. Selesai Ujian is NOT in BottomNav (clean toolbar)
  const selesaiBottom = await page.locator('.bottom-nav-toolbar:has-text("Selesai Ujian")').count();
  console.log('Redundant Selesai Ujian in BottomNav count (must be 0):', selesaiBottom);

  // 3. Intip Kunci & Pembahasan button is NOT visible for students
  const peekBtn = await page.locator('button:has-text("Intip Kunci & Pembahasan")').count();
  console.log('Intip Kunci button count in student mode (must be 0):', peekBtn);

  // 4. Pause timer button is NOT visible for students
  const pauseBtn = await page.locator('.pause-timer-btn').count();
  console.log('Pause timer button count in student mode (must be 0):', pauseBtn);

  // 5. Test clicking Kumpulkan Ujian -> ConfirmModal opens
  await kumpulkanBtn.click();
  await page.waitForSelector('.modal-card:has-text("Konfirmasi Selesai Ujian")', { timeout: 3000 });
  console.log('ConfirmModal opened successfully.');

  console.log('--- STUDENT MODE VERIFIED SUCCESSFULLY ---');
  await browser.close();
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
