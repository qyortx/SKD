import pw from 'file:///C:/Users/KFN/AppData/Local/Volta/tools/image/packages/@playwright/cli/node_modules/@playwright/cli/node_modules/playwright-core/index.js';
const { chromium } = pw;

const BASE_URL = 'http://localhost:5173';
const ARTIFACT_DIR = 'C:/Users/KFN/.gemini/antigravity-ide/brain/732618d0-1e42-4773-af4f-35e863393b5c';

async function testAll() {
  console.log('Starting Storage, Auth & Preview Verification Tests...');
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
      console.error('Console error:', msg.text());
    }
  });

  // ==========================================
  // SCENARIO 1: Distinct Storage Keys & Route Protection
  // ==========================================
  console.log('\n--- SCENARIO 1: Route Protection for Unauthorized /admin ---');
  await page.goto(`${BASE_URL}/#/admin`);
  await page.waitForTimeout(500);

  // Since not authenticated, app must redirect back to #/
  const currentUrl = page.url();
  console.log('Attempted /admin, redirected to:', currentUrl);
  if (currentUrl.includes('/admin')) {
    throw new Error('FAIL: Unauthorized user was NOT redirected away from /admin!');
  }
  console.log('PASS: Unauthorized user successfully bounced away from /admin.');

  // ==========================================
  // SCENARIO 2: Admin Auth Persistence & Logout
  // ==========================================
  console.log('\n--- SCENARIO 2: Admin Auth Persistence & Logout ---');
  await page.goto(`${BASE_URL}/#/`);
  await page.waitForLoadState('networkidle');

  // Verify PIN prompt on first access
  const adminRoleBtn = page.locator('.btn-role-admin');
  await adminRoleBtn.click();
  await page.waitForSelector('.modal-pin-dialog');
  console.log('PASS: PIN prompt appeared for unauthenticated user.');

  // Submit wrong PIN
  await page.fill('.pin-input', 'wrong123');
  await page.click('.modal-pin-dialog .btn-confirm');
  const errorText = await page.locator('.pin-error-text').innerText();
  console.log('PIN Error shown:', errorText);
  if (!errorText.includes('salah')) {
    throw new Error('FAIL: Wrong PIN did not show error message!');
  }

  // Submit correct PIN
  await page.fill('.pin-input', 'admin123');
  await page.click('.modal-pin-dialog .btn-confirm');
  await page.waitForSelector('.admin-dashboard-container');
  console.log('PASS: Logged in as Admin with PIN.');

  // Verify skd_admin_auth is stored in localStorage
  const authStored = await page.evaluate(() => localStorage.getItem('skd_admin_auth'));
  console.log('localStorage skd_admin_auth:', authStored);
  if (authStored !== 'true') {
    throw new Error('FAIL: skd_admin_auth was not saved to localStorage!');
  }

  // Return to Role Selection without logging out
  await page.click('.btn-back-header'); // "← Portal Peran"
  await page.waitForSelector('.role-portal-container');
  console.log('Returned to Role Portal.');

  // Click Admin again - MUST NOT ASK FOR PIN!
  await page.click('.btn-role-admin');
  await page.waitForSelector('.admin-dashboard-container');
  const pinModalVisible = await page.locator('.modal-pin-dialog').count();
  if (pinModalVisible > 0) {
    throw new Error('FAIL: PIN modal was shown even though admin was authenticated!');
  }
  console.log('PASS: Admin entered directly without re-prompting PIN (Auth status persisted).');

  // Now perform LOGOUT
  console.log('Clicking Logout (Keluar)...');
  await page.click('.btn-logout-admin');
  await page.waitForSelector('.role-portal-container');

  // Verify skd_admin_auth is cleared
  const authAfterLogout = await page.evaluate(() => localStorage.getItem('skd_admin_auth'));
  console.log('localStorage skd_admin_auth after logout:', authAfterLogout);
  if (authAfterLogout !== null) {
    throw new Error('FAIL: skd_admin_auth was not removed on logout!');
  }
  console.log('PASS: Logout removed skd_admin_auth.');

  // Next click on Admin MUST prompt for PIN again
  await page.click('.btn-role-admin');
  await page.waitForSelector('.modal-pin-dialog');
  console.log('PASS: PIN is required again after logout.');
  // Cancel PIN modal
  await page.click('.modal-pin-dialog .btn-cancel');

  // ==========================================
  // SCENARIO 3: Student Features & Access Restriction
  // ==========================================
  console.log('\n--- SCENARIO 3: Student Restrictions (No Admin Features in Student View) ---');
  // Log into admin to ensure a batch exists and get its link
  await page.click('.btn-role-admin');
  await page.fill('.pin-input', 'admin123');
  await page.click('.modal-pin-dialog .btn-confirm');
  await page.waitForSelector('.admin-dashboard-container');

  // Ensure test batch exists
  const batchCount = await page.locator('.btn-manage-q-badge').count();
  if (batchCount === 0) {
    await page.fill('#batch-title-input', 'Paket Ujian Dinas 2026');
    await page.click('.batch-submit-row button');
    await page.waitForSelector('.btn-manage-q-badge');
  }

  // Get share URL or token
  const shareInput = page.locator('.link-readonly-input');
  let studentUrl = '';
  if (await shareInput.count() > 0) {
    studentUrl = await shareInput.inputValue();
  }

  // Log out of admin
  await page.click('.btn-logout-admin');
  await page.waitForSelector('.role-portal-container');

  // Now pretend we are a student opening the exam
  if (studentUrl) {
    console.log('Navigating student to share URL:', studentUrl);
    await page.goto(studentUrl);
  } else {
    // Navigate to student
    await page.click('.btn-role-student');
  }
  await page.waitForTimeout(1000);

  // If student registration modal is shown, register student
  const isRegOpen = await page.locator('.modal-registration-dialog').count();
  if (isRegOpen > 0) {
    await page.fill('#student-reg-name', 'Budi Santoso');
    await page.fill('#student-reg-id', 'PESERTA-999');
    await page.click('.modal-registration-dialog .btn-confirm');
    await page.waitForTimeout(500);
  }

  // Verify in Student Exam View:
  // 1. "Panel Admin" button must NOT exist
  const adminPortalBtnCount = await page.locator('.btn-admin-portal').count();
  console.log('Student view .btn-admin-portal count:', adminPortalBtnCount);
  if (adminPortalBtnCount !== 0) {
    throw new Error('FAIL: Student has access to Panel Admin button!');
  }
  console.log('PASS: Panel Admin button is NOT visible for students.');

  // 2. "Ganti Peran" button must NOT exist in student exam header
  const switchRoleBtnCount = await page.locator('.btn-switch-role-header').count();
  console.log('Student view .btn-switch-role-header count:', switchRoleBtnCount);
  if (switchRoleBtnCount !== 0) {
    throw new Error('FAIL: Student has access to Ganti Peran button!');
  }
  console.log('PASS: Ganti Peran button is NOT visible for students.');

  // 3. Check student storage keys
  const studentKeys = await page.evaluate(() => {
    return {
      activeStudent: localStorage.getItem('skd_student_info'),
      answers: localStorage.getItem('skd_student_answers'),
      flags: localStorage.getItem('skd_student_flags')
    };
  });
  console.log('Student storage populated:', studentKeys.activeStudent ? 'Yes' : 'No');

  // Answer question 1 as student
  const optionA = page.locator('.option-card').first();
  await optionA.click();
  await page.waitForTimeout(300);

  const studentAnswers = await page.evaluate(() => localStorage.getItem('skd_student_answers'));
  console.log('Student answers stored in skd_student_answers:', studentAnswers);
  if (!studentAnswers || studentAnswers === '{}') {
    throw new Error('FAIL: Student answers not stored in skd_student_answers!');
  }

  // ==========================================
  // SCENARIO 4: Preview Tryout Feature (Zero Bugs, Zero Pollution)
  // ==========================================
  console.log('\n--- SCENARIO 4: Preview Feature Isolation & Bug-Free Return ---');
  // Student clicks "Keluar" to return to role select
  page.once('dialog', async dialog => {
    await dialog.accept();
  });
  await page.click('.btn-back-header');
  await page.waitForTimeout(500);

  // Now Admin logs in
  await page.click('.btn-role-admin');
  await page.fill('.pin-input', 'admin123');
  await page.click('.modal-pin-dialog .btn-confirm');
  await page.waitForSelector('.admin-dashboard-container');

  // Check initial gradebook student list
  const initialStudentList = await page.evaluate(() => localStorage.getItem('skd_admin_student_list') || '[]');
  const parsedInitialStudents = JSON.parse(initialStudentList);
  const countBeforePreview = parsedInitialStudents.length;
  console.log('Gradebook student count before preview:', countBeforePreview);

  // Click "Preview" on the first batch in the table
  const previewBtn = page.locator('.admin-table .btn-table-action', { hasText: 'Preview' }).first();
  await previewBtn.click();
  await page.waitForTimeout(800);

  // Verify Preview Mode UI:
  // 1. Badge "Preview Pengawas" must exist
  const previewBadge = page.locator('text=Preview Pengawas');
  const hasPreviewBadge = await previewBadge.count() > 0;
  console.log('Preview Pengawas badge present:', hasPreviewBadge);
  if (!hasPreviewBadge) {
    throw new Error('FAIL: Preview Pengawas badge not found in preview mode!');
  }
  console.log('PASS: Preview Pengawas badge rendered correctly.');

  // 2. Header back button should say "Dashboard Admin"
  const backText = await page.locator('.btn-back-header').innerText();
  console.log('Preview back button text:', backText);
  if (!backText.includes('Dashboard Admin')) {
    throw new Error(`FAIL: Expected back button to say "Dashboard Admin", got "${backText}"`);
  }
  console.log('PASS: Back button properly set to "Dashboard Admin".');

  // 3. Verify real student info was NOT overwritten in localStorage
  const preservedRealStudent = await page.evaluate(() => localStorage.getItem('skd_student_info'));
  console.log('Real student info preserved during preview:', preservedRealStudent);
  if (!preservedRealStudent || !preservedRealStudent.includes('Budi Santoso')) {
    throw new Error('FAIL: Real student info was overwritten by preview!');
  }
  console.log('PASS: Real student info remained intact in skd_student_info.');

  // Answer a question in preview mode
  await page.locator('.option-card').nth(1).click(); // Option B
  await page.waitForTimeout(300);

  // Check that preview answers are in skd_preview_answers, NOT skd_student_answers
  const storageCheck = await page.evaluate(() => ({
    previewAnswers: localStorage.getItem('skd_preview_answers'),
    studentAnswers: localStorage.getItem('skd_student_answers')
  }));
  console.log('Preview Answers key:', storageCheck.previewAnswers);
  console.log('Student Answers key:', storageCheck.studentAnswers);
  if (!storageCheck.previewAnswers || storageCheck.previewAnswers === '{}') {
    throw new Error('FAIL: Preview answers not stored in skd_preview_answers!');
  }
  console.log('PASS: Preview answers isolated from student answers.');

  // Finish exam in preview mode
  await page.click('.btn-finish');
  await page.waitForSelector('button:has-text("Ya, Selesaikan Ujian")');
  await page.click('button:has-text("Ya, Selesaikan Ujian")');
  await page.waitForSelector('.result-modal-card');
  console.log('PASS: Result card displayed for preview exam.');

  // CRITICAL CHECK: Verify mock preview student was NEVER added to skd_admin_student_list
  const finalStudentList = await page.evaluate(() => localStorage.getItem('skd_admin_student_list') || '[]');
  const parsedFinalStudents = JSON.parse(finalStudentList);
  console.log('Gradebook student count after preview completion:', parsedFinalStudents.length);
  
  const hasPreviewMockStudent = parsedFinalStudents.some(s => s.name?.includes('Pengawas') || s.participantNumber === 'ADMIN-PREVIEW');
  if (hasPreviewMockStudent) {
    throw new Error('FAIL: Preview mock student contaminated the gradebook skd_admin_student_list!');
  }
  console.log('PASS: Gradebook skd_admin_student_list was NOT polluted by preview test.');

  // Close result modal and click "Dashboard Admin"
  await page.click('.result-modal-card .icon-btn'); // close modal
  await page.click('.btn-back-header'); // "Dashboard Admin"
  await page.waitForSelector('.admin-dashboard-container');
  console.log('PASS: Returned cleanly from Preview to Admin Dashboard.');

  // Take screenshot of Admin Dashboard after preview return
  await page.screenshot({ path: `${ARTIFACT_DIR}/preview_clean_return_dashboard.png` });

  await browser.close();
  console.log('\n========================================');
  console.log('ALL STORAGE, AUTH & PREVIEW TESTS PASSED 100%!');
  console.log('========================================\n');
}

testAll().catch(err => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
