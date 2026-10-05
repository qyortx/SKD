/**
 * Main Application Initializer & UI Enhancements
 * Mengatur event listener global, tema gelap/terang, fullscreen,
 * shortcut keyboard, animasi confetti, dan inisialisasi modul.
 */

const App = {
  theme: 'light',
  isMobileDrawerOpen: false,

  init() {
    // Muat tema yang tersimpan
    this.theme = StorageManager.getTheme();
    this.applyTheme(this.theme);

    // Inisialisasi Audio dan Engine
    SoundEngine.init();
    ExamEngine.init();
    AdminPanel.init();

    // Event Bindings
    this.bindGlobalEvents();
    this.bindKeyboardShortcuts();

    console.log('CAT SKD Exam Application successfully initialized.');
  },

  bindGlobalEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.onclick = () => this.toggleTheme();
    }

    // Audio mute toggle
    const audioBtn = document.getElementById('btn-toggle-audio');
    if (audioBtn) {
      audioBtn.onclick = () => this.toggleAudio();
    }

    // Fullscreen toggle
    const fsBtn = document.getElementById('btn-toggle-fullscreen');
    if (fsBtn) {
      fsBtn.onclick = () => this.toggleFullscreen();
    }

    // Font size controls
    const fontIncBtn = document.getElementById('btn-font-increase');
    const fontDecBtn = document.getElementById('btn-font-decrease');
    if (fontIncBtn) fontIncBtn.onclick = () => ExamEngine.changeFontSize(1);
    if (fontDecBtn) fontDecBtn.onclick = () => ExamEngine.changeFontSize(-1);

    // Mobile Drawer Palette Toggle
    const mobileDrawerBtn = document.getElementById('btn-mobile-palette-toggle');
    const mobileCloseDrawerBtn = document.getElementById('btn-close-palette-drawer');
    const paletteDrawer = document.getElementById('question-palette-sidebar');

    if (mobileDrawerBtn && paletteDrawer) {
      mobileDrawerBtn.onclick = () => {
        paletteDrawer.classList.toggle('drawer-open');
      };
    }
    if (mobileCloseDrawerBtn && paletteDrawer) {
      mobileCloseDrawerBtn.onclick = () => {
        paletteDrawer.classList.remove('drawer-open');
      };
    }

    // Navigasi Soal
    const prevBtn = document.getElementById('btn-prev-question');
    const nextBtn = document.getElementById('btn-next-question');
    const flagBtn = document.getElementById('btn-flag-question');
    const clearBtn = document.getElementById('btn-clear-answer');
    const finishBtn = document.getElementById('btn-finish-exam');

    if (prevBtn) prevBtn.onclick = () => ExamEngine.goToPrevQuestion();
    if (nextBtn) nextBtn.onclick = () => ExamEngine.goToNextQuestion();
    if (flagBtn) flagBtn.onclick = () => ExamEngine.toggleCurrentFlag();
    if (clearBtn) clearBtn.onclick = () => ExamEngine.clearCurrentAnswer();
    if (finishBtn) finishBtn.onclick = () => ExamEngine.confirmFinishExam();

    // Filter Kategori Palette (Semua, TWK, TIU, TKP, dsb)
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.onclick = () => {
        const filter = tab.getAttribute('data-filter');
        ExamEngine.applyPaletteFilter(filter);
      };
    });

    // Modal Konfirmasi
    const btnCancelFinish = document.getElementById('btn-cancel-finish');
    const btnConfirmFinish = document.getElementById('btn-confirm-finish');
    if (btnCancelFinish) btnCancelFinish.onclick = () => ExamEngine.closeConfirmModal();
    if (btnConfirmFinish) btnConfirmFinish.onclick = () => ExamEngine.calculateAndShowResult();

    // Modal Hasil
    const btnReviewMode = document.getElementById('btn-start-review');
    const btnRestartExam = document.getElementById('btn-restart-exam');
    const btnPrintResult = document.getElementById('btn-print-result');
    const btnCloseResult = document.getElementById('btn-close-result-modal');

    if (btnReviewMode) btnReviewMode.onclick = () => ExamEngine.startReviewMode();
    if (btnRestartExam) btnRestartExam.onclick = () => ExamEngine.restartNewExam();
    if (btnPrintResult) btnPrintResult.onclick = () => window.print();
    if (btnCloseResult) btnCloseResult.onclick = () => ExamEngine.closeResultModal();

    // Admin Panel Controls
    const btnAddQ = document.getElementById('btn-admin-add-question');
    const btnResetBank = document.getElementById('btn-admin-reset-bank');
    const btnExportJSON = document.getElementById('btn-admin-export');
    const btnImportJSON = document.getElementById('btn-admin-import');
    const fileImportInput = document.getElementById('admin-file-import');
    const btnSaveDuration = document.getElementById('btn-admin-save-duration');

    if (btnAddQ) btnAddQ.onclick = () => AdminPanel.openAddQuestionForm();
    if (btnResetBank) btnResetBank.onclick = () => AdminPanel.resetToDefault();
    if (btnExportJSON) btnExportJSON.onclick = () => AdminPanel.exportJSON();
    if (btnImportJSON) btnImportJSON.onclick = () => AdminPanel.triggerImportJSON();
    if (fileImportInput) fileImportInput.onchange = (e) => AdminPanel.handleImportFile(e);
    if (btnSaveDuration) btnSaveDuration.onclick = () => AdminPanel.saveDurationSetting();

    // Form Editor Modal
    const btnCloseForm = document.getElementById('btn-close-form-modal');
    const btnCancelForm = document.getElementById('btn-cancel-form');
    const questionForm = document.getElementById('question-editor-form');

    if (btnCloseForm) btnCloseForm.onclick = () => AdminPanel.closeQuestionForm();
    if (btnCancelForm) btnCancelForm.onclick = () => AdminPanel.closeQuestionForm();
    if (questionForm) questionForm.onsubmit = (e) => AdminPanel.saveQuestionFromForm(e);

    // Modal Background Clicks to Dismiss
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.remove('is-open');
        }
      };
    });
  },

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Abaikan shortcut jika sedang mengetik di input/textarea
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const key = e.key.toUpperCase();

      // Pilih Opsi A, B, C, D, E
      if (['A', 'B', 'C', 'D', 'E'].includes(key)) {
        ExamEngine.selectOption(key);
      } else if (['1', '2', '3', '4', '5'].includes(key)) {
        const map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E' };
        ExamEngine.selectOption(map[key]);
      } else if (e.key === 'ArrowRight' || key === 'N') {
        ExamEngine.goToNextQuestion();
      } else if (e.key === 'ArrowLeft' || key === 'P') {
        ExamEngine.goToPrevQuestion();
      } else if (key === 'R') {
        ExamEngine.toggleCurrentFlag();
      } else if (key === 'H' || e.key === 'Delete') {
        ExamEngine.clearCurrentAnswer();
      }
    });
  },

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    StorageManager.saveTheme(this.theme);
    this.applyTheme(this.theme);
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const iconContainer = document.getElementById('theme-icon-container');
    if (iconContainer) {
      if (theme === 'dark') {
        iconContainer.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        `;
      } else {
        iconContainer.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        `;
      }
    }
  },

  toggleAudio() {
    const isEnabled = SoundEngine.toggle();
    const btn = document.getElementById('btn-toggle-audio');
    if (btn) {
      if (isEnabled) {
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
        btn.title = "Suara Efek: Aktif";
      } else {
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
        btn.title = "Suara Efek: Dinonaktifkan";
      }
    }
  },

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }
};

// Jalankan ketika DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
