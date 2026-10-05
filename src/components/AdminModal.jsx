import React, { useState, useRef, useEffect } from 'react';
import { Storage } from '../utils/storage.js';
import { MathText } from '../utils/mathRenderer.jsx';
import { processAndCompressImage } from '../utils/imageOptimizer.js';
import PromptConfirmModal from './PromptConfirmModal.jsx';

export default function AdminModal({
  isOpen,
  onClose,
  questions,
  onUpdateQuestions,
  examDuration,
  onUpdateDuration,
  modalTitle
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [durationInput, setDurationInput] = useState(examDuration);

  // Custom Prompt/Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Lanjutkan',
    cancelText: 'Batal',
    showCancel: true,
    confirmVariant: 'primary',
    icon: 'warning',
    onConfirm: null
  });

  const showAlert = ({ title, message, icon = 'info', confirmText = 'Mengerti', confirmVariant = 'primary' }) => {
    setConfirmDialog({
      isOpen: true,
      title: title || 'Pemberitahuan Sistem',
      message: message || '',
      confirmText: confirmText || 'Mengerti',
      cancelText: '',
      showCancel: false,
      confirmVariant: confirmVariant,
      icon: icon,
      onConfirm: null
    });
  };

  const showConfirm = ({ title, message, confirmText, cancelText, confirmVariant, icon, onConfirm }) => {
    setConfirmDialog({
      isOpen: true,
      title: title || 'Konfirmasi Tindakan',
      message: message || '',
      confirmText: confirmText || 'Lanjutkan',
      cancelText: cancelText || 'Batal',
      showCancel: true,
      confirmVariant: confirmVariant || 'primary',
      icon: icon || 'warning',
      onConfirm: onConfirm || null
    });
  };

  const closeConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

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
      showAlert({
        title: 'Durasi Tidak Valid',
        message: 'Harap masukkan durasi waktu antara 1 hingga 300 menit.',
        icon: 'warning',
        confirmVariant: 'warning'
      });
      return;
    }
    onUpdateDuration(mins);
    showAlert({
      title: 'Durasi Disimpan',
      message: `Durasi ujian berhasil disimpan: ${mins} menit.`,
      icon: 'success',
      confirmVariant: 'success',
      confirmText: 'Selesai'
    });
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
    showConfirm({
      title: 'Hapus Soal Ujian?',
      message: `Apakah Anda yakin ingin menghapus Soal #${id}? Nomor urut soal berikutnya akan disesuaikan secara otomatis.`,
      confirmText: 'Ya, Hapus Soal',
      cancelText: 'Batal',
      confirmVariant: 'danger',
      icon: 'danger',
      onConfirm: () => {
        closeConfirm();
        let updated = questions.filter(q => q.id !== id);
        updated = updated.map((q, idx) => ({ ...q, id: idx + 1 }));
        onUpdateQuestions(updated);
      }
    });
  };

  // Reset to Default
  const handleResetToDefault = () => {
    showConfirm({
      title: 'Reset ke Bank Soal BKN Default?',
      message: 'PERINGATAN: Semua perubahan pada bank soal akan dikembalikan ke data awal (110 Soal Default Lengkap). Lanjutkan?',
      confirmText: 'Ya, Reset ke Default',
      cancelText: 'Batal',
      confirmVariant: 'danger',
      icon: 'warning',
      onConfirm: () => {
        closeConfirm();
        const def = Storage.resetQuestionsToDefault();
        onUpdateQuestions(def);
      }
    });
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
            showAlert({
              title: 'Format Tidak Valid',
              message: 'Format JSON tidak valid! Setiap butir soal harus memiliki id, question, dan pilihan jawaban.',
              icon: 'danger',
              confirmVariant: 'danger'
            });
            return;
          }
          onUpdateQuestions(parsed);
          showAlert({
            title: 'Impor Berhasil',
            message: `Berhasil mengimpor ${parsed.length} soal dari file JSON!`,
            icon: 'success',
            confirmVariant: 'success'
          });
        } else {
          showAlert({
            title: 'File Kosong',
            message: 'File JSON kosong atau format data bukan daftar array soal yang valid.',
            icon: 'warning',
            confirmVariant: 'warning'
          });
        }
      } catch (err) {
        showAlert({
          title: 'Gagal Membaca File',
          message: 'Gagal mem-parsing file JSON: ' + err.message,
          icon: 'danger',
          confirmVariant: 'danger'
        });
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
      showAlert({
        title: 'Gagal Unggah Gambar',
        message: err.message || 'Gagal mengunggah dan memproses gambar.',
        icon: 'danger',
        confirmVariant: 'danger'
      });
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
        showAlert({
          title: 'Gagal Salin Gambar',
          message: 'Gagal menyalin gambar ke clipboard: ' + err.message,
          icon: 'warning',
          confirmVariant: 'warning'
        });
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
        showAlert({
          title: 'Clipboard Kosong',
          message: 'Tidak ditemukan data gambar di clipboard. Silakan salin gambar terlebih dahulu (bisa menggunakan tombol PrintScreen / Snipping Tool / Copy Image).',
          icon: 'info',
          confirmVariant: 'primary'
        });
      } else {
        showAlert({
          title: 'Dukungan Browser',
          message: 'Browser Anda tidak mendukung direct clipboard read. Anda dapat menekan Ctrl+V langsung pada kolom input atau kotak dropzone.',
          icon: 'info',
          confirmVariant: 'primary'
        });
      }
    } catch (err) {
      showAlert({
        title: 'Izin Clipboard',
        message: 'Izin clipboard tidak diberikan atau tidak tersedia. Anda dapat langsung menekan Ctrl+V.',
        icon: 'info',
        confirmVariant: 'primary'
      });
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
      showAlert({
        title: 'Kelengkapan Soal',
        message: 'Mohon lengkapi judul soal, teks pertanyaan, dan seluruh pilihan A hingga E (dapat berupa teks maupun gambar).',
        icon: 'warning',
        confirmVariant: 'warning'
      });
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
    showAlert({
      title: editingId === null ? 'Soal Ditambahkan' : 'Perubahan Disimpan',
      message: editingId === null ? 'Butir soal baru berhasil ditambahkan ke bank soal!' : 'Perubahan butir soal berhasil disimpan ke bank soal!',
      icon: 'success',
      confirmVariant: 'success',
      confirmText: 'Selesai'
    });
  };

  const currentTargetImg = getActiveImageForTarget(imageTarget);

  return (
    <>
      <div className="modal-backdrop is-open fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto" role="dialog" aria-modal="true">
        <div className="modal-card admin-modal-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up text-slate-900 dark:text-slate-100 font-sans">
          <div className="modal-header flex items-center justify-between p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {modalTitle || 'Panel Administrasi Soal & Kunci Jawaban'}
            </h3>
            <button className="icon-btn w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95" onClick={onClose} aria-label="Tutup">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="modal-body p-4 md:p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            {/* Toast Notification */}
            {toastMessage && (
              <div className="admin-toast-banner flex items-center gap-2 p-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Statistik Ringkas Bank Soal */}
            <div className="admin-stats-summary grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="admin-stat-card p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="admin-stat-num text-xl md:text-2xl font-black text-slate-900 dark:text-white">{countTotal}</div>
                <div className="admin-stat-lbl text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Total Soal Aktif</div>
              </div>
              <div className="admin-stat-card p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex flex-col items-center justify-center text-center">
                <div className="admin-stat-num text-xl md:text-2xl font-black text-red-600 dark:text-red-400">{countTWK}</div>
                <div className="admin-stat-lbl text-[11px] font-semibold text-red-600/80 dark:text-red-400/80 uppercase tracking-tight">TWK (1 - 30)</div>
              </div>
              <div className="admin-stat-card p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 flex flex-col items-center justify-center text-center">
                <div className="admin-stat-num text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400">{countTIU}</div>
                <div className="admin-stat-lbl text-[11px] font-semibold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-tight">TIU (31 - 65)</div>
              </div>
              <div className="admin-stat-card p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex flex-col items-center justify-center text-center">
                <div className="admin-stat-num text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400">{countTKP}</div>
                <div className="admin-stat-lbl text-[11px] font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-tight">TKP (66 - 110)</div>
              </div>
              <div className="admin-stat-card p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex flex-col items-center justify-center text-center">
                <div className="admin-stat-num text-xl md:text-2xl font-black text-purple-600 dark:text-purple-400">{countWithImage}</div>
                <div className="admin-stat-lbl text-[11px] font-semibold text-purple-600/80 dark:text-purple-400/80 uppercase tracking-tight">Soal Bergambar</div>
              </div>
            </div>

            {/* Toolbar Pencarian & Aksi */}
            <div className="admin-toolbar-row flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="admin-search-box flex items-center gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  className="w-full px-3.5 py-2 text-xs md:text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  placeholder="Cari judul soal atau kata kunci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="px-3 py-2 text-xs md:text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white outline-none"
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

              <div className="admin-action-buttons flex items-center gap-2 flex-wrap">
                <button className="btn btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95" onClick={handleOpenAddForm}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Tambah Soal</span>
                </button>
                <button className="btn btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all active:scale-95" onClick={handleExportJSON} title="Unduh JSON bank soal">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  <span>Ekspor JSON</span>
                </button>
                <label className="btn btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95" title="Unggah file JSON">
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
                <button className="btn btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all active:scale-95" onClick={handleResetToDefault} title="Kembalikan ke 110 soal standar">
                  Reset Default
                </button>
              </div>
            </div>

            {/* Pengaturan Durasi Ujian */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Atur Durasi Ujian:</span>
              <input
                type="number"
                min="10"
                max="300"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                className="w-20 px-2 py-1 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
              <span className="text-slate-500">menit</span>
              <button
                className="btn btn-sm btn-secondary px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg font-semibold active:scale-95"
                onClick={handleSaveDuration}
              >
                Simpan Durasi
              </button>
            </div>

            {/* Tabel Daftar Soal */}
            <div className="admin-table-container overflow-x-auto w-full rounded-xl border border-slate-200 dark:border-slate-800 max-h-[50vh] overflow-y-auto">
              <table className="admin-table w-full text-left text-xs md:text-sm border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2.5 text-center w-14">No</th>
                    <th className="px-3 py-2.5 w-24">Kategori</th>
                    <th className="px-3 py-2.5 w-52">Judul Soal</th>
                    <th className="px-3 py-2.5">Cuplikan Pertanyaan</th>
                    <th className="px-3 py-2.5 w-40">Kunci & Bobot</th>
                    <th className="px-3 py-2.5 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-400">
                        Tidak ada soal yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((q) => {
                      const isSingle = q.id <= 65 || q.scoringType === 'single';
                      const hasMainImg = Boolean(q.image);
                      const hasOptImg = Boolean(q.optionImages && Object.values(q.optionImages).some(Boolean));
                      return (
                        <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-3 py-2.5 text-center font-bold text-slate-500">#{q.id}</td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className={`category-badge-sm px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mr-1 ${
                              (q.category || 'TWK') === 'TWK'
                                ? 'badge-twk bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                                : (q.category || 'TWK') === 'TIU'
                                ? 'badge-tiu bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                                : 'badge-tkp bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            }`}>
                              {q.category || 'TWK'}
                            </span>
                            {hasMainImg && (
                              <span className="badge-img-pill text-xs ml-0.5" title="Memiliki lampiran gambar pada soal utama">🖼️</span>
                            )}
                            {hasOptImg && (
                              <span className="badge-img-pill text-xs ml-0.5" title="Memiliki gambar pada opsi pilihan jawaban">🎨</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                              <MathText text={q.title || 'Tanpa Judul'} />
                            </div>
                            <small className="text-slate-400 line-clamp-1">{q.topic || ''}</small>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="line-clamp-2 text-slate-600 dark:text-slate-300 text-xs">
                              <MathText text={q.question} />
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            {isSingle ? (
                              <span className="badge-pill bg-success-soft px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Kunci: <strong>{q.correctAnswer || 'A'}</strong> (+5)
                              </span>
                            ) : (
                              <span className="badge-pill bg-warning-soft px-2 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                Skala TKP
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <div className="btn-group-sm inline-flex items-center gap-1">
                              <button
                                className="btn btn-sm btn-icon btn-outline-primary p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all active:scale-95"
                                title="Edit Soal"
                                onClick={() => handleOpenEditForm(q)}
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                className="btn btn-sm btn-icon btn-outline-danger p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all active:scale-95"
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
        <div className="modal-backdrop is-open fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="modal-card form-editor-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up text-slate-900 dark:text-slate-100 font-sans">
            <div className="modal-header flex items-center justify-between p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                  {editingId === null ? 'Tambah Soal Baru' : `Edit Soal #${formData.id}: ${formData.title}`}
                </h3>
                {/* Tab switcher: Editor vs Preview */}
                <div className="form-tab-switcher flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    className={`form-tab-btn flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${activeFormTab === 'editor' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                    onClick={() => setActiveFormTab('editor')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Formulir
                  </button>
                  <button
                    type="button"
                    className={`form-tab-btn flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${activeFormTab === 'preview' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                    onClick={() => setActiveFormTab('preview')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Pratinjau Hasil
                  </button>
                </div>
              </div>
              <button className="icon-btn w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95" onClick={() => setIsFormOpen(false)} aria-label="Tutup Form">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="flex-1 flex flex-col overflow-hidden">
              <div className="modal-body p-4 md:p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                {/* Toast Notification */}
                {toastMessage && (
                  <div className="admin-toast-banner flex items-center gap-2 p-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{toastMessage}</span>
                  </div>
                )}

                {activeFormTab === 'preview' ? (
                  /* TAB PRATINJAU LANGSUNG */
                  <div className="admin-live-preview-box flex flex-col gap-4">
                    <div className="preview-note p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                      Berikut tampilan simulasi bagaimana soal, rumus matematika, dan gambar akan tampil bagi peserta ujian:
                    </div>

                    <div className="preview-card-frame p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
                      <div className="preview-card-header flex items-center gap-2 flex-wrap pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span className={`category-badge-sm px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          formData.category === 'TWK' ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400' : formData.category === 'TIU' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        }`}>
                          {formData.category}
                        </span>
                        <span className="topic-tag text-xs font-medium text-slate-500">{formData.topic || 'Kompetensi Dasar'}</span>
                        <div className="ml-auto text-xs text-slate-400 font-semibold">
                          {formData.scoringType === 'single' ? 'Benar +5 / Salah 0' : 'Skala 1 - 5 Poin'}
                        </div>
                      </div>

                      <h3 className="preview-question-title text-base font-bold text-slate-900 dark:text-white">
                        <MathText text={formData.title || '(Belum ada judul soal)'} />
                      </h3>

                      {/* Gambar Soal Utama */}
                      {formData.image && (
                        <div className="question-image-box flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                          <img src={formData.image} alt={formData.imageCaption || 'Gambar Soal'} className="max-h-72 object-contain rounded-lg" />
                          {formData.imageCaption && (
                            <span className="text-xs text-slate-500 italic">{formData.imageCaption}</span>
                          )}
                        </div>
                      )}

                      <div className="preview-question-body text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        <MathText text={formData.question || '(Belum ada teks pertanyaan)'} />
                      </div>

                      <div className="preview-options-list flex flex-col gap-2 mt-2">
                        {['A', 'B', 'C', 'D', 'E'].map(opt => {
                          const optImg = formData.optionImages && formData.optionImages[opt];
                          const optText = formData.options[opt];
                          const isCorrectKey = formData.scoringType === 'single' && formData.correctAnswer === opt;
                          return (
                            <div
                              key={opt}
                              className={`preview-option-item flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                                isCorrectKey
                                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                              }`}
                            >
                              <div className="preview-option-key w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center text-xs text-slate-800 dark:text-slate-200 flex-shrink-0">
                                {opt}
                              </div>
                              <div className="preview-option-content flex-1 flex flex-col gap-1.5 text-xs text-slate-800 dark:text-slate-200">
                                {optImg && (
                                  <img src={optImg} alt={`Gambar Opsi ${opt}`} className="max-h-32 object-contain rounded-lg" />
                                )}
                                {optText && (
                                  <MathText text={optText} />
                                )}
                              </div>
                              {formData.scoringType === 'scale' && (
                                <span className="badge-pill px-2 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                  {formData.points[opt] || 1} Poin
                                </span>
                              )}
                              {isCorrectKey && (
                                <span className="badge-pill px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  Kunci Benar (5 Poin)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {formData.explanation && (
                        <div className="preview-explanation-box p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                          <strong className="text-slate-900 dark:text-white font-bold block mb-1">Pembahasan:</strong>
                          <MathText text={formData.explanation} />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* TAB FORMULIR EDITOR */
                  <>
                    {/* Kategori & Subtopik */}
                    <div className="form-grid-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Kategori Soal</label>
                        <select
                          className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white outline-none"
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
                      <div className="form-group flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subtopik / Indikator</label>
                        <input
                          type="text"
                          className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                          placeholder="Contoh: Kemampuan Figural / Aritmetika / Silogisme"
                          value={formData.topic}
                          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Judul Soal */}
                    <div className="form-group flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Judul Soal <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={fieldRefs.title}
                        type="text"
                        className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                        placeholder="Contoh: Perhitungan Kecepatan Berpapasan Dua Kendaraan"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        onFocus={() => setMathTarget('title')}
                        required
                      />
                    </div>

                    {/* FITUR UPLOAD & COPY/PASTE GAMBAR */}
                    <div className="form-section-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex flex-col gap-3">
                      <div className="form-section-header flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          <span>Fitur Upload, Tempel (Paste), & Salin Gambar</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            className="btn btn-xs px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold active:scale-95"
                            onClick={() => handlePasteImageFromClipboard(imageTarget)}
                            title="Tempel gambar langsung dari clipboard (Ctrl+V)"
                          >
                            📋 Tempel Clipboard
                          </button>
                          {currentTargetImg.src && (
                            <>
                              <button
                                type="button"
                                className="btn btn-xs px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold active:scale-95"
                                onClick={() => handleCopyImageToClipboard(currentTargetImg.src)}
                                title="Salin gambar ini ke clipboard"
                              >
                                📋 Salin Gambar
                              </button>
                              <button
                                type="button"
                                className="btn btn-xs px-2.5 py-1 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold active:scale-95"
                                onClick={() => handleRemoveImageFromTarget(imageTarget)}
                                title="Hapus gambar pada target ini"
                              >
                                Hapus
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Selector Target Gambar */}
                      <div className="math-target-bar flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Pasang / Edit Gambar pada:</span>
                        <div className="target-pill-group flex flex-wrap gap-1.5">
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
                              className={`target-pill-btn px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all active:scale-95 ${
                                imageTarget === t.id
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                              onClick={() => {
                                setImageTarget(t.id);
                                if (t.id === 'question') setMathTarget('question');
                                else setMathTarget(t.id);
                              }}
                            >
                              <span>{t.label}</span>
                              {t.hasImg && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1.5" title="Target ini memiliki gambar" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dropzone & Kontrol Gambar untuk Target Aktif */}
                      {!currentTargetImg.src ? (
                        <div>
                          <div className="flex gap-2 mb-2">
                            <button
                              type="button"
                              className={`btn btn-xs px-2.5 py-1 text-xs font-semibold rounded-lg ${imageInputMode === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                              onClick={() => setImageInputMode('file')}
                            >
                              Unggah File
                            </button>
                            <button
                              type="button"
                              className={`btn btn-xs px-2.5 py-1 text-xs font-semibold rounded-lg ${imageInputMode === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                              onClick={() => setImageInputMode('url')}
                            >
                              Link URL Gambar
                            </button>
                            <span className="text-[11px] text-slate-400 ml-auto self-center">
                              💡 Tip: Bisa langsung tekan <strong>Ctrl + V</strong> untuk menempel screenshot!
                            </span>
                          </div>

                          {imageInputMode === 'file' ? (
                            <div
                              className={`img-upload-dropzone border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                                isDraggingImage
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400'
                              }`}
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
                              <label htmlFor={`admin-file-upload-${imageTarget}`} className="dropzone-label cursor-pointer flex flex-col items-center gap-1.5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-400">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                </svg>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                  Klik atau seret file gambar untuk <strong>{getTargetLabel(imageTarget)}</strong>
                                </span>
                                <span className="text-[11px] text-slate-400">Atau klik di sini lalu tekan <strong>Ctrl + V</strong> untuk menempelkan gambar</span>
                              </label>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="url"
                                className="form-control flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                                placeholder={`https://example.com/gambar-${imageTarget}.png`}
                                value={urlInputVal}
                                onChange={(e) => setUrlInputVal(e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-secondary px-3 py-2 bg-slate-200 dark:bg-slate-700 text-xs font-semibold rounded-xl"
                                onClick={() => handleApplyImageUrl(imageTarget)}
                              >
                                Pasang ke {getTargetLabel(imageTarget)}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="uploaded-image-preview-card flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                          <div className="preview-thumb-box cursor-pointer flex-shrink-0" onClick={() => setPreviewZoomImg(currentTargetImg.src)}>
                            <img src={currentTargetImg.src} alt={`Gambar ${getTargetLabel(imageTarget)}`} className="w-16 h-16 object-cover rounded-lg border border-slate-300 dark:border-slate-700" />
                          </div>
                          <div className="preview-info-box flex-1 min-w-0 flex flex-col gap-1">
                            <div className="preview-info-header flex items-center justify-between gap-2 flex-wrap">
                              <span className="badge-pill px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Gambar Terpasang pada {getTargetLabel(imageTarget)}
                              </span>
                              {imageSizeInfo && <span className="text-slate-400 text-xs">{imageSizeInfo}</span>}
                              <div className="flex gap-1.5 ml-auto">
                                <button
                                  type="button"
                                  className="btn btn-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg active:scale-95"
                                  onClick={() => handleCopyImageToClipboard(currentTargetImg.src)}
                                  title="Salin gambar ini"
                                >
                                  📋 Salin Gambar
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-xs px-2.5 py-1 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 text-xs rounded-lg active:scale-95"
                                  onClick={() => handleRemoveImageFromTarget(imageTarget)}
                                  title="Hapus gambar ini"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                            {imageTarget === 'question' && (
                              <div className="form-group mt-1">
                                <input
                                  type="text"
                                  className="form-control w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
                                  placeholder="Keterangan / Caption Gambar Soal (Opsional)"
                                  value={formData.imageCaption}
                                  onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* TOOLBAR EQUATION MATH (LATEX) */}
                    <div className="form-section-card math-toolbar-section p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex flex-col gap-3">
                      <div className="form-section-header flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                          <span className="text-base font-serif font-black">∑x</span>
                          <span>Bantuan Formula & Simbol Matematika (KaTeX)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Format:</span>
                          <button
                            type="button"
                            className={`btn btn-xs px-2.5 py-1 text-xs font-semibold rounded-lg ${mathMode === 'inline' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            onClick={() => setMathMode('inline')}
                            title="Format sebaris dengan teks: $...$"
                          >
                            Inline ($x$)
                          </button>
                          <button
                            type="button"
                            className={`btn btn-xs px-2.5 py-1 text-xs font-semibold rounded-lg ${mathMode === 'block' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            onClick={() => setMathMode('block')}
                            title="Format blok terpusat: $$...$$"
                          >
                            Blok ($$...$$)
                          </button>
                        </div>
                      </div>

                      {/* Pemilih target pengetikan */}
                      <div className="math-target-bar flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Sisipkan Rumus ke:</span>
                        <select
                          className="form-control px-2.5 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
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
                        <span className="text-[11px] text-slate-400 ml-auto">
                          Klik tombol di bawah untuk menyisipkan rumus
                        </span>
                      </div>

                      {/* Tombol Simbol KaTeX */}
                      <div className="math-buttons-grid grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 gap-1.5">
                        {MATH_PRESETS.map((m, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="math-insert-btn p-1.5 text-xs font-mono font-bold bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 border border-slate-200 dark:border-slate-700 rounded-lg text-center transition-all active:scale-95"
                            title={m.title}
                            onClick={() => handleInsertFormula(m.code)}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {/* Template Cepat Soal TIU */}
                      <div className="tiu-template-row flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="text-slate-500 font-medium">Template TIU:</span>
                        {TIU_TEMPLATES.map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="btn btn-xs px-2 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] hover:border-blue-500 active:scale-95"
                            onClick={() => handleInsertFormula(tmpl.code)}
                          >
                            + {tmpl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Teks Pertanyaan */}
                    <div className="form-group flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Teks Pertanyaan / Soal <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Bisa paste gambar (Ctrl+V) atau rumus <code>$...$</code>
                        </span>
                      </div>
                      <textarea
                        ref={fieldRefs.question}
                        className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                        rows="4"
                        placeholder="Tuliskan butir soal secara lengkap. Anda dapat menekan Ctrl+V untuk menempel gambar soal..."
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

                    {/* Opsi A - E */}
                    <div className="form-group flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Pilihan Jawaban (A sampai E) <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Setiap opsi dapat memuat teks atau gambar
                        </span>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {['A', 'B', 'C', 'D', 'E'].map(opt => {
                          const optKey = `opt${opt}`;
                          const optImg = formData.optionImages && formData.optionImages[opt];
                          return (
                            <div key={opt} className="option-row-editor-card flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl">
                              <span className="option-row-label w-6 font-bold text-center text-sm text-slate-800 dark:text-slate-200">{opt}.</span>
                              <div className="option-row-input-wrap flex-1 flex items-center gap-2">
                                <input
                                  ref={fieldRefs[optKey]}
                                  type="text"
                                  className="form-control flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
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

                                {optImg ? (
                                  <div className="opt-img-thumb-preview flex items-center gap-1.5 flex-shrink-0">
                                    <img
                                      src={optImg}
                                      alt={`Gambar Opsi ${opt}`}
                                      className="opt-thumb-img w-9 h-9 object-cover rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                                      onClick={() => setPreviewZoomImg(optImg)}
                                      title="Klik untuk memperbesar gambar"
                                    />
                                    <button
                                      type="button"
                                      className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-xs active:scale-95"
                                      title="Salin gambar opsi ini"
                                      onClick={() => handleCopyImageToClipboard(optImg)}
                                    >
                                      📋
                                    </button>
                                    <button
                                      type="button"
                                      className="p-1 rounded bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 text-xs active:scale-95"
                                      title="Hapus gambar opsi ini"
                                      onClick={() => handleRemoveImageFromTarget(optKey)}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex gap-1 flex-shrink-0">
                                    <label
                                      className="px-2 py-1 text-xs font-semibold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
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
                                      className="px-2 py-1 text-xs font-semibold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                    <div className="form-group flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Sistem Penilaian & Kunci Jawaban <span className="text-red-500">*</span>
                      </label>
                      <div className="scoring-type-selector flex flex-col sm:flex-row gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                        <label className="radio-inline flex items-center gap-2 cursor-pointer font-medium">
                          <input
                            type="radio"
                            name="form-scoring-type"
                            className="text-blue-600 focus:ring-blue-500"
                            value="single"
                            checked={formData.scoringType === 'single'}
                            onChange={() => setFormData({ ...formData, scoringType: 'single' })}
                          />
                          <span>Benar 5 Poin / Salah 0 (Standar TWK & TIU)</span>
                        </label>
                        <label className="radio-inline flex items-center gap-2 cursor-pointer font-medium">
                          <input
                            type="radio"
                            name="form-scoring-type"
                            className="text-blue-600 focus:ring-blue-500"
                            value="scale"
                            checked={formData.scoringType === 'scale'}
                            onChange={() => setFormData({ ...formData, scoringType: 'scale' })}
                          />
                          <span>Skala 1 - 5 Poin Tiap Opsi (Standar TKP)</span>
                        </label>
                      </div>
                    </div>

                    {/* Single key selection */}
                    {formData.scoringType === 'single' ? (
                      <div className="form-group flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Kunci Jawaban yang Benar (5 Poin):</label>
                        <div className="flex gap-4 p-2">
                          {['A', 'B', 'C', 'D', 'E'].map(k => (
                            <label key={k} className="radio-inline flex items-center gap-1.5 cursor-pointer text-xs font-bold">
                              <input
                                type="radio"
                                name="correct-key"
                                className="text-blue-600 focus:ring-blue-500"
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
                      <div className="form-group flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tentukan Nilai Poin (1 - 5) untuk Masing-Masing Pilihan:</label>
                        <div className="scale-points-row grid grid-cols-5 gap-2">
                          {['A', 'B', 'C', 'D', 'E'].map(k => (
                            <div key={k} className="point-input-box flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                              <span className="font-bold">Opsi {k}</span>
                              <input
                                type="number"
                                className="form-control w-14 text-center px-1 py-1 text-xs border rounded bg-white dark:bg-slate-900 font-bold"
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
                    <div className="form-group flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pembahasan & Penjelasan Kunci Jawaban</label>
                      <textarea
                        ref={fieldRefs.explanation}
                        className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
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

              <div className="modal-footer flex items-center justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <button type="button" className="btn btn-secondary px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl" onClick={() => setIsFormOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm active:scale-95">
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
          className="modal-backdrop is-open img-zoom-backdrop fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewZoomImg(null)}
        >
          <div className="img-zoom-container bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-4 flex flex-col gap-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="img-zoom-header flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Pratinjau Gambar Penuh</span>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="btn btn-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg active:scale-95"
                  onClick={() => handleCopyImageToClipboard(previewZoomImg)}
                >
                  📋 Salin Gambar
                </button>
                <button
                  className="icon-btn w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => setPreviewZoomImg(null)}
                  aria-label="Tutup"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>
            <div className="img-zoom-body flex items-center justify-center p-2 max-h-[75vh] overflow-auto">
              <img src={previewZoomImg} alt="Zoom Preview" className="max-h-[70vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Dialog / Custom Confirm Modal */}
      <PromptConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        showCancel={confirmDialog.showCancel !== false}
        confirmVariant={confirmDialog.confirmVariant}
        icon={confirmDialog.icon}
        onConfirm={() => {
          if (confirmDialog.onConfirm) confirmDialog.onConfirm();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />
    </>
  );
}
