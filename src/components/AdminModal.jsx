import React, { useState, useRef, useEffect } from 'react';
import { Storage } from '../utils/storage.js';
import { MathText } from '../utils/mathRenderer.jsx';
import { processAndCompressImage } from '../utils/imageOptimizer.js';

export default function AdminModal({
  isOpen,
  onClose,
  questions,
  onUpdateQuestions,
  examDuration,
  onUpdateDuration
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [durationInput, setDurationInput] = useState(examDuration);

  // Form Editor State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState('editor'); // 'editor' | 'preview'

  // Target selectors for Math and Image
  const [mathTarget, setMathTarget] = useState('question'); // 'question' | 'title' | 'optA' | 'optB' | 'optC' | 'optD' | 'optE' | 'explanation'
  const [mathMode, setMathMode] = useState('inline'); // 'inline' ($...$) or 'block' ($$...$$)
  const [imageTarget, setImageTarget] = useState('question'); // 'question' | 'optA' | 'optB' | 'optC' | 'optD' | 'optE'

  // Image Upload state
  const [imageSizeInfo, setImageSizeInfo] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imageInputMode, setImageInputMode] = useState('file'); // 'file' | 'url'
  const [urlInputVal, setUrlInputVal] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [previewZoomImg, setPreviewZoomImg] = useState(null);

  const [formData, setFormData] = useState({
    id: 1,
    title: '',
    category: 'TWK',
    topic: '',
    question: '',
    image: '',
    imageCaption: '',
    optionImages: { A: '', B: '', C: '', D: '', E: '' },
    options: { A: '', B: '', C: '', D: '', E: '' },
    scoringType: 'single',
    correctAnswer: 'A',
    points: { A: 1, B: 2, C: 3, D: 4, E: 5 },
    explanation: ''
  });

  // Refs for inserting math at cursor
  const fieldRefs = {
    title: useRef(null),
    question: useRef(null),
    optA: useRef(null),
    optB: useRef(null),
    optC: useRef(null),
    optD: useRef(null),
    optE: useRef(null),
    explanation: useRef(null)
  };

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  if (!isOpen) return null;

  const countTotal = questions.length;
  const countTWK = questions.filter(q => q.category === 'TWK' || q.id <= 30).length;
  const countTIU = questions.filter(q => q.category === 'TIU' || (q.id >= 31 && q.id <= 65)).length;
  const countTKP = questions.filter(q => q.category === 'TKP' || q.id >= 66).length;
  const countWithImage = questions.filter(q => Boolean(q.image || (q.optionImages && Object.values(q.optionImages).some(Boolean)))).length;

  const filteredQuestions = questions.filter(q => {
    const hasAnyImg = Boolean(q.image || (q.optionImages && Object.values(q.optionImages).some(Boolean)));
    const matchCat = (categoryFilter === 'all') ||
      (categoryFilter === 'TWK' && (q.category === 'TWK' || q.id <= 30)) ||
      (categoryFilter === 'TIU' && (q.category === 'TIU' || (q.id >= 31 && q.id <= 65))) ||
      (categoryFilter === 'TKP' && (q.category === 'TKP' || q.id >= 66)) ||
      (categoryFilter === 'IMG' && hasAnyImg);

    const qSearch = searchQuery.toLowerCase();
    const matchSearch = !searchQuery ||
      (q.title && q.title.toLowerCase().includes(qSearch)) ||
      (q.question && q.question.toLowerCase().includes(qSearch)) ||
      (q.topic && q.topic.toLowerCase().includes(qSearch)) ||
      (q.id.toString() === searchQuery);

    return matchCat && matchSearch;
  });

  // Handle Duration Save
  const handleSaveDuration = () => {
    const mins = parseInt(durationInput, 10);
    if (isNaN(mins) || mins <= 0 || mins > 300) {
      alert('Harap masukkan durasi waktu antara 1 hingga 300 menit.');
      return;
    }
    onUpdateDuration(mins);
    alert(`Durasi ujian berhasil disimpan: ${mins} menit.`);
  };

  // Helper label target
  const getTargetLabel = (tgt) => {
    switch (tgt) {
      case 'question': return 'Soal Utama';
      case 'optA': return 'Pilihan Opsi A';
      case 'optB': return 'Pilihan Opsi B';
      case 'optC': return 'Pilihan Opsi C';
      case 'optD': return 'Pilihan Opsi D';
      case 'optE': return 'Pilihan Opsi E';
      default: return 'Soal';
    }
  };

  // Helper get active image for target
  const getActiveImageForTarget = (tgt) => {
    if (tgt === 'question') {
      return { src: formData.image || '', caption: formData.imageCaption || '' };
    }
    if (tgt.startsWith('opt')) {
      const opt = tgt.replace('opt', '');
      return { src: (formData.optionImages && formData.optionImages[opt]) || '', caption: `Pilihan Opsi ${opt}` };
    }
    return { src: '', caption: '' };
  };

  // Open Form to Add
  const handleOpenAddForm = () => {
    const nextId = questions.length + 1;
    const isTkp = nextId >= 66;

    setEditingId(null);
    setImageSizeInfo('');
    setUrlInputVal('');
    setActiveFormTab('editor');
    setImageTarget('question');
    setMathTarget('question');
    setFormData({
      id: nextId,
      title: '',
      category: isTkp ? 'TKP' : nextId <= 30 ? 'TWK' : 'TIU',
      topic: '',
      question: '',
      image: '',
      imageCaption: '',
      optionImages: { A: '', B: '', C: '', D: '', E: '' },
      options: { A: '', B: '', C: '', D: '', E: '' },
      scoringType: isTkp ? 'scale' : 'single',
      correctAnswer: 'A',
      points: { A: 1, B: 2, C: 3, D: 4, E: 5 },
      explanation: ''
    });
    setIsFormOpen(true);
  };

  // Open Form to Edit
  const handleOpenEditForm = (q) => {
    setEditingId(q.id);
    setImageSizeInfo('');
    setUrlInputVal(q.image && !q.image.startsWith('data:') ? q.image : '');
    setActiveFormTab('editor');
    setImageTarget('question');
    setMathTarget('question');

    const isScale = q.scoringType === 'scale' || q.id >= 66;

    setFormData({
      id: q.id,
      title: q.title || '',
      category: q.category || (q.id <= 30 ? 'TWK' : q.id <= 65 ? 'TIU' : 'TKP'),
      topic: q.topic || '',
      question: q.question || '',
      image: q.image || '',
      imageCaption: q.imageCaption || '',
      optionImages: {
        A: (q.optionImages && q.optionImages.A) || '',
        B: (q.optionImages && q.optionImages.B) || '',
        C: (q.optionImages && q.optionImages.C) || '',
        D: (q.optionImages && q.optionImages.D) || '',
        E: (q.optionImages && q.optionImages.E) || ''
      },
      options: {
        A: (q.options && q.options.A) || '',
        B: (q.options && q.options.B) || '',
        C: (q.options && q.options.C) || '',
        D: (q.options && q.options.D) || '',
        E: (q.options && q.options.E) || ''
      },
      scoringType: isScale ? 'scale' : 'single',
      correctAnswer: q.correctAnswer || 'A',
      points: q.points || { A: 1, B: 2, C: 3, D: 4, E: 5 },
      explanation: q.explanation || ''
    });
    setIsFormOpen(true);
  };

  // Delete Question
  const handleDeleteQuestion = (id) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Soal #${id}? Nomor soal berikutnya akan disesuaikan otomatis.`)) {
      let updated = questions.filter(q => q.id !== id);
      updated = updated.map((q, idx) => ({ ...q, id: idx + 1 }));
      onUpdateQuestions(updated);
    }
  };

  // Reset to Default
  const handleResetToDefault = () => {
    if (confirm('PERINGATAN: Semua perubahan pada bank soal akan dikembalikan ke data awal (110 Soal Default Lengkap). Lanjutkan?')) {
      const def = Storage.resetQuestionsToDefault();
      onUpdateQuestions(def);
      alert('Bank soal berhasil direset ke 110 soal standar SKD!');
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    Storage.exportQuestionsJSON(questions);
  };

  // Import JSON
  const handleFileImport = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.every(q => q.id && q.question && (q.options || q.optionImages));
          if (!valid) {
            alert('Format JSON tidak valid! Setiap soal harus memiliki id, question, dan pilihan.');
            return;
          }
          onUpdateQuestions(parsed);
          alert(`Berhasil mengimpor ${parsed.length} soal dari file JSON!`);
        } else {
          alert('File JSON kosong atau bukan array soal.');
        }
      } catch (err) {
        alert('Gagal mem-parsing file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Apply image data to specific target
  const applyImageToTarget = (dataUrl, target) => {
    if (target === 'question') {
      setFormData(prev => ({ ...prev, image: dataUrl }));
    } else if (target.startsWith('opt')) {
      const optLetter = target.replace('opt', '');
      setFormData(prev => ({
        ...prev,
        optionImages: {
          ...prev.optionImages,
          [optLetter]: dataUrl
        }
      }));
    }
    setToastMessage(`Gambar berhasil dipasang ke ${getTargetLabel(target)}!`);
  };

  // Process image file
  const handleImageFile = async (file, target = imageTarget) => {
    if (!file) return;
    try {
      const res = await processAndCompressImage(file, 1000, 800, 0.85);
      applyImageToTarget(res.dataUrl, target);
      setImageSizeInfo(`${res.width}x${res.height} px (${res.sizeKb} KB)`);
    } catch (err) {
      alert(err.message || 'Gagal mengunggah gambar');
    }
  };

  // Remove image from specific target
  const handleRemoveImageFromTarget = (target = imageTarget) => {
    if (target === 'question') {
      setFormData(prev => ({ ...prev, image: '', imageCaption: '' }));
    } else if (target.startsWith('opt')) {
      const optLetter = target.replace('opt', '');
      setFormData(prev => ({
        ...prev,
        optionImages: {
          ...prev.optionImages,
          [optLetter]: ''
        }
      }));
    }
    setImageSizeInfo('');
    setUrlInputVal('');
    setToastMessage(`Gambar di ${getTargetLabel(target)} telah dihapus.`);
  };

  // Set image from URL
  const handleApplyImageUrl = (target = imageTarget) => {
    if (!urlInputVal.trim()) return;
    applyImageToTarget(urlInputVal.trim(), target);
    setImageSizeInfo('URL Gambar Online');
  };

  // Copy Image to Clipboard
  const handleCopyImageToClipboard = async (imgSrc) => {
    if (!imgSrc) return;
    try {
      const res = await fetch(imgSrc);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setToastMessage('Gambar berhasil disalin ke clipboard!');
    } catch (err) {
      try {
        await navigator.clipboard.writeText(imgSrc);
        setToastMessage('Data gambar berhasil disalin ke clipboard!');
      } catch (e) {
        alert('Gagal menyalin gambar ke clipboard: ' + err.message);
      }
    }
  };

  // Paste image from Clipboard directly
  const handlePasteImageFromClipboard = async (target = imageTarget) => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const file = new File([blob], 'clipboard-image.png', { type });
              await handleImageFile(file, target);
              return;
            }
          }
        }
        alert('Tidak ditemukan data gambar di clipboard. Silakan salin gambar terlebih dahulu (bisa menggunakan tombol PrintScreen / Snipping Tool / Copy Image).');
      } else {
        alert('Browser Anda tidak mendukung direct clipboard read. Anda dapat menekan Ctrl+V langsung pada kolom input atau kotak dropzone.');
      }
    } catch (err) {
      alert('Izin clipboard tidak diberikan atau tidak tersedia. Anda dapat langsung menekan Ctrl+V.');
    }
  };

  // Generic onPaste handler to catch images on inputs or dropzone
  const handleInputPaste = async (e, target) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          await handleImageFile(file, target);
        }
        return;
      }
    }
  };

  // Insert Math Equation into targeted field
  const handleInsertFormula = (latexCode, isFullBlock = false) => {
    let snippet = latexCode;
    if (isFullBlock || mathMode === 'block') {
      if (!snippet.startsWith('$$')) {
        snippet = `$$\n${snippet}\n$$`;
      }
    } else {
      if (!snippet.startsWith('$')) {
        snippet = `$${snippet}$`;
      }
    }

    const targetRef = fieldRefs[mathTarget]?.current;

    const insertAtText = (currentVal = '') => {
      if (!targetRef) return currentVal + ' ' + snippet;
      const start = targetRef.selectionStart ?? currentVal.length;
      const end = targetRef.selectionEnd ?? currentVal.length;
      const before = currentVal.substring(0, start);
      const after = currentVal.substring(end);
      const newPos = start + snippet.length;

      setTimeout(() => {
        if (targetRef) {
          targetRef.focus();
          targetRef.setSelectionRange(newPos, newPos);
        }
      }, 50);

      return before + snippet + after;
    };

    if (mathTarget === 'title') {
      setFormData(prev => ({ ...prev, title: insertAtText(prev.title) }));
    } else if (mathTarget === 'question') {
      setFormData(prev => ({ ...prev, question: insertAtText(prev.question) }));
    } else if (mathTarget === 'explanation') {
      setFormData(prev => ({ ...prev, explanation: insertAtText(prev.explanation) }));
    } else if (mathTarget.startsWith('opt')) {
      const optLetter = mathTarget.replace('opt', '');
      setFormData(prev => ({
        ...prev,
        options: {
          ...prev.options,
          [optLetter]: insertAtText(prev.options[optLetter] || '')
        }
      }));
    }
  };

  // Math Presets List
  const MATH_PRESETS = [
    { label: 'a/b', code: '\\frac{a}{b}', title: 'Pecahan (Fraction)' },
    { label: 'x²', code: 'x^{2}', title: 'Pangkat Dua' },
    { label: 'xⁿ', code: 'x^{n}', title: 'Pangkat n' },
    { label: 'x₁', code: 'x_{1}', title: 'Indeks / Subskrip' },
    { label: '√x', code: '\\sqrt{x}', title: 'Akar Kuadrat' },
    { label: 'ⁿ√x', code: '\\sqrt[n]{x}', title: 'Akar Pangkat n' },
    { label: '×', code: '\\times', title: 'Kali (Perkalian)' },
    { label: '÷', code: '\\div', title: 'Bagi (Pembagian)' },
    { label: '±', code: '\\pm', title: 'Plus atau Minus' },
    { label: '≤', code: '\\le', title: 'Kurang Dari atau Sama Dengan' },
    { label: '≥', code: '\\ge', title: 'Lebih Dari atau Sama Dengan' },
    { label: '≠', code: '\\neq', title: 'Tidak Sama Dengan' },
    { label: '≈', code: '\\approx', title: 'Mendekati / Kira-kira' },
    { label: 'π', code: '\\pi', title: 'Konstanta Pi' },
    { label: '%', code: '\\%', title: 'Tanda Persen' },
    { label: '°', code: '^\\circ', title: 'Derajat Suhu/Sudut' },
    { label: '∑', code: '\\sum_{i=1}^{n}', title: 'Notasi Sigma / Penjumlahan' },
    { label: '∞', code: '\\infty', title: 'Tak Terhingga' },
    { label: 'Matriks', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', title: 'Matriks 2x2' }
  ];

  // Common TIU SKD Math Templates
  const TIU_TEMPLATES = [
    { label: 'Kecepatan & Jarak', code: 'v = \\frac{s}{t}' },
    { label: 'Teorema Pythagoras', code: 'c = \\sqrt{a^2 + b^2}' },
    { label: 'Aritmetika Bertingkat', code: '\\frac{\\frac{1}{2} + \\frac{3}{4}}{\\frac{5}{6}}' },
    { label: 'Persentase Keuntungan', code: '\\% = \\frac{U}{H_b} \\times 100\\%' },
    { label: 'Akar Aritmetika', code: '\\sqrt{144} + (15\\% \\times 200)' }
  ];

  // Form Submit Save
  const handleSaveForm = (e) => {
    e.preventDefault();

    const hasOptA = (formData.options.A && formData.options.A.trim()) || (formData.optionImages && formData.optionImages.A);
    const hasOptB = (formData.options.B && formData.options.B.trim()) || (formData.optionImages && formData.optionImages.B);
    const hasOptC = (formData.options.C && formData.options.C.trim()) || (formData.optionImages && formData.optionImages.C);
    const hasOptD = (formData.options.D && formData.options.D.trim()) || (formData.optionImages && formData.optionImages.D);
    const hasOptE = (formData.options.E && formData.options.E.trim()) || (formData.optionImages && formData.optionImages.E);

    if (!formData.title.trim() || !formData.question.trim() ||
        !hasOptA || !hasOptB || !hasOptC || !hasOptD || !hasOptE) {
      alert('Mohon lengkapi judul soal, teks pertanyaan, dan seluruh pilihan A hingga E (dapat berupa teks maupun gambar).');
      return;
    }

    let finalPoints = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    if (formData.scoringType === 'single') {
      finalPoints[formData.correctAnswer] = 5;
    } else {
      finalPoints = {
        A: Math.max(1, Math.min(5, parseInt(formData.points.A, 10) || 1)),
        B: Math.max(1, Math.min(5, parseInt(formData.points.B, 10) || 1)),
        C: Math.max(1, Math.min(5, parseInt(formData.points.C, 10) || 1)),
        D: Math.max(1, Math.min(5, parseInt(formData.points.D, 10) || 1)),
        E: Math.max(1, Math.min(5, parseInt(formData.points.E, 10) || 1))
      };
    }

    const questionObj = {
      ...formData,
      points: finalPoints,
      categoryName: formData.category === 'TWK'
        ? 'Tes Wawasan Kebangsaan'
        : formData.category === 'TIU'
        ? 'Tes Inteligensia Umum'
        : 'Tes Karakteristik Pribadi'
    };

    let updatedList = [...questions];
    if (editingId === null) {
      updatedList.push(questionObj);
    } else {
      const idx = updatedList.findIndex(q => q.id === editingId);
      if (idx !== -1) updatedList[idx] = questionObj;
      else updatedList.push(questionObj);
    }

    onUpdateQuestions(updatedList);
    setIsFormOpen(false);
    alert(editingId === null ? 'Soal baru berhasil ditambahkan!' : 'Perubahan soal berhasil disimpan!');
  };

  const currentTargetImg = getActiveImageForTarget(imageTarget);

  return (
    <>
      <div className="modal-backdrop is-open" role="dialog" aria-modal="true">
        <div className="modal-card admin-modal-card">
          <div className="modal-header">
            <h3>Panel Administrasi Soal & Kunci Jawaban</h3>
            <button className="icon-btn" onClick={onClose} aria-label="Tutup">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {/* Toast Notification */}
            {toastMessage && (
              <div className="admin-toast-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Statistik Ringkas Bank Soal */}
            <div className="admin-stats-summary">
              <div className="admin-stat-card">
                <div className="admin-stat-num">{countTotal}</div>
                <div className="admin-stat-lbl">Total Soal Aktif</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-num">{countTWK}</div>
                <div className="admin-stat-lbl">Soal TWK (1 - 30)</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-num">{countTIU}</div>
                <div className="admin-stat-lbl">Soal TIU (31 - 65)</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-num">{countTKP}</div>
                <div className="admin-stat-lbl">Soal TKP (66 - 110)</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-num">{countWithImage}</div>
                <div className="admin-stat-lbl">Soal & Opsi Bergambar</div>
              </div>
            </div>

            {/* Toolbar Pencarian & Aksi */}
            <div className="admin-toolbar-row">
              <div className="admin-search-box">
                <input
                  type="text"
                  placeholder="Cari judul soal atau kata kunci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">Semua Kategori</option>
                  <option value="TWK">TWK Saja</option>
                  <option value="TIU">TIU Saja</option>
                  <option value="TKP">TKP Saja</option>
                  <option value="IMG">Dengan Gambar Saja</option>
                </select>
              </div>

              <div className="admin-action-buttons">
                <button className="btn btn-primary" onClick={handleOpenAddForm}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Tambah Soal</span>
                </button>
                <button className="btn btn-secondary" onClick={handleExportJSON} title="Unduh JSON bank soal">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  <span>Ekspor JSON</span>
                </button>
                <label className="btn btn-secondary" style={{ cursor: 'pointer' }} title="Unggah file JSON">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span>Impor JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleFileImport}
                  />
                </label>
                <button className="btn btn-secondary" onClick={handleResetToDefault} title="Kembalikan ke 110 soal standar">
                  Reset Default
                </button>
              </div>
            </div>

            {/* Pengaturan Durasi Ujian */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Atur Durasi Ujian:</span>
              <input
                type="number"
                min="10"
                max="300"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                style={{ width: '80px', padding: '0.35rem 0.5rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}
              />
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>menit</span>
              <button
                className="btn btn-sm btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                onClick={handleSaveDuration}
              >
                Simpan Durasi
              </button>
            </div>

            {/* Tabel Daftar Soal */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '55px' }} className="text-center">No</th>
                    <th style={{ width: '75px' }}>Kategori</th>
                    <th style={{ width: '220px' }}>Judul Soal</th>
                    <th>Cuplikan Pertanyaan</th>
                    <th style={{ width: '160px' }}>Kunci & Bobot</th>
                    <th style={{ width: '90px' }} className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Tidak ada soal yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((q) => {
                      const isSingle = q.id <= 65 || q.scoringType === 'single';
                      const hasMainImg = Boolean(q.image);
                      const hasOptImg = Boolean(q.optionImages && Object.values(q.optionImages).some(Boolean));
                      return (
                        <tr key={q.id}>
                          <td className="text-center fw-bold">#{q.id}</td>
                          <td>
                            <span className={`category-badge-sm badge-${(q.category || 'twk').toLowerCase()}`}>
                              {q.category || 'TWK'}
                            </span>
                            {hasMainImg && (
                              <span className="badge-img-pill" title="Memiliki lampiran gambar pada soal utama">
                                🖼️
                              </span>
                            )}
                            {hasOptImg && (
                              <span className="badge-img-pill" title="Memiliki gambar pada opsi pilihan jawaban">
                                🎨
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="fw-semibold text-truncate-1">
                              <MathText text={q.title || 'Tanpa Judul'} />
                            </div>
                            <small className="text-muted text-truncate-1">{q.topic || ''}</small>
                          </td>
                          <td>
                            <div className="text-truncate-2 question-preview-cell">
                              <MathText text={q.question} />
                            </div>
                          </td>
                          <td>
                            {isSingle ? (
                              <span className="badge-pill bg-success-soft">
                                Kunci: <strong>{q.correctAnswer || 'A'}</strong> (+5)
                              </span>
                            ) : (
                              <span className="badge-pill bg-warning-soft">
                                Skala: A:{q.points?.A || 0}, B:{q.points?.B || 0}, C:{q.points?.C || 0}, D:{q.points?.D || 0}, E:{q.points?.E || 0}
                              </span>
                            )}
                          </td>
                          <td className="text-center">
                            <div className="btn-group-sm">
                              <button
                                className="btn btn-sm btn-icon btn-outline-primary"
                                title="Edit Soal"
                                onClick={() => handleOpenEditForm(q)}
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                className="btn btn-sm btn-icon btn-outline-danger"
                                title="Hapus Soal"
                                onClick={() => handleDeleteQuestion(q.id)}
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDITOR FORM */}
      {isFormOpen && (
        <div className="modal-backdrop is-open" style={{ zIndex: 1100 }}>
          <div className="modal-card form-editor-card">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h3>{editingId === null ? 'Tambah Soal Baru' : `Edit Soal #${formData.id}: ${formData.title}`}</h3>
                {/* Tab switcher: Editor vs Preview */}
                <div className="form-tab-switcher">
                  <button
                    type="button"
                    className={`form-tab-btn ${activeFormTab === 'editor' ? 'is-active' : ''}`}
                    onClick={() => setActiveFormTab('editor')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Formulir
                  </button>
                  <button
                    type="button"
                    className={`form-tab-btn ${activeFormTab === 'preview' ? 'is-active' : ''}`}
                    onClick={() => setActiveFormTab('preview')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Pratinjau Hasil
                  </button>
                </div>
              </div>
              <button className="icon-btn" onClick={() => setIsFormOpen(false)} aria-label="Tutup Form">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="modal-body" style={{ maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>
                {/* Toast Notification */}
                {toastMessage && (
                  <div className="admin-toast-banner" style={{ marginBottom: '1rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{toastMessage}</span>
                  </div>
                )}

                {activeFormTab === 'preview' ? (
                  /* ================= TAB PRATINJAU LANGSUNG ================= */
                  <div className="admin-live-preview-box">
                    <div className="preview-note">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                      Berikut tampilan simulasi bagaimana soal, rumus matematika, dan gambar (soal & opsi) akan tampil bagi peserta ujian:
                    </div>

                    <div className="preview-card-frame">
                      <div className="preview-card-header">
                        <span className={`category-badge-sm badge-${(formData.category || 'twk').toLowerCase()}`}>
                          {formData.category}
                        </span>
                        <span className="topic-tag">{formData.topic || 'Kompetensi Dasar'}</span>
                        <div style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {formData.scoringType === 'single' ? 'Benar +5 / Salah 0' : 'Skala 1 - 5 Poin'}
                        </div>
                      </div>

                      <h3 className="preview-question-title">
                        <MathText text={formData.title || '(Belum ada judul soal)'} />
                      </h3>

                      {/* Gambar Soal Utama */}
                      {formData.image && (
                        <div className="question-image-box" style={{ margin: '1rem 0' }}>
                          <div className="question-image-wrapper">
                            <img src={formData.image} alt={formData.imageCaption || 'Gambar Soal'} className="question-img" />
                          </div>
                          {formData.imageCaption && (
                            <div className="question-img-caption">
                              <span>{formData.imageCaption}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="preview-question-body">
                        <MathText text={formData.question || '(Belum ada teks pertanyaan)'} />
                      </div>

                      <div className="preview-options-list">
                        {['A', 'B', 'C', 'D', 'E'].map(opt => {
                          const optImg = formData.optionImages && formData.optionImages[opt];
                          const optText = formData.options[opt];
                          return (
                            <div key={opt} className={`preview-option-item ${formData.scoringType === 'single' && formData.correctAnswer === opt ? 'is-correct-key' : ''}`}>
                              <div className="preview-option-key">{opt}</div>
                              <div className="preview-option-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                                {optImg && (
                                  <div className="preview-opt-img-box">
                                    <img src={optImg} alt={`Gambar Opsi ${opt}`} className="preview-opt-img" />
                                  </div>
                                )}
                                {optText && (
                                  <div className="preview-option-text">
                                    <MathText text={optText} />
                                  </div>
                                )}
                              </div>
                              {formData.scoringType === 'scale' && (
                                <span className="badge-pill bg-warning-soft">
                                  {formData.points[opt] || 1} Poin
                                </span>
                              )}
                              {formData.scoringType === 'single' && formData.correctAnswer === opt && (
                                <span className="badge-pill bg-success-soft">
                                  Kunci Benar (5 Poin)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {formData.explanation && (
                        <div className="preview-explanation-box">
                          <strong>Pembahasan:</strong>
                          <div style={{ marginTop: '0.35rem' }}>
                            <MathText text={formData.explanation} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ================= TAB FORMULIR EDITOR ================= */
                  <>
                    {/* Kategori & Subtopik */}
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Kategori Soal</label>
                        <select
                          className="form-control"
                          value={formData.category}
                          onChange={(e) => {
                            const cat = e.target.value;
                            setFormData({
                              ...formData,
                              category: cat,
                              scoringType: cat === 'TKP' ? 'scale' : 'single'
                            });
                          }}
                        >
                          <option value="TWK">TWK (Tes Wawasan Kebangsaan)</option>
                          <option value="TIU">TIU (Tes Inteligensia Umum)</option>
                          <option value="TKP">TKP (Tes Karakteristik Pribadi)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Subtopik / Indikator</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Kemampuan Figural / Aritmetika / Silogisme"
                          value={formData.topic}
                          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Judul Soal */}
                    <div className="form-group">
                      <label>Judul Soal <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <input
                        ref={fieldRefs.title}
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Perhitungan Kecepatan Berpapasan Dua Kendaraan"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        onFocus={() => setMathTarget('title')}
                        required
                      />
                    </div>

                    {/* ================= FITUR UPLOAD & COPY/PASTE GAMBAR (PERSIS SEPERTI EQUATION MATH) ================= */}
                    <div className="form-section-card">
                      <div className="form-section-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          <strong>Fitur Upload, Tempel (Paste), & Salin Gambar</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn btn-xs btn-primary"
                            onClick={() => handlePasteImageFromClipboard(imageTarget)}
                            title="Tempel gambar langsung dari clipboard (Ctrl+V)"
                          >
                            📋 Tempel Clipboard
                          </button>
                          {currentTargetImg.src && (
                            <>
                              <button
                                type="button"
                                className="btn btn-xs btn-secondary"
                                onClick={() => handleCopyImageToClipboard(currentTargetImg.src)}
                                title="Salin gambar ini ke clipboard"
                              >
                                📋 Salin Gambar
                              </button>
                              <button
                                type="button"
                                className="btn btn-xs btn-outline-danger"
                                onClick={() => handleRemoveImageFromTarget(imageTarget)}
                                title="Hapus gambar pada target ini"
                              >
                                Hapus
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Selector Target Gambar (Sama seperti fitur Equation Math) */}
                      <div className="math-target-bar">
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Pasang / Edit Gambar pada:</span>
                        <div className="target-pill-group">
                          {[
                            { id: 'question', label: '📌 Soal Utama', hasImg: Boolean(formData.image) },
                            { id: 'optA', label: '🅰️ Opsi A', hasImg: Boolean(formData.optionImages?.A) },
                            { id: 'optB', label: '🅱️ Opsi B', hasImg: Boolean(formData.optionImages?.B) },
                            { id: 'optC', label: '🅲 Opsi C', hasImg: Boolean(formData.optionImages?.C) },
                            { id: 'optD', label: '🅳 Opsi D', hasImg: Boolean(formData.optionImages?.D) },
                            { id: 'optE', label: '🅴 Opsi E', hasImg: Boolean(formData.optionImages?.E) },
                          ].map(t => (
                            <button
                              key={t.id}
                              type="button"
                              className={`target-pill-btn ${imageTarget === t.id ? 'is-active' : ''}`}
                              onClick={() => {
                                setImageTarget(t.id);
                                if (t.id === 'question') setMathTarget('question');
                                else setMathTarget(t.id);
                              }}
                            >
                              <span>{t.label}</span>
                              {t.hasImg && <span className="target-dot-badge" title="Target ini memiliki gambar" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dropzone & Kontrol Gambar untuk Target Aktif */}
                      {!currentTargetImg.src ? (
                        <div>
                          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.65rem' }}>
                            <button
                              type="button"
                              className={`btn btn-xs ${imageInputMode === 'file' ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => setImageInputMode('file')}
                            >
                              Unggah File
                            </button>
                            <button
                              type="button"
                              className={`btn btn-xs ${imageInputMode === 'url' ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => setImageInputMode('url')}
                            >
                              Link URL Gambar
                            </button>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: 'auto', alignSelf: 'center' }}>
                              💡 Tip: Bisa langsung tekan <strong>Ctrl + V</strong> untuk menempel screenshot!
                            </span>
                          </div>

                          {imageInputMode === 'file' ? (
                            <div
                              className={`img-upload-dropzone ${isDraggingImage ? 'is-dragover' : ''}`}
                              onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                              onDragLeave={() => setIsDraggingImage(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDraggingImage(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  handleImageFile(e.dataTransfer.files[0], imageTarget);
                                }
                              }}
                              onPaste={(e) => handleInputPaste(e, imageTarget)}
                              tabIndex={0}
                            >
                              <input
                                type="file"
                                id={`admin-file-upload-${imageTarget}`}
                                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleImageFile(e.target.files[0], imageTarget);
                                  }
                                }}
                              />
                              <label htmlFor={`admin-file-upload-${imageTarget}`} className="dropzone-label">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                </svg>
                                <span className="dropzone-title">Klik atau seret file gambar untuk <strong>{getTargetLabel(imageTarget)}</strong></span>
                                <span className="dropzone-sub">Atau klik di sini lalu tekan <strong>Ctrl + V</strong> untuk menempelkan gambar dari clipboard</span>
                              </label>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input
                                type="url"
                                className="form-control"
                                placeholder={`https://example.com/gambar-${imageTarget}.png`}
                                value={urlInputVal}
                                onChange={(e) => setUrlInputVal(e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => handleApplyImageUrl(imageTarget)}
                              >
                                Pasang ke {getTargetLabel(imageTarget)}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="uploaded-image-preview-card">
                          <div className="preview-thumb-box" onClick={() => setPreviewZoomImg(currentTargetImg.src)}>
                            <img src={currentTargetImg.src} alt={`Gambar ${getTargetLabel(imageTarget)}`} className="preview-thumb-img" />
                          </div>
                          <div className="preview-info-box">
                            <div className="preview-info-header">
                              <span className="badge-pill bg-success-soft">Gambar Terpasang pada {getTargetLabel(imageTarget)}</span>
                              {imageSizeInfo && <span className="text-muted" style={{ fontSize: '0.8rem' }}>{imageSizeInfo}</span>}
                              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.35rem' }}>
                                <button
                                  type="button"
                                  className="btn btn-xs btn-secondary"
                                  onClick={() => handleCopyImageToClipboard(currentTargetImg.src)}
                                  title="Salin gambar ini"
                                >
                                  📋 Salin Gambar
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-xs btn-outline-danger"
                                  onClick={() => handleRemoveImageFromTarget(imageTarget)}
                                  title="Hapus gambar ini"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                            {imageTarget === 'question' && (
                              <div className="form-group" style={{ margin: '0.5rem 0 0' }}>
                                <label style={{ fontSize: '0.8rem' }}>Keterangan / Caption Gambar Soal (Opsional):</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Contoh: Gambar 1. Pola Rotasi Figural TIU"
                                  value={formData.imageCaption}
                                  onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ================= TOOLBAR EQUATION MATH (LATEX) ================= */}
                    <div className="form-section-card math-toolbar-section">
                      <div className="form-section-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.2rem', fontFamily: 'serif', fontWeight: 'bold' }}>∑x</span>
                          <strong>Bantuan Formula & Simbol Matematika (Equation Math)</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Format:</span>
                          <button
                            type="button"
                            className={`btn btn-xs ${mathMode === 'inline' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setMathMode('inline')}
                            title="Format sebaris dengan teks: $...$"
                          >
                            Inline ($x$)
                          </button>
                          <button
                            type="button"
                            className={`btn btn-xs ${mathMode === 'block' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setMathMode('block')}
                            title="Format blok terpusat: $$...$$"
                          >
                            Blok ($$...$$)
                          </button>
                        </div>
                      </div>

                      {/* Pemilih target pengetikan */}
                      <div className="math-target-bar">
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Sisipkan Rumus ke:</span>
                        <select
                          className="form-control"
                          style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.82rem' }}
                          value={mathTarget}
                          onChange={(e) => {
                            setMathTarget(e.target.value);
                            if (e.target.value.startsWith('opt')) setImageTarget(e.target.value);
                            else if (e.target.value === 'question') setImageTarget('question');
                          }}
                        >
                          <option value="question">Teks Pertanyaan</option>
                          <option value="optA">Pilihan Opsi A</option>
                          <option value="optB">Pilihan Opsi B</option>
                          <option value="optC">Pilihan Opsi C</option>
                          <option value="optD">Pilihan Opsi D</option>
                          <option value="optE">Pilihan Opsi E</option>
                          <option value="explanation">Pembahasan</option>
                          <option value="title">Judul Soal</option>
                        </select>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                          Klik tombol di bawah untuk menyisipkan rumus
                        </span>
                      </div>

                      {/* Tombol Simbol KaTeX */}
                      <div className="math-buttons-grid">
                        {MATH_PRESETS.map((m, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="math-insert-btn"
                            title={m.title}
                            onClick={() => handleInsertFormula(m.code)}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {/* Template Cepat Soal TIU */}
                      <div className="tiu-template-row">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Template TIU:</span>
                        {TIU_TEMPLATES.map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="btn btn-xs btn-outline-secondary"
                            onClick={() => handleInsertFormula(tmpl.code)}
                          >
                            + {tmpl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Teks Pertanyaan */}
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label style={{ margin: 0 }}>Teks Pertanyaan / Soal <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          Bisa paste gambar (Ctrl+V) langsung ke sini atau gunakan rumus <code>$...$</code>
                        </span>
                      </div>
                      <textarea
                        ref={fieldRefs.question}
                        className="form-control"
                        rows="4"
                        placeholder="Tuliskan butir soal secara lengkap. Anda dapat menekan Ctrl+V untuk menempel gambar soal langsung ke sini..."
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        onFocus={() => {
                          setMathTarget('question');
                          setImageTarget('question');
                        }}
                        onPaste={(e) => handleInputPaste(e, 'question')}
                        required
                      />
                    </div>

                    {/* Opsi A - E (Dengan Dukungan Gambar dan Math per Opsi) */}
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label style={{ margin: 0 }}>Pilihan Jawaban (A sampai E) <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          Masing-masing opsi dapat memiliki <strong>Teks</strong> dan/atau <strong>Gambar</strong>
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['A', 'B', 'C', 'D', 'E'].map(opt => {
                          const optKey = `opt${opt}`;
                          const optImg = formData.optionImages && formData.optionImages[opt];
                          return (
                            <div key={opt} className="option-row-editor-card">
                              <span className="option-row-label">{opt}.</span>
                              <div className="option-row-input-wrap">
                                <input
                                  ref={fieldRefs[optKey]}
                                  type="text"
                                  className="form-control"
                                  placeholder={`Pilihan ${opt}... (dapat memuat teks atau rumus $...$)`}
                                  value={formData.options[opt] || ''}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    options: { ...formData.options, [opt]: e.target.value }
                                  })}
                                  onFocus={() => {
                                    setMathTarget(optKey);
                                    setImageTarget(optKey);
                                  }}
                                  onPaste={(e) => handleInputPaste(e, optKey)}
                                />

                                {/* Aksi Gambar Opsi */}
                                {optImg ? (
                                  <div className="opt-img-thumb-preview">
                                    <img
                                      src={optImg}
                                      alt={`Gambar Opsi ${opt}`}
                                      className="opt-thumb-img"
                                      onClick={() => setPreviewZoomImg(optImg)}
                                      title="Klik untuk memperbesar gambar"
                                    />
                                    <button
                                      type="button"
                                      className="opt-img-action-btn"
                                      title="Salin gambar opsi ini ke clipboard"
                                      onClick={() => handleCopyImageToClipboard(optImg)}
                                    >
                                      📋
                                    </button>
                                    <button
                                      type="button"
                                      className="opt-img-action-btn text-danger"
                                      title="Hapus gambar opsi ini"
                                      onClick={() => handleRemoveImageFromTarget(optKey)}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                                    <label
                                      className="btn btn-xs btn-outline-secondary opt-img-upload-btn"
                                      title={`Unggah gambar untuk opsi ${opt}`}
                                    >
                                      🖼️ Gambar
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleImageFile(e.target.files[0], optKey);
                                          }
                                        }}
                                      />
                                    </label>
                                    <button
                                      type="button"
                                      className="btn btn-xs btn-outline-secondary"
                                      onClick={() => handlePasteImageFromClipboard(optKey)}
                                      title={`Tempel gambar dari clipboard ke Opsi ${opt}`}
                                    >
                                      📋 Tempel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mode Penilaian */}
                    <div className="form-group">
                      <label>Sistem Penilaian & Kunci Jawaban <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <div className="scoring-type-selector">
                        <label className="radio-inline">
                          <input
                            type="radio"
                            name="form-scoring-type"
                            value="single"
                            checked={formData.scoringType === 'single'}
                            onChange={() => setFormData({ ...formData, scoringType: 'single' })}
                          />
                          <span>Benar 5 Poin / Salah 0 (Standar Soal 1-65 / TWK & TIU)</span>
                        </label>
                        <label className="radio-inline">
                          <input
                            type="radio"
                            name="form-scoring-type"
                            value="scale"
                            checked={formData.scoringType === 'scale'}
                            onChange={() => setFormData({ ...formData, scoringType: 'scale' })}
                          />
                          <span>Skala 1 - 5 Poin Tiap Opsi (Standar Soal 66-110 / TKP)</span>
                        </label>
                      </div>
                    </div>

                    {/* Single key selection */}
                    {formData.scoringType === 'single' ? (
                      <div className="form-group">
                        <label>Pilih Kunci Jawaban yang Benar (Bernilai 5 Poin):</label>
                        <div style={{ display: 'flex', gap: '1.5rem', padding: '0.5rem 0' }}>
                          {['A', 'B', 'C', 'D', 'E'].map(k => (
                            <label key={k} className="radio-inline">
                              <input
                                type="radio"
                                name="correct-key"
                                value={k}
                                checked={formData.correctAnswer === k}
                                onChange={() => setFormData({ ...formData, correctAnswer: k })}
                              />
                              <span>Opsi {k}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="form-group">
                        <label>Tentukan Nilai Poin (1 sampai 5) untuk Masing-Masing Pilihan Opsi:</label>
                        <div className="scale-points-row">
                          {['A', 'B', 'C', 'D', 'E'].map(k => (
                            <div key={k} className="point-input-box">
                              <span>Opsi {k}</span>
                              <input
                                type="number"
                                className="form-control"
                                min="1"
                                max="5"
                                value={formData.points[k] || 1}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  points: { ...formData.points, [k]: parseInt(e.target.value, 10) || 1 }
                                })}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pembahasan */}
                    <div className="form-group">
                      <label>Pembahasan & Penjelasan Kunci Jawaban</label>
                      <textarea
                        ref={fieldRefs.explanation}
                        className="form-control"
                        rows="3"
                        placeholder="Tuliskan pembahasan atau langkah penyelesaian (dapat menyertakan rumus KaTeX $...$)..."
                        value={formData.explanation}
                        onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                        onFocus={() => setMathTarget('explanation')}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId === null ? 'Tambahkan Soal' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lightbox Preview Zoom untuk Admin */}
      {previewZoomImg && (
        <div
          className="modal-backdrop is-open img-zoom-backdrop"
          onClick={() => setPreviewZoomImg(null)}
          style={{ zIndex: 1300 }}
        >
          <div className="img-zoom-container" onClick={(e) => e.stopPropagation()}>
            <div className="img-zoom-header">
              <span>Pratinjau Gambar Penuh</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-xs btn-secondary"
                  onClick={() => handleCopyImageToClipboard(previewZoomImg)}
                >
                  📋 Salin Gambar
                </button>
                <button
                  className="icon-btn"
                  onClick={() => setPreviewZoomImg(null)}
                  aria-label="Tutup"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>
            <div className="img-zoom-body">
              <img src={previewZoomImg} alt="Zoom Preview" className="img-zoom-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
