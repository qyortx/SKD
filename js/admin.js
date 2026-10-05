/**
 * Admin Panel Engine
 * Mengelola pengelolaan bank soal oleh Admin:
 * - Menambah soal baru
 * - Mengedit teks soal, judul soal, opsi pilihan A-E
 * - Mengatur kunci jawaban:
 *    * Soal 1-65 (TWK & TIU): Pilihan kunci jawaban benar bernilai 5 poin
 *    * Soal 66-110 (TKP): Pilihan bertingkat dengan input nilai 1 sampai 5 untuk setiap opsi A-E
 * - Menghapus soal
 * - Mengatur durasi ujian
 * - Impor & Ekspor bank soal (format JSON)
 * - Reset kembali ke bank soal default (110 soal lengkap)
 */

const AdminPanel = {
  currentEditId: null,
  searchQuery: '',
  categoryFilter: 'all',

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Tombol buka admin
    const btnOpen = document.getElementById('btn-open-admin');
    if (btnOpen) {
      btnOpen.onclick = () => this.openAdminModal();
    }

    // Tombol tutup admin
    const btnClose = document.getElementById('btn-close-admin');
    if (btnClose) {
      btnClose.onclick = () => this.closeAdminModal();
    }

    // Filter kategori di tabel admin
    const selFilter = document.getElementById('admin-filter-category');
    if (selFilter) {
      selFilter.onchange = (e) => {
        this.categoryFilter = e.target.value;
        this.renderQuestionsList();
      };
    }

    // Input pencarian soal
    const inpSearch = document.getElementById('admin-search-input');
    if (inpSearch) {
      inpSearch.oninput = (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderQuestionsList();
      };
    }

    // Radio switcher tipe penilaian di form edit
    const scoringTypeRadios = document.querySelectorAll('input[name="form-scoring-type"]');
    scoringTypeRadios.forEach(radio => {
      radio.onchange = (e) => {
        this.toggleScoringFormFields(e.target.value);
      };
    });

    // Otomatis ubah mode scoring saat kategori dipilih di form
    const selCategory = document.getElementById('form-question-category');
    if (selCategory) {
      selCategory.onchange = (e) => {
        const cat = e.target.value;
        const radioSingle = document.getElementById('scoring-type-single');
        const radioScale = document.getElementById('scoring-type-scale');

        if (cat === 'TKP') {
          if (radioScale) radioScale.checked = true;
          this.toggleScoringFormFields('scale');
        } else {
          if (radioSingle) radioSingle.checked = true;
          this.toggleScoringFormFields('single');
        }
      };
    }
  },

  openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;

    this.renderStats();
    this.renderQuestionsList();
    this.loadDurationSetting();
    modal.classList.add('is-open');
  },

  closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.classList.remove('is-open');
    this.closeQuestionForm();
  },

  loadDurationSetting() {
    const durInput = document.getElementById('admin-duration-input');
    if (durInput) {
      durInput.value = StorageManager.getExamDuration();
    }
  },

  saveDurationSetting() {
    const durInput = document.getElementById('admin-duration-input');
    if (!durInput) return;

    const mins = parseInt(durInput.value, 10);
    if (isNaN(mins) || mins <= 0 || mins > 300) {
      alert('Harap masukkan durasi waktu antara 1 hingga 300 menit.');
      return;
    }

    StorageManager.saveExamDuration(mins);
    alert(`Durasi ujian berhasil disimpan: ${mins} menit.`);
    ExamEngine.updateTimerDisplay();
  },

  renderStats() {
    const questions = StorageManager.getQuestions();
    const countTotal = questions.length;
    const countTWK = questions.filter(q => q.category === 'TWK' || q.id <= 30).length;
    const countTIU = questions.filter(q => q.category === 'TIU' || (q.id >= 31 && q.id <= 65)).length;
    const countTKP = questions.filter(q => q.category === 'TKP' || q.id >= 66).length;

    const elTotal = document.getElementById('admin-stat-total');
    const elTWK = document.getElementById('admin-stat-twk');
    const elTIU = document.getElementById('admin-stat-tiu');
    const elTKP = document.getElementById('admin-stat-tkp');

    if (elTotal) elTotal.textContent = countTotal;
    if (elTWK) elTWK.textContent = countTWK;
    if (elTIU) elTIU.textContent = countTIU;
    if (elTKP) elTKP.textContent = countTKP;
  },

  renderQuestionsList() {
    const tableBody = document.getElementById('admin-questions-tbody');
    if (!tableBody) return;

    const questions = StorageManager.getQuestions();

    let filtered = questions.filter(q => {
      const matchCat = (this.categoryFilter === 'all') ||
        (this.categoryFilter === 'TWK' && (q.category === 'TWK' || q.id <= 30)) ||
        (this.categoryFilter === 'TIU' && (q.category === 'TIU' || (q.id >= 31 && q.id <= 65))) ||
        (this.categoryFilter === 'TKP' && (q.category === 'TKP' || q.id >= 66));

      const matchSearch = !this.searchQuery ||
        (q.title && q.title.toLowerCase().includes(this.searchQuery)) ||
        (q.question && q.question.toLowerCase().includes(this.searchQuery)) ||
        (q.topic && q.topic.toLowerCase().includes(this.searchQuery)) ||
        (q.id.toString() === this.searchQuery);

      return matchCat && matchSearch;
    });

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            Tidak ada soal yang sesuai dengan pencarian atau filter.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(q => {
      const tr = document.createElement('tr');

      // Teks kunci atau ringkasan poin
      let scoringInfo = '';
      if (q.id <= 65 || q.scoringType === 'single') {
        scoringInfo = `<span class="badge-pill bg-success-soft">Kunci: <strong>${q.correctAnswer || 'A'}</strong> (+5)</span>`;
      } else {
        const pts = q.points || {};
        scoringInfo = `<span class="badge-pill bg-warning-soft">Skala Poin: A:${pts.A || 0}, B:${pts.B || 0}, C:${pts.C || 0}, D:${pts.D || 0}, E:${pts.E || 0}</span>`;
      }

      tr.innerHTML = `
        <td class="text-center fw-bold">#${q.id}</td>
        <td>
          <span class="category-badge-sm badge-${(q.category || 'twk').toLowerCase()}">${q.category || 'TWK'}</span>
        </td>
        <td>
          <div class="fw-semibold text-truncate-1">${q.title || 'Tanpa Judul'}</div>
          <small class="text-muted text-truncate-1">${q.topic || ''}</small>
        </td>
        <td>
          <div class="text-truncate-2 question-preview-cell">${q.question}</div>
        </td>
        <td>${scoringInfo}</td>
        <td class="text-center">
          <div class="btn-group-sm">
            <button class="btn btn-sm btn-icon btn-outline-primary" title="Edit Soal" onclick="AdminPanel.editQuestion(${q.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn btn-sm btn-icon btn-outline-danger" title="Hapus Soal" onclick="AdminPanel.deleteQuestion(${q.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  },

  // ===================== FORM TAMBAH & EDIT SOAL =====================
  openAddQuestionForm() {
    this.currentEditId = null;
    const formModal = document.getElementById('admin-form-modal');
    const formTitle = document.getElementById('form-modal-title');
    const form = document.getElementById('question-editor-form');

    if (formTitle) formTitle.textContent = 'Tambah Soal Baru';
    if (form) form.reset();

    const questions = StorageManager.getQuestions();
    const nextId = questions.length + 1;
    const idInput = document.getElementById('form-question-id');
    if (idInput) idInput.value = nextId;

    // Default mode scoring berdasarkan nextId
    if (nextId >= 66) {
      document.getElementById('form-question-category').value = 'TKP';
      document.getElementById('scoring-type-scale').checked = true;
      this.toggleScoringFormFields('scale');
    } else {
      document.getElementById('form-question-category').value = nextId <= 30 ? 'TWK' : 'TIU';
      document.getElementById('scoring-type-single').checked = true;
      this.toggleScoringFormFields('single');
    }

    // Reset field gambar
    const imgDataInput = document.getElementById('form-question-image-data');
    if (imgDataInput) imgDataInput.value = '';
    const imgCaptionInput = document.getElementById('form-question-image-caption');
    if (imgCaptionInput) imgCaptionInput.value = '';
    const imgPreviewContainer = document.getElementById('admin-image-preview-container');
    if (imgPreviewContainer) imgPreviewContainer.style.display = 'none';

    if (formModal) formModal.classList.add('is-open');
  },

  editQuestion(id) {
    const questions = StorageManager.getQuestions();
    const q = questions.find(item => item.id === id);
    if (!q) return;

    this.currentEditId = id;
    const formModal = document.getElementById('admin-form-modal');
    const formTitle = document.getElementById('form-modal-title');

    if (formTitle) formTitle.textContent = `Edit Soal #${q.id}: ${q.title || ''}`;

    // Isi field form
    document.getElementById('form-question-id').value = q.id;
    document.getElementById('form-question-title').value = q.title || '';
    document.getElementById('form-question-category').value = q.category || (q.id <= 30 ? 'TWK' : q.id <= 65 ? 'TIU' : 'TKP');
    document.getElementById('form-question-topic').value = q.topic || '';
    document.getElementById('form-question-body').value = q.question || '';

    // Isi Gambar & Caption
    const imgDataInput = document.getElementById('form-question-image-data');
    if (imgDataInput) imgDataInput.value = q.image || '';
    const imgCaptionInput = document.getElementById('form-question-image-caption');
    if (imgCaptionInput) imgCaptionInput.value = q.imageCaption || '';
    const imgPreviewContainer = document.getElementById('admin-image-preview-container');
    const imgPreviewElem = document.getElementById('admin-image-preview-elem');
    if (imgPreviewContainer && imgPreviewElem) {
      if (q.image) {
        imgPreviewElem.src = q.image;
        imgPreviewContainer.style.display = 'flex';
      } else {
        imgPreviewContainer.style.display = 'none';
      }
    }

    // Opsi A-E
    document.getElementById('form-opt-a').value = (q.options && q.options.A) || '';
    document.getElementById('form-opt-b').value = (q.options && q.options.B) || '';
    document.getElementById('form-opt-c').value = (q.options && q.options.C) || '';
    document.getElementById('form-opt-d').value = (q.options && q.options.D) || '';
    document.getElementById('form-opt-e').value = (q.options && q.options.E) || '';

    // Mode Scoring
    const isScale = (q.scoringType === 'scale' || q.id >= 66);
    if (isScale) {
      document.getElementById('scoring-type-scale').checked = true;
      this.toggleScoringFormFields('scale');

      const pts = q.points || { A: 1, B: 2, C: 3, D: 4, E: 5 };
      document.getElementById('form-pts-a').value = pts.A || 1;
      document.getElementById('form-pts-b').value = pts.B || 1;
      document.getElementById('form-pts-c').value = pts.C || 1;
      document.getElementById('form-pts-d').value = pts.D || 1;
      document.getElementById('form-pts-e').value = pts.E || 1;
    } else {
      document.getElementById('scoring-type-single').checked = true;
      this.toggleScoringFormFields('single');
      const correctRadio = document.querySelector(`input[name="form-correct-key"][value="${q.correctAnswer || 'A'}"]`);
      if (correctRadio) correctRadio.checked = true;
    }

    document.getElementById('form-question-explanation').value = q.explanation || '';

    if (formModal) formModal.classList.add('is-open');
  },

  toggleScoringFormFields(type) {
    const singleSection = document.getElementById('scoring-single-section');
    const scaleSection = document.getElementById('scoring-scale-section');

    if (type === 'scale') {
      if (singleSection) singleSection.style.display = 'none';
      if (scaleSection) scaleSection.style.display = 'block';
    } else {
      if (singleSection) singleSection.style.display = 'block';
      if (scaleSection) scaleSection.style.display = 'none';
    }
  },

  closeQuestionForm() {
    const formModal = document.getElementById('admin-form-modal');
    if (formModal) formModal.classList.remove('is-open');
    this.currentEditId = null;
  },

  saveQuestionFromForm(e) {
    if (e) e.preventDefault();

    const id = parseInt(document.getElementById('form-question-id').value, 10);
    const title = document.getElementById('form-question-title').value.trim();
    const category = document.getElementById('form-question-category').value;
    const topic = document.getElementById('form-question-topic').value.trim();
    const questionText = document.getElementById('form-question-body').value.trim();

    const optA = document.getElementById('form-opt-a').value.trim();
    const optB = document.getElementById('form-opt-b').value.trim();
    const optC = document.getElementById('form-opt-c').value.trim();
    const optD = document.getElementById('form-opt-d').value.trim();
    const optE = document.getElementById('form-opt-e').value.trim();

    if (!title || !questionText || !optA || !optB || !optC || !optD || !optE) {
      alert('Mohon lengkapi judul soal, teks pertanyaan, dan seluruh pilihan A hingga E.');
      return;
    }

    const scoringType = document.querySelector('input[name="form-scoring-type"]:checked').value;
    let correctAnswer = 'A';
    let points = { A: 0, B: 0, C: 0, D: 0, E: 0 };

    if (scoringType === 'single') {
      const selectedKey = document.querySelector('input[name="form-correct-key"]:checked');
      correctAnswer = selectedKey ? selectedKey.value : 'A';
      points[correctAnswer] = 5;
    } else {
      // Skala 1-5
      const parsePt = (val) => Math.max(1, Math.min(5, parseInt(val, 10) || 1));
      points.A = parsePt(document.getElementById('form-pts-a').value);
      points.B = parsePt(document.getElementById('form-pts-b').value);
      points.C = parsePt(document.getElementById('form-pts-c').value);
      points.D = parsePt(document.getElementById('form-pts-d').value);
      points.E = parsePt(document.getElementById('form-pts-e').value);
    }

    const explanation = document.getElementById('form-question-explanation').value.trim();
    const image = document.getElementById('form-question-image-data')?.value || '';
    const imageCaption = document.getElementById('form-question-image-caption')?.value.trim() || '';

    const optionImages = {
      A: document.getElementById('form-opt-img-a')?.value || (this.currentEditOptionImages?.A || ''),
      B: document.getElementById('form-opt-img-b')?.value || (this.currentEditOptionImages?.B || ''),
      C: document.getElementById('form-opt-img-c')?.value || (this.currentEditOptionImages?.C || ''),
      D: document.getElementById('form-opt-img-d')?.value || (this.currentEditOptionImages?.D || ''),
      E: document.getElementById('form-opt-img-e')?.value || (this.currentEditOptionImages?.E || '')
    };

    const questionObj = {
      id,
      category,
      categoryName: category === 'TWK' ? 'Tes Wawasan Kebangsaan' : category === 'TIU' ? 'Tes Inteligensia Umum' : 'Tes Karakteristik Pribadi',
      topic: topic || 'Kompetensi Dasar',
      title,
      question: questionText,
      image,
      imageCaption,
      optionImages,
      options: { A: optA, B: optB, C: optC, D: optD, E: optE },
      scoringType,
      correctAnswer,
      points,
      explanation
    };

    const isNew = this.currentEditId === null;
    StorageManager.saveQuestionItem(questionObj, isNew);

    this.closeQuestionForm();
    this.renderStats();
    this.renderQuestionsList();

    // Segarkan engine ujian di tampilan utama
    ExamEngine.questions = StorageManager.getQuestions();
    ExamEngine.renderQuestionPalette();
    ExamEngine.renderCurrentQuestion();
    ExamEngine.updateStatsBar();

    alert(isNew ? 'Soal baru berhasil ditambahkan!' : 'Perubahan soal berhasil disimpan!');
  },

  handleImageUpload(e, target = 'question') {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (target === 'question') {
        const dataInput = document.getElementById('form-question-image-data');
        if (dataInput) dataInput.value = dataUrl;

        const imgPrev = document.getElementById('admin-image-preview-container');
        const imgElem = document.getElementById('admin-image-preview-elem');
        if (imgPrev && imgElem) {
          imgElem.src = dataUrl;
          imgPrev.style.display = 'flex';
        }
      } else if (target.startsWith('opt')) {
        const opt = target.replace('opt', '').toLowerCase();
        const dataInput = document.getElementById(`form-opt-img-${opt}`);
        if (dataInput) dataInput.value = dataUrl;
        if (!this.currentEditOptionImages) this.currentEditOptionImages = {};
        this.currentEditOptionImages[opt.toUpperCase()] = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  },

  removeQuestionImage(target = 'question') {
    if (target === 'question') {
      const dataInput = document.getElementById('form-question-image-data');
      if (dataInput) dataInput.value = '';
      const imgCap = document.getElementById('form-question-image-caption');
      if (imgCap) imgCap.value = '';
      const fileInput = document.getElementById('form-question-image-file');
      if (fileInput) fileInput.value = '';
      const imgPrev = document.getElementById('admin-image-preview-container');
      if (imgPrev) imgPrev.style.display = 'none';
    } else if (target.startsWith('opt')) {
      const opt = target.replace('opt', '').toLowerCase();
      const dataInput = document.getElementById(`form-opt-img-${opt}`);
      if (dataInput) dataInput.value = '';
      if (this.currentEditOptionImages) delete this.currentEditOptionImages[opt.toUpperCase()];
    }
  },

  async copyImageToClipboard(src) {
    if (!src) return;
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      alert('Gambar berhasil disalin ke clipboard!');
    } catch (e) {
      try {
        await navigator.clipboard.writeText(src);
        alert('Tautan/Data gambar disalin!');
      } catch (err) {
        alert('Gagal menyalin gambar.');
      }
    }
  },

  insertMathEquation(snippet, isBlock = false) {
    const target = this.lastFocusedInput || document.getElementById('form-question-body');
    if (!target) return;

    let wrapped = isBlock ? `$$\n${snippet}\n$$` : `$${snippet}$`;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const val = target.value;
    target.value = val.substring(0, start) + wrapped + val.substring(end);
    target.focus();
    const newPos = start + wrapped.length;
    target.setSelectionRange(newPos, newPos);
  },

  deleteQuestion(id) {
    if (confirm(`Apakah Anda yakin ingin menghapus Soal #${id}? Nomor urut soal berikutnya akan disesuaikan otomatis.`)) {
      StorageManager.deleteQuestionItem(id);
      this.renderStats();
      this.renderQuestionsList();

      ExamEngine.questions = StorageManager.getQuestions();
      ExamEngine.renderQuestionPalette();
      if (ExamEngine.currentIndex >= ExamEngine.questions.length) {
        ExamEngine.currentIndex = Math.max(0, ExamEngine.questions.length - 1);
      }
      ExamEngine.renderCurrentQuestion();
      ExamEngine.updateStatsBar();
    }
  },

  resetToDefault() {
    if (confirm('PERINGATAN: Semua perubahan pada bank soal akan dikembalikan ke data awal (110 Soal Default Lengkap). Lanjutkan?')) {
      StorageManager.resetQuestionsToDefault();
      this.renderStats();
      this.renderQuestionsList();

      ExamEngine.questions = StorageManager.getQuestions();
      ExamEngine.renderQuestionPalette();
      ExamEngine.renderCurrentQuestion();
      ExamEngine.updateStatsBar();

      alert('Bank soal berhasil direset ke 110 soal standar SKD!');
    }
  },

  exportJSON() {
    StorageManager.exportQuestionsJSON();
  },

  triggerImportJSON() {
    const fileInput = document.getElementById('admin-file-import');
    if (fileInput) fileInput.click();
  },

  handleImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    StorageManager.importQuestionsJSON(file, (result) => {
      if (result.success) {
        alert(`Berhasil mengimpor ${result.count} soal dari file JSON!`);
        this.renderStats();
        this.renderQuestionsList();

        ExamEngine.questions = StorageManager.getQuestions();
        ExamEngine.renderQuestionPalette();
        ExamEngine.renderCurrentQuestion();
        ExamEngine.updateStatsBar();
      } else {
        alert('Gagal mengimpor file: ' + result.message);
      }
      event.target.value = ''; // Reset input
    });
  }
};
