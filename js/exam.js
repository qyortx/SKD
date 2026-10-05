/**
 * Exam Engine
 * Mengatur jalannya ujian, timer hitung mundur, perpindahan nomor soal,
 * pewarnaan 110 tombol nomor soal, kalkulasi skor akurat (1-65 @ 5 poin, 66-110 @ 1-5 poin),
 * konfirmasi selesai ujian, dan mode pembahasan (review).
 */

const ExamEngine = {
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  userFlags: {},
  timerSeconds: 100 * 60,
  timerInterval: null,
  isReviewMode: false,
  activeFilter: 'all',
  fontSizeLevel: 0, // -1: small, 0: normal, 1: large

  // Konfigurasi Nilai Ambang Batas (Passing Grade PermenPAN-RB)
  PASSING_GRADES: {
    TWK: 65,  // Soal 1-30 (Max 150)
    TIU: 80,  // Soal 31-65 (Max 175)
    TKP: 166, // Soal 66-110 (Max 225)
    TOTAL: 311 // Max 550
  },

  init() {
    this.questions = StorageManager.getQuestions();
    this.userAnswers = StorageManager.getUserAnswers();
    this.userFlags = StorageManager.getUserFlags();
    this.timerSeconds = StorageManager.getTimerRemaining();
    this.isReviewMode = false;

    // Render palette 110 nomor soal
    this.renderQuestionPalette();

    // Render soal pertama
    this.renderCurrentQuestion();

    // Jalankan timer
    this.startTimer();

    // Perbarui statistik status bar
    this.updateStatsBar();

    // Cek apakah sudah pernah menyelesaikan ujian sebelumnya
    const lastStatus = StorageManager.getExamStatus();
    if (lastStatus === 'completed') {
      const lastResult = StorageManager.getLastResult();
      if (lastResult) {
        // Tampilkan modal hasil atau biarkan peserta meninjau
      }
    }
  },

  // ===================== TIMER HITUNG MUNDUR =====================
  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.isReviewMode) {
        clearInterval(this.timerInterval);
        return;
      }

      this.timerSeconds--;
      StorageManager.saveTimerRemaining(this.timerSeconds);
      this.updateTimerDisplay();

      // Suara peringatan pada menit 5 dan menit 1
      if (this.timerSeconds === 300 || this.timerSeconds === 60) {
        SoundEngine.playWarning();
      }

      // Waktu habis
      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.timerSeconds = 0;
        this.updateTimerDisplay();
        this.autoSubmitOnTimeUp();
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const timerEl = document.getElementById('countdown-timer');
    const timerBarEl = document.getElementById('timer-progress-fill');
    if (!timerEl) return;

    const totalSeconds = StorageManager.getExamDuration() * 60;
    const remaining = Math.max(0, this.timerSeconds);

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    const pad = (n) => n.toString().padStart(2, '0');
    timerEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    // Peringatan visual jika waktu < 10 menit
    const timerBox = document.getElementById('timer-badge');
    if (timerBox) {
      if (remaining <= 300) {
        timerBox.className = 'timer-badge critical-time';
      } else if (remaining <= 600) {
        timerBox.className = 'timer-badge warning-time';
      } else {
        timerBox.className = 'timer-badge normal-time';
      }
    }

    // Update progress bar lebar timer
    if (timerBarEl) {
      const percentage = (remaining / totalSeconds) * 100;
      timerBarEl.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    }
  },

  autoSubmitOnTimeUp() {
    alert('Waktu ujian telah berakhir! Sistem akan secara otomatis mengumpulkan lembar jawaban Anda.');
    this.calculateAndShowResult();
  },

  // ===================== NAVIGASI & PERPINDAHAN SOAL =====================
  goToQuestion(index) {
    if (index < 0 || index >= this.questions.length) return;
    this.currentIndex = index;
    SoundEngine.playClick();
    this.renderCurrentQuestion();
    this.updatePaletteActiveItem();
  },

  goToNextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.goToQuestion(this.currentIndex + 1);
    }
  },

  goToPrevQuestion() {
    if (this.currentIndex > 0) {
      this.goToQuestion(this.currentIndex - 1);
    }
  },

  toggleCurrentFlag() {
    const q = this.questions[this.currentIndex];
    if (!q) return;

    const newState = StorageManager.toggleUserFlag(q.id);
    this.userFlags[q.id] = newState;

    SoundEngine.playClick();
    this.updateCurrentFlagButton();
    this.renderQuestionPaletteItem(q.id);
    this.updateStatsBar();
  },

  clearCurrentAnswer() {
    const q = this.questions[this.currentIndex];
    if (!q) return;

    StorageManager.saveUserAnswer(q.id, null);
    delete this.userAnswers[q.id];

    SoundEngine.playClick();
    this.renderCurrentQuestion();
    this.renderQuestionPaletteItem(q.id);
    this.updateStatsBar();
  },

  selectOption(optionKey) {
    if (this.isReviewMode) return; // Mode review tidak boleh mengubah jawaban

    const q = this.questions[this.currentIndex];
    if (!q) return;

    this.userAnswers[q.id] = optionKey;
    StorageManager.saveUserAnswer(q.id, optionKey);

    SoundEngine.playSelect();

    // Render ulang opsi untuk menandai pilihan aktif
    this.renderOptions(q);

    // Update tombol nomor di sebelah kanan
    this.renderQuestionPaletteItem(q.id);

    // Update status counter
    this.updateStatsBar();
  },

  // ===================== RENDERING SOAL UTAMA =====================
  renderCurrentQuestion() {
    const q = this.questions[this.currentIndex];
    if (!q) return;

    // Header Soal
    const qNumberEl = document.getElementById('question-number-display');
    const qCategoryEl = document.getElementById('question-category-badge');
    const qTitleEl = document.getElementById('question-title-text');
    const qTopicEl = document.getElementById('question-topic-badge');
    const qScoringBadgeEl = document.getElementById('question-scoring-badge');
    const qBodyEl = document.getElementById('question-body-text');

    if (qNumberEl) qNumberEl.textContent = `Soal No. ${q.id} dari ${this.questions.length}`;

    if (qCategoryEl) {
      qCategoryEl.textContent = q.category || (q.id <= 30 ? 'TWK' : q.id <= 65 ? 'TIU' : 'TKP');
      qCategoryEl.className = `category-tag tag-${(q.category || '').toLowerCase()}`;
    }

    // User requirement: "Terdapat judul di setiap 1 soal yang muncul"
    if (qTitleEl) {
      qTitleEl.textContent = q.title || `Soal Nomor ${q.id}`;
    }

    if (qTopicEl) {
      qTopicEl.textContent = q.topic || q.categoryName || 'Kompetensi Dasar';
    }

    // Keterangan Bobot Penilaian
    if (qScoringBadgeEl) {
      if (q.id <= 65 || q.scoringType === 'single') {
        qScoringBadgeEl.innerHTML = `<span>Bobot Nilai:</span> <strong>Benar = 5 Poin</strong> | Salah/Kosong = 0 Poin`;
        qScoringBadgeEl.className = 'scoring-info-badge single-scoring';
      } else {
        qScoringBadgeEl.innerHTML = `<span>Bobot Nilai:</span> <strong>Skala 1 - 5 Poin</strong> (Setiap pilihan bernilai)`;
        qScoringBadgeEl.className = 'scoring-info-badge scale-scoring';
      }
    }

    // Render Gambar Soal jika ada
    const existingImgBox = document.getElementById('question-dynamic-image-box');
    if (existingImgBox) existingImgBox.remove();

    if (q.image) {
      const imgBox = document.createElement('div');
      imgBox.id = 'question-dynamic-image-box';
      imgBox.className = 'question-image-box';
      imgBox.innerHTML = `
        <div class="question-image-wrapper">
          <img src="${q.image}" alt="${q.imageCaption || 'Gambar Soal'}" class="question-img" onclick="ExamEngine.zoomImage('${q.image}', '${q.imageCaption ? q.imageCaption.replace(/'/g, "\\'") : ''}')">
          <button class="img-zoom-btn" type="button" onclick="ExamEngine.zoomImage('${q.image}', '${q.imageCaption ? q.imageCaption.replace(/'/g, "\\'") : ''}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span>Perbesar</span>
          </button>
        </div>
        ${q.imageCaption ? `<div class="question-img-caption"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><span>${q.imageCaption}</span></div>` : ''}
      `;
      if (qBodyEl && qBodyEl.parentNode) {
        qBodyEl.parentNode.insertBefore(imgBox, qBodyEl);
      }
    }

    // Teks Soal
    if (qBodyEl) {
      qBodyEl.innerHTML = this.formatQuestionText(q.question);
    }

    // Render Opsi A, B, C, D, E
    this.renderOptions(q);

    // Update Navigasi Button (Sebelumnya & Berikutnya)
    const prevBtn = document.getElementById('btn-prev-question');
    const nextBtn = document.getElementById('btn-next-question');

    if (prevBtn) {
      prevBtn.disabled = this.currentIndex === 0;
    }

    if (nextBtn) {
      if (this.currentIndex === this.questions.length - 1) {
        nextBtn.innerHTML = `<span>Selesai Ujian</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        nextBtn.className = 'btn btn-finish-alt';
        nextBtn.onclick = () => ExamEngine.confirmFinishExam();
      } else {
        nextBtn.innerHTML = `<span>Soal Berikutnya</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
        nextBtn.className = 'btn btn-primary';
        nextBtn.onclick = () => ExamEngine.goToNextQuestion();
      }
    }

    // Update Tombol Ragu-ragu
    this.updateCurrentFlagButton();

    // Render Pembahasan jika dalam Mode Review
    this.renderExplanationBox(q);
  },

  formatQuestionText(text) {
    if (!text) return '';
    if (window.katex) {
      try {
        return text
          .replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
            return `<div class="katex-display-wrapper">${window.katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })}</div>`;
          })
          .replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
            return `<span class="katex-inline-wrapper">${window.katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })}</span>`;
          })
          .replace(/\n/g, '<br>');
      } catch (e) {
        return text.replace(/\n/g, '<br>');
      }
    }
    return text.replace(/\n/g, '<br>');
  },

  zoomImage(src, caption) {
    let backdrop = document.getElementById('exam-zoom-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'exam-zoom-backdrop';
      backdrop.className = 'modal-backdrop is-open img-zoom-backdrop';
      backdrop.style.zIndex = '1300';
      backdrop.onclick = () => backdrop.remove();
      document.body.appendChild(backdrop);
    }
    backdrop.innerHTML = `
      <div class="img-zoom-container" onclick="event.stopPropagation()">
        <div class="img-zoom-header">
          <span>${caption || 'Lampiran Gambar Soal'}</span>
          <button class="icon-btn" onclick="document.getElementById('exam-zoom-backdrop').remove()">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="img-zoom-body">
          <img src="${src}" alt="Detail Gambar" class="img-zoom-full">
        </div>
      </div>
    `;
  },

  renderOptions(question) {
    const container = document.getElementById('options-container');
    if (!container) return;

    container.innerHTML = '';
    const selectedOption = this.userAnswers[question.id];
    const letters = ['A', 'B', 'C', 'D', 'E'];

    letters.forEach(letter => {
      const optionText = question.options ? question.options[letter] : '';
      const optionImg = question.optionImages ? question.optionImages[letter] : null;
      if (!optionText && !optionImg) return;

      const isSelected = selectedOption === letter;
      const optionCard = document.createElement('div');

      let optionClasses = ['option-card'];
      if (isSelected) optionClasses.push('is-selected');

      // Tampilan khusus jika dalam mode pembahasan (Review)
      let reviewBadgeHtml = '';
      if (this.isReviewMode) {
        if (question.id <= 65 || question.scoringType === 'single') {
          const isCorrect = question.correctAnswer === letter;
          if (isCorrect) optionClasses.push('review-correct');
          if (isSelected && !isCorrect) optionClasses.push('review-wrong');
          if (isCorrect) {
            reviewBadgeHtml = `<span class="review-badge badge-success">Kunci Benar (+5)</span>`;
          } else if (isSelected) {
            reviewBadgeHtml = `<span class="review-badge badge-danger">Jawaban Anda (+0)</span>`;
          }
        } else {
          // Soal TKP 66-110: Tampilkan poin masing-masing opsi
          const pts = (question.points && question.points[letter] !== undefined) ? question.points[letter] : 0;
          if (pts === 5) optionClasses.push('review-correct');
          if (isSelected) optionClasses.push('review-user-chosen');
          reviewBadgeHtml = `<span class="review-badge ${pts === 5 ? 'badge-success' : 'badge-neutral'}">Nilai: ${pts} Poin</span>`;
        }
      }

      optionCard.className = optionClasses.join(' ');
      optionCard.setAttribute('data-option', letter);

      const imgHtml = optionImg ? `
        <div class="option-img-container">
          <img src="${optionImg}" alt="Opsi ${letter}" class="option-img-preview" onclick="event.stopPropagation(); ExamEngine.zoomImage('${optionImg}', 'Pilihan Opsi ${letter}')">
        </div>
      ` : '';
      const textHtml = optionText ? `<div class="option-text">${this.formatQuestionText(optionText)}</div>` : '';

      optionCard.innerHTML = `
        <div class="option-indicator">${letter}</div>
        <div class="option-content">
          ${imgHtml}
          ${textHtml}
          ${reviewBadgeHtml}
        </div>
      `;

      optionCard.onclick = () => this.selectOption(letter);
      container.appendChild(optionCard);
    });
  },

  updateCurrentFlagButton() {
    const q = this.questions[this.currentIndex];
    const flagBtn = document.getElementById('btn-flag-question');
    if (!flagBtn || !q) return;

    const isFlagged = !!this.userFlags[q.id];
    if (isFlagged) {
      flagBtn.className = 'btn btn-warning active';
      flagBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v19"/></svg> <span>Ragu-Ragu (Ditandai)</span>`;
    } else {
      flagBtn.className = 'btn btn-outline-warning';
      flagBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v19"/></svg> <span>Tandai Ragu-Ragu</span>`;
    }
  },

  renderExplanationBox(question) {
    const boxEl = document.getElementById('explanation-container');
    if (!boxEl) return;

    if (!this.isReviewMode) {
      boxEl.style.display = 'none';
      return;
    }

    boxEl.style.display = 'block';

    const userAns = this.userAnswers[question.id] || 'Tidak Dijawab';
    let pointsEarned = 0;

    if (question.id <= 65 || question.scoringType === 'single') {
      pointsEarned = (userAns === question.correctAnswer) ? 5 : 0;
    } else {
      pointsEarned = (question.points && question.points[userAns] !== undefined) ? question.points[userAns] : 0;
    }

    boxEl.innerHTML = `
      <div class="explanation-card">
        <div class="explanation-header">
          <div class="exp-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <strong>Pembahasan & Kunci Jawaban Resmi</strong>
          </div>
          <div class="exp-points-badge ${pointsEarned > 0 ? 'bg-success' : 'bg-danger'}">
            Skor Anda: +${pointsEarned} Poin
          </div>
        </div>
        <div class="explanation-body">
          <div class="exp-row">
            <span>Jawaban Anda:</span> <strong>${userAns}</strong>
            ${(question.id <= 65) ? ` | <span>Kunci Jawaban Benar:</span> <strong class="text-success">${question.correctAnswer}</strong>` : ''}
          </div>
          <div class="exp-content">
            <p>${question.explanation || 'Belum ada penjelasan tambahan untuk soal ini.'}</p>
          </div>
        </div>
      </div>
    `;
  },

  // ===================== LEMBAR NOMOR SOAL (PALETTE 110 BUTTONS) =====================
  renderQuestionPalette() {
    const container = document.getElementById('question-palette-grid');
    if (!container) return;

    container.innerHTML = '';

    this.questions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = `palette-btn-${q.id}`;
      btn.className = this.getPaletteItemClass(q, idx);
      btn.textContent = q.id;
      btn.title = `Soal No. ${q.id} (${q.category || ''})`;

      btn.onclick = () => this.goToQuestion(idx);
      container.appendChild(btn);
    });

    this.applyPaletteFilter(this.activeFilter);
  },

  renderQuestionPaletteItem(questionId) {
    const btn = document.getElementById(`palette-btn-${questionId}`);
    if (!btn) return;

    const idx = this.questions.findIndex(q => q.id === questionId);
    if (idx === -1) return;

    const q = this.questions[idx];
    btn.className = this.getPaletteItemClass(q, idx);
  },

  updatePaletteActiveItem() {
    // Hapus kelas aktif dari semua tombol
    document.querySelectorAll('.palette-item.is-current').forEach(el => {
      el.classList.remove('is-current');
    });

    // Pasang pada tombol yang aktif sekarang
    const currentQ = this.questions[this.currentIndex];
    if (currentQ) {
      const btn = document.getElementById(`palette-btn-${currentQ.id}`);
      if (btn) btn.classList.add('is-current');
    }
  },

  getPaletteItemClass(question, index) {
    const classes = ['palette-item'];
    const isCurrent = index === this.currentIndex;
    const isAnswered = this.userAnswers[question.id] !== undefined && this.userAnswers[question.id] !== null;
    const isFlagged = !!this.userFlags[question.id];

    if (isCurrent) classes.push('is-current');
    if (isFlagged) {
      classes.push('is-flagged');
    } else if (isAnswered) {
      classes.push('is-answered');
    } else {
      classes.push('is-unanswered');
    }

    // Dalam mode review: tandai benar/salah secara visual
    if (this.isReviewMode) {
      if (question.id <= 65) {
        if (this.userAnswers[question.id] === question.correctAnswer) {
          classes.push('review-num-correct');
        } else {
          classes.push('review-num-wrong');
        }
      } else {
        const pts = (question.points && question.points[this.userAnswers[question.id]]) || 0;
        if (pts >= 4) {
          classes.push('review-num-correct');
        } else {
          classes.push('review-num-tkp-medium');
        }
      }
    }

    return classes.join(' ');
  },

  applyPaletteFilter(filterKey) {
    this.activeFilter = filterKey;

    // Update active tab visual
    document.querySelectorAll('.filter-tab').forEach(tab => {
      if (tab.getAttribute('data-filter') === filterKey) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    this.questions.forEach((q, idx) => {
      const btn = document.getElementById(`palette-btn-${q.id}`);
      if (!btn) return;

      let visible = true;
      const isAnswered = this.userAnswers[q.id] !== undefined && this.userAnswers[q.id] !== null;
      const isFlagged = !!this.userFlags[q.id];

      if (filterKey === 'twk') {
        visible = q.id <= 30 || q.category === 'TWK';
      } else if (filterKey === 'tiu') {
        visible = (q.id >= 31 && q.id <= 65) || q.category === 'TIU';
      } else if (filterKey === 'tkp') {
        visible = q.id >= 66 || q.category === 'TKP';
      } else if (filterKey === 'answered') {
        visible = isAnswered;
      } else if (filterKey === 'unanswered') {
        visible = !isAnswered;
      } else if (filterKey === 'flagged') {
        visible = isFlagged;
      }

      btn.style.display = visible ? 'flex' : 'none';
    });
  },

  updateStatsBar() {
    const totalCount = this.questions.length;
    const answeredCount = Object.keys(this.userAnswers).filter(k => this.userAnswers[k] !== null).length;
    const unansweredCount = totalCount - answeredCount;
    const flaggedCount = Object.keys(this.userFlags).filter(k => this.userFlags[k]).length;

    // Update elemen DOM
    const elAnswered = document.getElementById('stat-answered-count');
    const elUnanswered = document.getElementById('stat-unanswered-count');
    const elFlagged = document.getElementById('stat-flagged-count');
    const elTotal = document.getElementById('stat-total-count');
    const elOverallProgress = document.getElementById('stat-overall-progress');

    if (elAnswered) elAnswered.textContent = answeredCount;
    if (elUnanswered) elUnanswered.textContent = unansweredCount;
    if (elFlagged) elFlagged.textContent = flaggedCount;
    if (elTotal) elTotal.textContent = totalCount;

    if (elOverallProgress) {
      const pct = Math.round((answeredCount / totalCount) * 100);
      elOverallProgress.style.width = `${pct}%`;
    }

    // Tab badges
    const badgeAll = document.getElementById('badge-filter-all');
    const badgeAnswered = document.getElementById('badge-filter-answered');
    const badgeUnanswered = document.getElementById('badge-filter-unanswered');
    const badgeFlagged = document.getElementById('badge-filter-flagged');

    if (badgeAll) badgeAll.textContent = totalCount;
    if (badgeAnswered) badgeAnswered.textContent = answeredCount;
    if (badgeUnanswered) badgeUnanswered.textContent = unansweredCount;
    if (badgeFlagged) badgeFlagged.textContent = flaggedCount;
  },

  // ===================== SELESAI UJIAN & KONFIRMASI =====================
  confirmFinishExam() {
    if (this.isReviewMode) {
      alert('Anda saat ini sedang berada dalam mode Pembahasan Soal.');
      return;
    }

    const totalCount = this.questions.length;
    const answeredCount = Object.keys(this.userAnswers).filter(k => this.userAnswers[k] !== null).length;
    const unansweredCount = totalCount - answeredCount;
    const flaggedCount = Object.keys(this.userFlags).filter(k => this.userFlags[k]).length;

    // Isi konten modal konfirmasi
    const modalEl = document.getElementById('confirm-finish-modal');
    const modalAnswered = document.getElementById('confirm-modal-answered');
    const modalUnanswered = document.getElementById('confirm-modal-unanswered');
    const modalFlagged = document.getElementById('confirm-modal-flagged');
    const modalWarning = document.getElementById('confirm-modal-warning');

    if (modalAnswered) modalAnswered.textContent = answeredCount;
    if (modalUnanswered) modalUnanswered.textContent = unansweredCount;
    if (modalFlagged) modalFlagged.textContent = flaggedCount;

    if (modalWarning) {
      if (unansweredCount > 0) {
        modalWarning.innerHTML = `
          <div class="alert-box alert-warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
            <span>Perhatian! Masih ada <strong>${unansweredCount} soal</strong> yang belum Anda jawab. Yakin ingin mengakhiri ujian sekarang?</span>
          </div>
        `;
      } else if (flaggedCount > 0) {
        modalWarning.innerHTML = `
          <div class="alert-box alert-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <span>Semua soal sudah terjawab, namun masih ada <strong>${flaggedCount} soal</strong> bertanda ragu-ragu.</span>
          </div>
        `;
      } else {
        modalWarning.innerHTML = `
          <div class="alert-box alert-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/></svg>
            <span>Luar biasa! Seluruh <strong>110 soal</strong> telah Anda jawab dengan lengkap.</span>
          </div>
        `;
      }
    }

    if (modalEl) modalEl.classList.add('is-open');
  },

  closeConfirmModal() {
    const modalEl = document.getElementById('confirm-finish-modal');
    if (modalEl) modalEl.classList.remove('is-open');
  },

  // ===================== KALKULASI SKOR RESMI SKD =====================
  calculateAndShowResult() {
    this.closeConfirmModal();
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Hitung Nilai berdasarkan ketentuan:
    // Soal 1-65: Benar = 5 poin, Salah = 0 poin
    // Soal 66-110: Skor bernilai 5, 4, 3, 2, atau 1 tergantung opsi yang dipilih
    let scoreTWK = 0;
    let scoreTIU = 0;
    let scoreTKP = 0;

    let correctTWK = 0;
    let correctTIU = 0;
    let answeredTWK = 0;
    let answeredTIU = 0;
    let answeredTKP = 0;

    this.questions.forEach(q => {
      const userAns = this.userAnswers[q.id];
      const isAnswered = userAns !== undefined && userAns !== null;

      if (q.id <= 30 || q.category === 'TWK') {
        if (isAnswered) {
          answeredTWK++;
          if (userAns === q.correctAnswer) {
            scoreTWK += 5;
            correctTWK++;
          }
        }
      } else if (q.id <= 65 || q.category === 'TIU') {
        if (isAnswered) {
          answeredTIU++;
          if (userAns === q.correctAnswer) {
            scoreTIU += 5;
            correctTIU++;
          }
        }
      } else {
        // TKP (Soal 66-110): Poin 1 sampai 5
        if (isAnswered) {
          answeredTKP++;
          const pts = (q.points && q.points[userAns] !== undefined) ? q.points[userAns] : 0;
          scoreTKP += pts;
        }
      }
    });

    const totalScore = scoreTWK + scoreTIU + scoreTKP;

    // Evaluasi Passing Grade PermenPAN-RB
    const passedTWK = scoreTWK >= this.PASSING_GRADES.TWK;
    const passedTIU = scoreTIU >= this.PASSING_GRADES.TIU;
    const passedTKP = scoreTKP >= this.PASSING_GRADES.TKP;
    const isAllPassed = passedTWK && passedTIU && passedTKP;

    const resultData = {
      scoreTWK,
      scoreTIU,
      scoreTKP,
      totalScore,
      correctTWK,
      correctTIU,
      answeredTWK,
      answeredTIU,
      answeredTKP,
      passedTWK,
      passedTIU,
      passedTKP,
      isAllPassed,
      timestamp: new Date().toLocaleString('id-ID'),
      durationUsedSeconds: (StorageManager.getExamDuration() * 60) - Math.max(0, this.timerSeconds)
    };

    StorageManager.saveLastResult(resultData);
    StorageManager.saveExamStatus('completed');

    // Tampilkan Hasil ke Modal
    this.displayResultModal(resultData);

    // Bunyikan Fanfare jika lolos
    if (isAllPassed) {
      SoundEngine.playFanfare();
    }
  },

  displayResultModal(res) {
    const modalEl = document.getElementById('result-modal');
    if (!modalEl) return;

    // Banner kelulusan
    const bannerEl = document.getElementById('result-status-banner');
    if (bannerEl) {
      if (res.isAllPassed) {
        bannerEl.className = 'result-banner banner-passed';
        bannerEl.innerHTML = `
          <div class="banner-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/></svg>
          </div>
          <div class="banner-text">
            <h3>SELAMAT! ANDA LOLOS PASSING GRADE</h3>
            <p>Nilai Anda berhasil melampaui seluruh ambang batas SKD CAT CPNS resmi.</p>
          </div>
        `;
      } else {
        bannerEl.className = 'result-banner banner-failed';
        bannerEl.innerHTML = `
          <div class="banner-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <div class="banner-text">
            <h3>BELUM MEMENUHI PASSING GRADE</h3>
            <p>Teruslah berlatih! Jangan patah semangat dan periksa kembali pembahasan soal.</p>
          </div>
        `;
      }
    }

    // Skor Total
    const totalEl = document.getElementById('result-total-score');
    if (totalEl) totalEl.textContent = res.totalScore;

    // Breakdown TWK
    const twkScoreEl = document.getElementById('res-twk-score');
    const twkStatusEl = document.getElementById('res-twk-status');
    const twkDetailEl = document.getElementById('res-twk-detail');
    if (twkScoreEl) twkScoreEl.textContent = `${res.scoreTWK} / 150`;
    if (twkStatusEl) {
      twkStatusEl.textContent = res.passedTWK ? 'Lolos PG (≥65)' : 'Tidak Lolos (<65)';
      twkStatusEl.className = `status-pill ${res.passedTWK ? 'pill-success' : 'pill-danger'}`;
    }
    if (twkDetailEl) twkDetailEl.textContent = `Benar: ${res.correctTWK} dari 30 soal`;

    // Breakdown TIU
    const tiuScoreEl = document.getElementById('res-tiu-score');
    const tiuStatusEl = document.getElementById('res-tiu-status');
    const tiuDetailEl = document.getElementById('res-tiu-detail');
    if (tiuScoreEl) tiuScoreEl.textContent = `${res.scoreTIU} / 175`;
    if (tiuStatusEl) {
      tiuStatusEl.textContent = res.passedTIU ? 'Lolos PG (≥80)' : 'Tidak Lolos (<80)';
      tiuStatusEl.className = `status-pill ${res.passedTIU ? 'pill-success' : 'pill-danger'}`;
    }
    if (tiuDetailEl) tiuDetailEl.textContent = `Benar: ${res.correctTIU} dari 35 soal`;

    // Breakdown TKP
    const tkpScoreEl = document.getElementById('res-tkp-score');
    const tkpStatusEl = document.getElementById('res-tkp-status');
    const tkpDetailEl = document.getElementById('res-tkp-detail');
    if (tkpScoreEl) tkpScoreEl.textContent = `${res.scoreTKP} / 225`;
    if (tkpStatusEl) {
      tkpStatusEl.textContent = res.passedTKP ? 'Lolos PG (≥166)' : 'Tidak Lolos (<166)';
      tkpStatusEl.className = `status-pill ${res.passedTKP ? 'pill-success' : 'pill-danger'}`;
    }
    if (tkpDetailEl) tkpDetailEl.textContent = `Terjawab: ${res.answeredTKP} dari 45 soal`;

    modalEl.classList.add('is-open');
  },

  closeResultModal() {
    const modalEl = document.getElementById('result-modal');
    if (modalEl) modalEl.classList.remove('is-open');
  },

  // ===================== MODE REVIEW & PEMBAHASAN =====================
  startReviewMode() {
    this.closeResultModal();
    this.isReviewMode = true;

    // Ubah header status bar menjadi Mode Pembahasan
    const badgeReview = document.getElementById('header-mode-badge');
    if (badgeReview) {
      badgeReview.style.display = 'inline-flex';
      badgeReview.textContent = 'MODE PEMBAHASAN & REVIEW';
    }

    // Render ulang palette dengan penanda benar / salah
    this.renderQuestionPalette();

    // Render kembali soal saat ini lengkap dengan kotak pembahasan
    this.renderCurrentQuestion();

    // Nonaktifkan tombol Selesai Ujian, gantikan dengan tombol 'Kembali ke Skor'
    const finishBtn = document.getElementById('btn-finish-exam');
    if (finishBtn) {
      finishBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
        <span>Lihat Kartu Skor</span>
      `;
      finishBtn.onclick = () => {
        const lastRes = StorageManager.getLastResult();
        if (lastRes) this.displayResultModal(lastRes);
      };
    }
  },

  restartNewExam() {
    if (confirm('Apakah Anda yakin ingin memulai ujian baru? Jawaban dan skor sesi ini akan direset.')) {
      StorageManager.resetExamSession();
      window.location.reload();
    }
  },

  // ===================== PENGATURAN TAMPILAN =====================
  changeFontSize(step) {
    this.fontSizeLevel = Math.max(-1, Math.min(2, this.fontSizeLevel + step));
    const body = document.getElementById('question-body-text');
    const options = document.getElementById('options-container');

    const sizes = ['font-sm', 'font-normal', 'font-lg', 'font-xl'];
    const currentClass = sizes[this.fontSizeLevel + 1];

    if (body) {
      body.className = `question-body ${currentClass}`;
    }
    if (options) {
      options.className = `options-list ${currentClass}`;
    }
  }
};
