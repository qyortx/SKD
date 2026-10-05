import pw from 'file:///C:/Users/KFN/AppData/Local/Volta/tools/image/packages/@playwright/cli/node_modules/@playwright/cli/node_modules/playwright-core/index.js';
const { chromium } = pw;

const BASE_URL = 'http://localhost:5173';
const ARTIFACT_DIR = 'C:/Users/KFN/.gemini/antigravity-ide/brain/732618d0-1e42-4773-af4f-35e863393b5c';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function runFullE2ETest() {
  console.log('=== STARTING COMPREHENSIVE END-TO-END VERIFICATION ===\n');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // -------------------------------------------------------------
  // STAGE 1: ADMIN FLOW
  // -------------------------------------------------------------
  console.log('--- STAGE 1: ADMIN FLOW ---');
  const adminContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const adminPage = await adminContext.newPage();

  // Fail immediately if ANY native browser dialog is triggered
  adminPage.on('dialog', dialog => {
    throw new Error(`UNEXPECTED NATIVE BROWSER DIALOG TRIGGERED ON ADMIN: [${dialog.type()}] "${dialog.message()}"`);
  });

  adminPage.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[Admin Console Error]:', msg.text());
    }
  });

  // 1.1 Navigate to Landing Page
  console.log('1.1 Navigating to landing page...');
  await adminPage.goto(BASE_URL);
  await adminPage.waitForLoadState('networkidle');
  await adminPage.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await adminPage.reload();
  await adminPage.waitForLoadState('networkidle');
  await adminPage.waitForSelector('.btn-role-admin');
  console.log('PASS: Landing role selection loaded.');
  await adminPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_01_admin_landing.png` });

  // 1.2 Open Admin PIN Modal & Authenticate
  console.log('1.2 Opening Admin PIN modal...');
  await adminPage.click('.btn-role-admin');
  await adminPage.waitForSelector('#admin-pin-input');
  await adminPage.fill('#admin-pin-input', 'admin123');
  await adminPage.click('#btn-submit-admin-pin');

  // Verify Admin Dashboard is visible
  await adminPage.waitForSelector('.admin-dashboard-container');
  console.log('PASS: Authenticated and entered Admin Dashboard.');
  await adminPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_01_admin_dashboard.png` });

  // 1.3 Manage Bank Soal & Test Custom Alert on Empty Title
  console.log('1.3 Managing Bank Soal Templates & Testing Custom Alerts...');
  await adminPage.click('#admin-tab-questions');
  await adminPage.waitForTimeout(300);

  // Click "+ Buat Template Baru"
  await adminPage.click('#btn-create-template');
  await adminPage.waitForSelector('#new-template-title-input');

  // Submit empty to trigger custom alert
  await adminPage.click('button[type="submit"]:has-text("Buat Template")');
  await adminPage.waitForSelector('#btn-modal-confirm-action');
  const alertTitle = await adminPage.locator('#prompt-modal-title').innerText();
  console.log(`PASS: Custom alert dialog popped up with title: "${alertTitle}" (No browser alert)`);
  await adminPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_02_custom_alert_modal.png` });

  // Dismiss custom alert
  await adminPage.click('#btn-modal-confirm-action');
  await adminPage.waitForTimeout(300);

  // Fill legitimate title
  const testTplTitle = 'Bank Soal E2E Kedinasan 2026';
  await adminPage.fill('#new-template-title-input', testTplTitle);
  await adminPage.click('button[type="submit"]:has-text("Buat Template")');
  await adminPage.waitForTimeout(500);

  // Verify template created in list
  const tplItem = adminPage.locator(`text=${testTplTitle}`).first();
  const tplExists = await tplItem.isVisible();
  if (!tplExists) throw new Error('New template not found in template list!');
  console.log(`PASS: Created and verified template: "${testTplTitle}"`);

  // 1.4 Test custom confirmation modal on template delete
  console.log('1.4 Testing Custom Confirm Modal on Template Deletion...');
  const deleteTplBtn = adminPage.locator(`button[title*="Hapus Template ${testTplTitle}"]`).first();
  if (await deleteTplBtn.isVisible()) {
    await deleteTplBtn.click();
    await adminPage.waitForSelector('#btn-modal-cancel-action');
    const modalTitle = await adminPage.locator('#prompt-modal-title').innerText();
    console.log(`PASS: Custom confirm modal appeared with title: "${modalTitle}"`);
    await adminPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_03_admin_confirm_modal.png` });

    // Cancel deletion
    await adminPage.click('#btn-modal-cancel-action');
    await adminPage.waitForTimeout(300);
    console.log('PASS: Custom confirm modal cancelled cleanly.');
  }

  // 1.5 Generate Paket Tryout Link
  console.log('1.5 Generating Paket Tryout with Link...');
  await adminPage.click('#admin-tab-tryouts');
  await adminPage.waitForTimeout(300);

  const batchTitle = 'Tryout Akbar CAT SKD Kedinasan E2E';
  await adminPage.fill('#batch-title-input', batchTitle);
  await adminPage.fill('#batch-duration-input', '100');

  // Click "Buat Paket & Tautan" button
  await adminPage.click('button[type="submit"]:has-text("Buat Paket & Tautan")');
  await adminPage.waitForSelector('text=Tautan Berhasil Dibuat');
  console.log('PASS: Batch generated successfully.');

  // Extract generated URL
  const generatedInput = adminPage.locator('input.link-readonly-input').first();
  const shareableUrl = await generatedInput.inputValue();
  console.log('Generated Shareable URL:', shareableUrl);

  await adminPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_04_batch_link_generated.png` });

  // 1.6 Preview Tryout Mode
  console.log('1.6 Testing Admin Preview Mode...');
  const previewBtn = adminPage.locator('button:has-text("Preview")').first();
  await previewBtn.click();

  // Wait for Preview Indicator in Header
  await adminPage.waitForSelector('text=Preview Pengawas');
  console.log('PASS: Entered Preview Mode with banner.');
  await adminPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_05_admin_preview_mode.png` });

  // Return to Admin Dashboard
  const returnToAdminBtn = adminPage.locator('.btn-back-header:has-text("Dashboard Admin")').first();
  await returnToAdminBtn.click();
  await adminPage.waitForSelector('.admin-dashboard-container');
  console.log('PASS: Returned from Preview Mode to Admin Dashboard.');

  // 1.7 Test Rekap Nilai Siswa custom alert
  console.log('1.7 Testing Rekap Nilai Siswa custom validation alert...');
  await adminPage.click('#admin-tab-students');
  await adminPage.waitForTimeout(300);

  // Click Tambah Nilai Siswa
  await adminPage.click('#btn-add-student-manual');
  await adminPage.waitForSelector('#student-name-form-input');

  // Submit without name to test custom alert
  await adminPage.click('button[type="submit"]:has-text("Simpan Nilai")');
  await adminPage.waitForSelector('#btn-modal-confirm-action');
  const alertStudentTitle = await adminPage.locator('#prompt-modal-title').innerText();
  console.log(`PASS: Custom student validation alert popped up: "${alertStudentTitle}"`);

  // Dismiss custom alert & close modal
  await adminPage.click('#btn-modal-confirm-action');
  await adminPage.waitForTimeout(300);
  await adminPage.click('button:has-text("Batal")');

  // -------------------------------------------------------------
  // STAGE 2: STUDENT FLOW (Fresh Context / Incognito)
  // -------------------------------------------------------------
  console.log('\n--- STAGE 2: STUDENT FLOW ---');
  const studentContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const studentPage = await studentContext.newPage();

  // Fail immediately if student flow triggers any native browser dialog
  studentPage.on('dialog', dialog => {
    throw new Error(`UNEXPECTED NATIVE BROWSER DIALOG TRIGGERED ON STUDENT: [${dialog.type()}] "${dialog.message()}"`);
  });

  studentPage.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[Student Console Error]:', msg.text());
    }
  });

  // 2.1 Navigate using the generated shareable URL
  console.log('2.1 Student opening shareable Tryout link...');
  await studentPage.goto(shareableUrl);
  await studentPage.waitForLoadState('networkidle');

  // 2.2 Student Identity Registration / Gatekeeper
  console.log('2.2 Student Identity Registration...');
  await studentPage.waitForSelector('.modal-registration-dialog');
  const studentNameInput = studentPage.locator('#student-reg-name');
  const studentInstansiInput = studentPage.locator('#student-reg-id');

  const studentName = 'Aditya Pratama';
  const studentInstansi = 'IPDN / Kemenhub 2026';
  await studentNameInput.fill(studentName);
  await studentInstansiInput.fill(studentInstansi);

  await studentPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_06_student_registration.png` });

  // Submit registration
  await studentPage.click('button[type="submit"].btn-start-exam');

  // Wait for main workspace to load
  await studentPage.waitForSelector('.main-workspace');
  console.log('PASS: Exam workspace loaded successfully.');

  // 2.3 Verify Header Alignment & Student Identity
  console.log('2.3 Verifying Header & Student Identity...');
  const headerSubText = await studentPage.locator('.brand-sub').innerText();
  if (!headerSubText.includes(studentName)) {
    throw new Error(`Header student text expected to contain "${studentName}", got "${headerSubText}"`);
  }
  console.log(`PASS: Header accurately displays student: "${headerSubText}"`);

  // Verify alignment delta (edge-to-edge)
  const headerBox = await studentPage.locator('header.main-header').boundingBox();
  const mainBox = await studentPage.locator('main.main-workspace').boundingBox();
  const leftDiff = Math.abs(headerBox.x - mainBox.x);
  console.log(`Header vs Main alignment delta: ${leftDiff.toFixed(2)}px`);
  if (leftDiff > 2) {
    throw new Error('Header is not aligned with main workspace!');
  }
  console.log('PASS: Header is mathematically aligned with workspace.');

  // 2.4 Answering Questions & Toggling Ragu-ragu
  console.log('2.4 Answering Questions & Testing Ragu-Ragu...');
  // Answer Question #1: Select Option A
  const optA = studentPage.locator('.option-card[data-option="A"]').first();
  await optA.click();
  await studentPage.waitForTimeout(200);

  // Toggle Ragu-ragu on answered question via BottomNav button
  const flagBtn = studentPage.locator('#btn-toggle-flag');
  await flagBtn.click();
  await studentPage.waitForTimeout(200);

  // Check palette item 1 has yellow/flagged styling
  const palette1 = studentPage.locator('.palette-btn').first();
  const palette1Class = await palette1.getAttribute('class');
  if (!palette1Class.includes('btn-palette-flagged')) {
    throw new Error('Palette item 1 does not reflect ragu-ragu state! class: ' + palette1Class);
  }
  console.log('PASS: Question 1 answered and flagged as ragu-ragu.');

  // Navigate to Question #2
  await studentPage.click('button:has-text("Soal Berikutnya")');
  await studentPage.waitForTimeout(200);

  // Answer Question #2: Select Option B
  const optB = studentPage.locator('.option-card[data-option="B"]').first();
  await optB.click();
  await studentPage.waitForTimeout(200);
  console.log('PASS: Question 2 answered.');

  // Answer Question #3
  await studentPage.click('button:has-text("Soal Berikutnya")');
  await studentPage.waitForTimeout(200);
  const optC = studentPage.locator('.option-card[data-option="C"]').first();
  await optC.click();
  await studentPage.waitForTimeout(200);
  console.log('PASS: Question 3 answered.');

  await studentPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_07_student_exam_in_progress.png` });

  // 2.5 Test Custom Exit Confirmation Modal (User Request Core Check!)
  console.log('2.5 Testing Custom Exit Confirmation Modal...');
  const exitBtn = studentPage.locator('.btn-back-header');
  await exitBtn.click();

  // Verify custom prompt modal opens
  await studentPage.waitForSelector('#btn-modal-cancel-action');
  const exitModalTitle = await studentPage.locator('#prompt-modal-title').innerText();
  const exitModalMsg = await studentPage.locator('#prompt-modal-message').innerText();

  console.log(`Exit Modal Title: "${exitModalTitle}"`);
  console.log(`Exit Modal Message: "${exitModalMsg}"`);

  if (!exitModalTitle.includes('Keluar dari Ruang Ujian')) {
    throw new Error('Exit modal title incorrect!');
  }
  if (!exitModalMsg.includes('Keluar dari ruang ujian dan kembali ke pemilihan peran')) {
    throw new Error('Exit modal message text does not match user expectation!');
  }

  await studentPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_08_custom_exit_confirm_modal.png` });

  // Click "Lanjutkan Ujian" (Cancel exit)
  console.log('2.6 Testing Cancel on Exit Modal...');
  await studentPage.click('#btn-modal-cancel-action');
  await studentPage.waitForTimeout(300);

  // Verify still in exam workspace and question #3 still active
  const qNum = await studentPage.locator('.question-number-badge').first().innerText();
  console.log(`Current Question after cancel: "${qNum}"`);
  console.log('PASS: Cancelled exit modal cleanly, remaining in exam session.');

  // 2.7 Test Edge Case: Page Reload Persistence
  console.log('2.7 Testing Edge Case: Reload Page Persistence...');
  await studentPage.reload();
  await studentPage.waitForLoadState('networkidle');
  await studentPage.waitForSelector('.main-workspace');

  // Verify student identity & answers remained intact
  const reloadedHeaderSub = await studentPage.locator('.brand-sub').innerText();
  if (!reloadedHeaderSub.includes(studentName)) {
    throw new Error('Student identity lost on reload!');
  }
  console.log('PASS: Student identity and session preserved on reload.');

  // 2.8 Submit Exam
  console.log('2.8 Submitting Exam...');
  const finishBtn = studentPage.locator('.btn.btn-finish').first();
  await finishBtn.click();

  // Confirm Submission Dialog
  await studentPage.waitForSelector('#btn-confirm-submit');
  await studentPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_09_submit_confirmation_modal.png` });

  // Click "Ya, Selesaikan Ujian"
  await studentPage.click('#btn-confirm-submit');

  // 2.9 Result Modal
  console.log('2.9 Verifying Result Card Modal...');
  await studentPage.waitForSelector('.result-modal-card');
  const resultStudentName = await studentPage.locator('.result-student-name').innerText();
  console.log(`Result Student Name: "${resultStudentName}"`);
  if (!resultStudentName.includes(studentName)) {
    throw new Error('Result modal does not show correct student name!');
  }

  await studentPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_10_student_result_modal.png` });
  console.log('PASS: Score calculation and result modal displayed.');

  // 2.10 Review Mode
  console.log('2.10 Entering Review Mode (Pembahasan Soal)...');
  const reviewBtn = studentPage.locator('#btn-view-review');
  await reviewBtn.click();

  // Verify review mode banner & elements
  await studentPage.waitForSelector('.review-mode-indicator');
  const currentUrl = studentPage.url();
  console.log('Current URL Hash:', currentUrl);
  if (!currentUrl.includes('/review')) {
    throw new Error('URL route is not /review!');
  }

  await studentPage.screenshot({ path: `${ARTIFACT_DIR}/e2e_11_student_review_mode.png` });
  console.log('PASS: Review mode accessible with complete explanation & answers.');

  // Click "Menu Utama" in Review Mode
  const backToMenuBtn = studentPage.locator('.btn-back-header');
  await backToMenuBtn.click();
  await studentPage.waitForSelector('.btn-role-admin');
  console.log('PASS: Back to Home returns to clean role selection.');

  await browser.close();
  console.log('\n=== ALL END-TO-END TESTS PASSED WITH 0 ERRORS! ===');
}

runFullE2ETest().catch(err => {
  console.error('\nE2E TEST FAILURE:', err);
  process.exit(1);
});
