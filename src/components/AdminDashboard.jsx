import React, { useState } from 'react';
import { Storage } from '../utils/storage.js';
import { encodeTryout, buildShareableUrl } from '../utils/tryoutEncoder.js';
import AdminModal from './AdminModal.jsx';
import BatchQuestionManager from './BatchQuestionManager.jsx';
import PromptConfirmModal from './PromptConfirmModal.jsx';

export default function AdminDashboard({
  questions,
  onUpdateQuestions,
  examDuration,
  onUpdateDuration,
  onLogoutAdmin,
  onPreviewTryout,
  onBackToPortal
}) {
  const [activeTab, setActiveTab] = useState('tryouts'); // 'tryouts' | 'students' | 'questions' | 'sync'
  const [batches, setBatches] = useState(() => Storage.getTryoutBatches());
  const [students, setStudents] = useState(() => Storage.getStudentList());
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [managingBatch, setManagingBatch] = useState(null);

  // Custom Prompt/Confirm & Alert Dialog State
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

  // Templates State (Multi-Bank Soal)
  const [templates, setTemplates] = useState(() => Storage.getQuestionTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    const list = Storage.getQuestionTemplates();
    return list[0]?.id || 'tpl_default';
  });
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Template Modal States
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [newTemplateSource, setNewTemplateSource] = useState('bkn_default'); // 'bkn_default' | 'clone' | 'empty'
  const [cloneSourceId, setCloneSourceId] = useState('');

  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [editingInfoId, setEditingInfoId] = useState(null);
  const [editingInfoTitle, setEditingInfoTitle] = useState('');
  const [editingInfoDesc, setEditingInfoDesc] = useState('');

  // Batch Form State
  const [batchTitle, setBatchTitle] = useState('');
  const [batchDuration, setBatchDuration] = useState(100);
  const [questionSelectionMode, setQuestionSelectionMode] = useState('all');
  const [latestGeneratedUrl, setLatestGeneratedUrl] = useState('');
  const [latestGeneratedToken, setLatestGeneratedToken] = useState('');

  // Question Modal Opener
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Student Score Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    participantNumber: '',
    batchTitle: '',
    scoreTWK: 0,
    scoreTIU: 0,
    scoreTKP: 0
  });

  // Import Token Modal (single student)
  const [isImportTokenOpen, setIsImportTokenOpen] = useState(false);
  const [importTokenInput, setImportTokenInput] = useState('');
  const [importError, setImportError] = useState('');

  // Admin Sync State (Multi-admin export/import)
  const [syncMode, setSyncMode] = useState('merge'); // 'merge' | 'overwrite'
  const [syncCodeInput, setSyncCodeInput] = useState('');
  const [syncStatus, setSyncStatus] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Active template derived data
  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0] || {
    id: 'tpl_default',
    title: 'Bank Soal Standar CAT BKN',
    questions: questions
  };
  const activeTemplateQuestions = activeTemplate.questions || [];
  const tplTWKCount = activeTemplateQuestions.filter(q => q.category === 'TWK').length;
  const tplTIUCount = activeTemplateQuestions.filter(q => q.category === 'TIU').length;
  const tplTKPCount = activeTemplateQuestions.filter(q => q.category === 'TKP').length;

  // Open Question Editor Modal for a specific template
  const handleOpenEditorForTemplate = (template) => {
    setEditingTemplate(template);
    setIsQuestionModalOpen(true);
  };

  // Save questions updated in AdminModal
  const handleUpdateTemplateQuestions = (newQuestions) => {
    if (!editingTemplate) {
      onUpdateQuestions(newQuestions);
      return;
    }

    const updatedTemplate = {
      ...editingTemplate,
      questions: newQuestions,
      updatedAt: new Date().toLocaleString('id-ID')
    };

    const updatedList = Storage.saveQuestionTemplate(updatedTemplate);
    setTemplates(updatedList);
    setEditingTemplate(updatedTemplate);

    if (updatedTemplate.isDefault || updatedList.length === 1) {
      onUpdateQuestions(newQuestions);
    }

    showToast(`Bank soal "${updatedTemplate.title}" berhasil diperbarui (${newQuestions.length} butir).`);
  };

  // Create new template
  const handleCreateTemplateSubmit = (e) => {
    e.preventDefault();
    if (!newTemplateTitle.trim()) {
      showAlert({
        title: 'Nama Template Wajib',
        message: 'Nama template bank soal wajib diisi sebelum menyimpan.',
        icon: 'warning',
        confirmVariant: 'warning'
      });
      return;
    }

    let initialQuestions = [];
    if (newTemplateSource === 'bkn_default') {
      initialQuestions = Storage.getQuestions();
    } else if (newTemplateSource === 'clone') {
      const src = templates.find(t => t.id === cloneSourceId) || templates[0];
      initialQuestions = src ? JSON.parse(JSON.stringify(src.questions || [])) : [];
    } else {
      initialQuestions = [];
    }

    const newTemplate = {
      id: 'tpl_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
      title: newTemplateTitle.trim(),
      description: newTemplateDesc.trim(),
      createdAt: new Date().toLocaleString('id-ID'),
      updatedAt: new Date().toLocaleString('id-ID'),
      isDefault: false,
      questions: initialQuestions
    };

    const updatedList = Storage.saveQuestionTemplate(newTemplate);
    setTemplates(updatedList);
    setSelectedTemplateId(newTemplate.id);
    setIsCreateTemplateModalOpen(false);
    setNewTemplateTitle('');
    setNewTemplateDesc('');
    setNewTemplateSource('bkn_default');
    showToast(`Template "${newTemplate.title}" berhasil dibuat (${initialQuestions.length} butir).`);
  };

  // Edit template info
  const handleOpenEditInfo = (template) => {
    setEditingInfoId(template.id);
    setEditingInfoTitle(template.title);
    setEditingInfoDesc(template.description || '');
    setIsEditInfoModalOpen(true);
  };

  const handleSaveEditInfo = (e) => {
    e.preventDefault();
    if (!editingInfoTitle.trim()) {
      showAlert({
        title: 'Judul Template Wajib',
        message: 'Judul template bank soal tidak boleh kosong.',
        icon: 'warning',
        confirmVariant: 'warning'
      });
      return;
    }

    const target = templates.find(t => t.id === editingInfoId);
    if (!target) return;

    const updated = {
      ...target,
      title: editingInfoTitle.trim(),
      description: editingInfoDesc.trim(),
      updatedAt: new Date().toLocaleString('id-ID')
    };

    const updatedList = Storage.saveQuestionTemplate(updated);
    setTemplates(updatedList);
    setIsEditInfoModalOpen(false);
    setEditingInfoId(null);
    showToast('Informasi template berhasil diperbarui.');
  };

  // Duplicate template
  const handleDuplicateTemplate = (templateId) => {
    const res = Storage.duplicateQuestionTemplate(templateId);
    if (res.success) {
      setTemplates(res.templates);
      showToast(`Template diduplikasi: "${res.template.title}"`);
    } else {
      showAlert({
        title: 'Gagal Duplikasi',
        message: res.error || 'Gagal menduplikasi template bank soal.',
        icon: 'danger',
        confirmVariant: 'danger'
      });
    }
  };

  // Delete template
  const handleDeleteTemplate = (templateId) => {
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return;

    if (templates.length <= 1) {
      showAlert({
        title: 'Hapus Dibatalkan',
        message: 'Minimal harus ada 1 template bank soal tersisa pada sistem.',
        icon: 'warning',
        confirmVariant: 'warning'
      });
      return;
    }

    showConfirm({
      title: 'Hapus Template Bank Soal?',
      message: `Hapus template "${tpl.title}" beserta seluruh butir soal di dalamnya? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus Template',
      cancelText: 'Batal',
      confirmVariant: 'danger',
      icon: 'danger',
      onConfirm: () => {
        closeConfirm();
        const res = Storage.deleteQuestionTemplate(templateId);
        if (res.success) {
          setTemplates(res.templates);
          if (selectedTemplateId === templateId) {
            setSelectedTemplateId(res.templates[0]?.id || '');
          }
          showToast(`Template "${tpl.title}" telah dihapus.`);
        } else {
          showAlert({
            title: 'Gagal Menghapus',
            message: res.error || 'Gagal menghapus template bank soal.',
            icon: 'danger',
            confirmVariant: 'danger'
          });
        }
      }
    });
  };

  // Create & Generate Tryout Link from selected template
  const handleGenerateBatch = async (e) => {
    e.preventDefault();
    const title = batchTitle.trim() || `Tryout SKD #${batches.length + 1}`;
    const duration = parseInt(batchDuration, 10) || 100;

    const sourceQuestions = activeTemplate ? (activeTemplate.questions || []) : questions;

    let selectedQuestions = [];
    if (questionSelectionMode === 'all') {
      selectedQuestions = sourceQuestions;
    } else if (questionSelectionMode === 'twk') {
      selectedQuestions = sourceQuestions.filter(q => q.category === 'TWK');
    } else if (questionSelectionMode === 'tiu') {
      selectedQuestions = sourceQuestions.filter(q => q.category === 'TIU');
    } else if (questionSelectionMode === 'tkp') {
      selectedQuestions = sourceQuestions.filter(q => q.category === 'TKP');
    }

    if (selectedQuestions.length === 0) {
      showAlert({
        title: 'Soal Tidak Tersedia',
        message: 'Tidak ada butir soal yang tersedia pada pilihan komposisi ini untuk template terpilih.',
        icon: 'warning',
        confirmVariant: 'warning'
      });
      return;
    }

    const batchId = 'to_' + Date.now().toString(36);
    const tryoutPayload = {
      id: batchId,
      title: title,
      duration: duration,
      sourceTemplateId: activeTemplate?.id || 'tpl_default',
      sourceTemplateTitle: activeTemplate?.title || 'Standar BKN',
      questionIds: selectedQuestions.map(q => q.id),
      totalCount: selectedQuestions.length,
      createdAt: new Date().toLocaleString('id-ID')
    };

    const token = await encodeTryout(tryoutPayload);
    const fullUrl = buildShareableUrl(token);

    const savedBatch = {
      ...tryoutPayload,
      questions: selectedQuestions,
      token: token,
      shareUrl: fullUrl
    };

    const updatedList = Storage.saveTryoutBatch(savedBatch);
    setBatches(updatedList);
    setLatestGeneratedUrl(fullUrl);
    setLatestGeneratedToken(token);
    showToast(`Paket Tryout dibuat dari template "${activeTemplate?.title}". Tautan siap dibagikan.`);
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Tautan Tryout disalin ke papan klip.');
    }).catch(() => {
      showToast('Gagal menyalin tautan.');
    });
  };

  const handleCopyToken = (tok) => {
    navigator.clipboard.writeText(tok).then(() => {
      showToast('Token Tryout disalin.');
    }).catch(() => {
      showToast('Gagal menyalin token.');
    });
  };

  const handleDeleteBatch = (id) => {
    showConfirm({
      title: 'Hapus Paket Tryout?',
      message: 'Apakah Anda yakin ingin menghapus paket Tryout ini? Data paket akan dihapus dari daftar paket tersimpan.',
      confirmText: 'Ya, Hapus Paket',
      cancelText: 'Batal',
      confirmVariant: 'danger',
      icon: 'danger',
      onConfirm: () => {
        closeConfirm();
        const updated = Storage.deleteTryoutBatch(id);
        setBatches(updated);
        showToast('Paket Tryout dihapus.');
      }
    });
  };

  // List of unique batch titles available across generated batches and existing student records
  const availableFilterBatches = Array.from(
    new Set([
      ...batches.map(b => b.title?.trim()).filter(Boolean),
      ...students.map(s => s.batchTitle?.trim()).filter(Boolean)
    ])
  );

  const filteredStudents = selectedBatchFilter === 'all'
    ? students
    : students.filter(s => (s.batchTitle || '').trim() === selectedBatchFilter.trim());

  // Student Score Handling
  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    const defaultBatch = (selectedBatchFilter !== 'all' ? selectedBatchFilter : '') ||
      (batches[0] ? batches[0].title : '') ||
      (availableFilterBatches[0] || 'Tryout SKD #1');
    setStudentFormData({
      name: '',
      participantNumber: '',
      batchTitle: defaultBatch,
      scoreTWK: 0,
      scoreTIU: 0,
      scoreTKP: 0
    });
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student) => {
    setEditingStudentId(student.id);
    setStudentFormData({
      name: student.name,
      participantNumber: student.participantNumber,
      batchTitle: student.batchTitle,
      scoreTWK: student.scoreTWK,
      scoreTIU: student.scoreTIU,
      scoreTKP: student.scoreTKP
    });
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!studentFormData.name.trim()) {
      showAlert({
        title: 'Nama Siswa Wajib',
        message: 'Nama Lengkap Siswa wajib diisi sebelum menyimpan data nilai.',
        icon: 'warning',
        confirmVariant: 'warning'
      });
      return;
    }

    const sTWK = Number(studentFormData.scoreTWK) || 0;
    const sTIU = Number(studentFormData.scoreTIU) || 0;
    const sTKP = Number(studentFormData.scoreTKP) || 0;
    const total = sTWK + sTIU + sTKP;
    const pTWK = sTWK >= 65;
    const pTIU = sTIU >= 80;
    const pTKP = sTKP >= 166;
    const isPassed = pTWK && pTIU && pTKP;

    const payload = {
      name: studentFormData.name.trim(),
      participantNumber: studentFormData.participantNumber.trim() || '-',
      batchTitle: studentFormData.batchTitle.trim() || 'Tryout Mandiri',
      scoreTWK: sTWK,
      scoreTIU: sTIU,
      scoreTKP: sTKP,
      totalScore: total,
      passedTWK: pTWK,
      passedTIU: pTIU,
      passedTKP: pTKP,
      isPassed: isPassed
    };

    if (editingStudentId) {
      const updated = Storage.updateStudentResult(editingStudentId, payload);
      setStudents(updated);
      showToast('Nilai siswa diperbarui.');
    } else {
      const updated = Storage.saveStudentResult(payload);
      setStudents(updated);
      showToast('Nilai siswa disimpan.');
    }

    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = (id) => {
    showConfirm({
      title: 'Hapus Data Nilai Siswa?',
      message: 'Apakah Anda yakin ingin menghapus data nilai siswa ini dari rekapitulasi nilai?',
      confirmText: 'Ya, Hapus Data',
      cancelText: 'Batal',
      confirmVariant: 'danger',
      icon: 'danger',
      onConfirm: () => {
        closeConfirm();
        const updated = Storage.deleteStudentResult(id);
        setStudents(updated);
        showToast('Data siswa dihapus.');
      }
    });
  };

  // Import Result Token from single Student
  const handleImportTokenSubmit = (e) => {
    e.preventDefault();
    if (!importTokenInput.trim()) {
      setImportError('Masukkan token hasil ujian siswa.');
      return;
    }

    try {
      let parsed = null;
      const raw = importTokenInput.trim();
      if (raw.startsWith('{') && raw.endsWith('}')) {
        parsed = JSON.parse(raw);
      } else {
        let decoded = '';
        try {
          decoded = decodeURIComponent(escape(atob(raw)));
        } catch {
          decoded = atob(raw);
        }
        parsed = JSON.parse(decoded);
      }

      if (!parsed || (!parsed.scoreTWK && !parsed.totalScore && !parsed.name)) {
        throw new Error('Format token tidak valid.');
      }

      const updated = Storage.saveStudentResult({
        name: parsed.name || 'Siswa Import',
        participantNumber: parsed.participantNumber || '-',
        batchTitle: parsed.batchTitle || 'Hasil Import',
        scoreTWK: parsed.scoreTWK || 0,
        scoreTIU: parsed.scoreTIU || 0,
        scoreTKP: parsed.scoreTKP || 0,
        totalScore: parsed.totalScore || 0,
        passedTWK: parsed.scoreTWK >= 65,
        passedTIU: parsed.scoreTIU >= 80,
        passedTKP: parsed.scoreTKP >= 166,
        isPassed: (parsed.scoreTWK >= 65) && (parsed.scoreTIU >= 80) && (parsed.scoreTKP >= 166),
        timestamp: parsed.timestamp || new Date().toLocaleString('id-ID')
      });

      setStudents(updated);
      setIsImportTokenOpen(false);
      setImportTokenInput('');
      setImportError('');
      showToast('Hasil ujian siswa berhasil ditambahkan ke rekap nilai.');
    } catch (err) {
      setImportError('Gagal membaca token hasil.');
    }
  };

  // Admin Data Sync Handlers (Multi-Admin)
  const handleExportSyncFile = () => {
    Storage.exportAdminSyncFile();
    showToast('File data admin berhasil diunduh.');
  };

  const handleCopySyncCode = () => {
    const code = Storage.exportAdminSyncCode();
    navigator.clipboard.writeText(code).then(() => {
      showToast('Kode sinkronisasi disalin ke papan klip.');
    });
  };

  const handleImportSyncFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const res = Storage.importAdminSyncData(content, syncMode);
        if (res.success) {
          setBatches(Storage.getTryoutBatches());
          setStudents(Storage.getStudentList());
          setTemplates(Storage.getQuestionTemplates());
          onUpdateQuestions(Storage.getQuestions());
          setSyncStatus({
            type: 'success',
            msg: `Sinkronisasi berhasil! (+${res.stats.batches} paket, +${res.stats.students} siswa, +${res.stats.templates || 0} template, +${res.stats.questions} soal)`
          });
          showToast('Data admin berhasil disinkronkan.');
        } else {
          setSyncStatus({ type: 'error', msg: res.error });
        }
      } catch (err) {
        setSyncStatus({ type: 'error', msg: 'File tidak valid.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportSyncCodeSubmit = (e) => {
    e.preventDefault();
    if (!syncCodeInput.trim()) {
      setSyncStatus({ type: 'error', msg: 'Masukkan kode sinkronisasi.' });
      return;
    }

    const res = Storage.importAdminSyncData(syncCodeInput.trim(), syncMode);
    if (res.success) {
      setBatches(Storage.getTryoutBatches());
      setStudents(Storage.getStudentList());
      setTemplates(Storage.getQuestionTemplates());
      onUpdateQuestions(Storage.getQuestions());
      setSyncCodeInput('');
      setSyncStatus({
        type: 'success',
        msg: `Sinkronisasi berhasil! (+${res.stats.batches} paket, +${res.stats.students} siswa, +${res.stats.templates || 0} template, +${res.stats.questions} soal)`
      });
      showToast('Data admin berhasil disinkronkan.');
    } else {
      setSyncStatus({ type: 'error', msg: res.error });
    }
  };

  // Gradebook Analytics (dynamic based on filtered tryout batch)
  const totalStudents = filteredStudents.length;
  const passedStudents = filteredStudents.filter(s => s.isPassed).length;
  const passPercentage = totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 0;
  const avgTotalScore = totalStudents > 0
    ? Math.round(filteredStudents.reduce((acc, cur) => acc + (cur.totalScore || 0), 0) / totalStudents)
    : 0;

  // If currently managing questions of a specific batch, render BatchQuestionManager
  if (managingBatch) {
    return (
      <div className="admin-dashboard-container min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
        <header className="admin-nav-bar sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="admin-nav-inner max-w-[1540px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="admin-brand flex items-center gap-3">
              <button
                className="btn-back-header inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95 shadow-sm"
                onClick={() => setManagingBatch(null)}
                title="Kembali ke Daftar Paket"
              >
                ← Kembali ke Paket Tryout
              </button>
            </div>
            <div className="admin-header-actions flex items-center gap-2.5">
              <button
                className="btn-logout-admin px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
                onClick={onLogoutAdmin}
              >
                Keluar
              </button>
            </div>
          </div>
        </header>

        <main className="admin-workspace-body max-w-[1540px] mx-auto px-4 py-6 w-full flex-1 flex flex-col">
          <BatchQuestionManager
            batch={managingBatch}
            masterQuestions={questions}
            onBack={() => {
              setManagingBatch(null);
              setBatches(Storage.getTryoutBatches());
            }}
            onBatchUpdated={(updated) => {
              setBatches(Storage.getTryoutBatches());
              setManagingBatch(updated);
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast-banner fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl font-medium text-sm border border-emerald-500 animate-bounce">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header Navigation */}
      <header className="admin-nav-bar sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="admin-nav-inner max-w-[1540px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="admin-brand flex items-center gap-3">
            {onBackToPortal && (
              <button
                className="btn-back-header inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95 shadow-sm"
                onClick={onBackToPortal}
                title="Kembali ke Pemilihan Peran"
              >
                ← Portal Peran
              </button>
            )}
            <div className="admin-brand-icon w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </div>
            <div>
              <h1 className="admin-brand-title text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Admin & Pengawas</h1>
            </div>
          </div>

          <div className="admin-header-actions flex items-center gap-2.5">
            <button
              className="btn-logout-admin px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
              onClick={onLogoutAdmin}
              title="Keluar dari sesi Admin"
            >
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="admin-workspace-body max-w-[1540px] mx-auto px-4 py-6 w-full flex-1 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="admin-tabs-bar flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
          <button
            id="admin-tab-tryouts"
            className={`admin-tab-btn flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'tryouts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('tryouts')}
          >
            <span>Paket Tryout</span>
            <span className="admin-tab-count px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">{batches.length}</span>
          </button>

          <button
            id="admin-tab-students"
            className={`admin-tab-btn flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'students'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('students')}
          >
            <span>Rekap Nilai Siswa</span>
            <span className="admin-tab-count px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">{students.length}</span>
          </button>

          <button
            id="admin-tab-questions"
            className={`admin-tab-btn flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'questions'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('questions')}
          >
            <span>Bank Soal & Template</span>
            <span className="admin-tab-count px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">{templates.length}</span>
          </button>

          <button
            id="admin-tab-sync"
            className={`admin-tab-btn flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap active:scale-95 ${
              activeTab === 'sync'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('sync')}
          >
            <span>Sinkronisasi Data Admin</span>
          </button>
        </div>

        {/* TAB 1: PAKET TRYOUT & TAUTAN */}
        {activeTab === 'tryouts' && (
          <div className="admin-tab-content flex flex-col gap-6">
            {/* Create Tryout Form Card */}
            <div className="admin-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5">
              <div className="admin-card-header flex flex-col gap-1">
                <h2 className="admin-card-title text-lg font-bold text-slate-900 dark:text-white tracking-tight">Buat Paket Tryout Baru</h2>
                <p className="admin-card-subtitle text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  Pilih template bank soal, atur judul & durasi, lalu buat tautan ujian untuk siswa.
                </p>
              </div>

              <form onSubmit={handleGenerateBatch} className="batch-generator-form flex flex-col gap-4">
                <div className="batch-form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Template Selector Dropdown */}
                  <div className="form-group full-col md:col-span-2 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="template-selector">
                        Pilih Sumber Template Bank Soal
                      </label>
                      <button
                        type="button"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 active:scale-95"
                        onClick={() => setActiveTab('questions')}
                      >
                        Kelola / Buat Template Baru →
                      </button>
                    </div>
                    <select
                      id="template-selector"
                      className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white outline-none cursor-pointer"
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                    >
                      {templates.map(t => {
                        const qCount = t.questions?.length || 0;
                        const twk = (t.questions || []).filter(q => q.category === 'TWK').length;
                        const tiu = (t.questions || []).filter(q => q.category === 'TIU').length;
                        const tkp = (t.questions || []).filter(q => q.category === 'TKP').length;
                        return (
                          <option key={t.id} value={t.id}>
                            {t.title} — ({qCount} Soal: {twk} TWK, {tiu} TIU, {tkp} TKP) {t.isDefault ? '★ [Default BKN]' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {activeTemplate && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="truncate">{activeTemplate.description || 'Template bank soal terpilih.'}</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {activeTemplateQuestions.length} Butir Soal Terdaftar ({tplTWKCount} TWK, {tplTIUCount} TIU, {tplTKPCount} TKP)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="form-group flex flex-col gap-1.5">
                    <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="batch-title-input">
                      Nama Paket Tryout
                    </label>
                    <input
                      id="batch-title-input"
                      type="text"
                      className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
                      placeholder="Contoh: Tryout SKD Batch 1"
                      value={batchTitle}
                      onChange={(e) => setBatchTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group flex flex-col gap-1.5">
                    <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="batch-duration-input">
                      Durasi (Menit)
                    </label>
                    <input
                      id="batch-duration-input"
                      type="number"
                      min="1"
                      max="300"
                      className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
                      value={batchDuration}
                      onChange={(e) => setBatchDuration(e.target.value)}
                    />
                  </div>

                  <div className="form-group full-col md:col-span-2 flex flex-col gap-1.5">
                    <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Pilihan Komposisi Soal</label>
                    <div className="question-composition-options grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-1">
                      <label className={`radio-card flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${questionSelectionMode === 'all' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <input
                          type="radio"
                          name="qmode"
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          value="all"
                          checked={questionSelectionMode === 'all'}
                          onChange={() => setQuestionSelectionMode('all')}
                        />
                        <div>
                          <strong className="text-sm font-semibold block text-slate-900 dark:text-white">Semua {activeTemplateQuestions.length} Soal (Lengkap)</strong>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{tplTWKCount} TWK, {tplTIUCount} TIU, {tplTKPCount} TKP</p>
                        </div>
                      </label>

                      <label className={`radio-card flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${questionSelectionMode === 'twk' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <input
                          type="radio"
                          name="qmode"
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          value="twk"
                          checked={questionSelectionMode === 'twk'}
                          onChange={() => setQuestionSelectionMode('twk')}
                        />
                        <div>
                          <strong className="text-sm font-semibold block text-slate-900 dark:text-white">Khusus TWK ({tplTWKCount} Soal)</strong>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Wawasan Kebangsaan</p>
                        </div>
                      </label>

                      <label className={`radio-card flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${questionSelectionMode === 'tiu' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <input
                          type="radio"
                          name="qmode"
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          value="tiu"
                          checked={questionSelectionMode === 'tiu'}
                          onChange={() => setQuestionSelectionMode('tiu')}
                        />
                        <div>
                          <strong className="text-sm font-semibold block text-slate-900 dark:text-white">Khusus TIU ({tplTIUCount} Soal)</strong>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Inteligensia Umum</p>
                        </div>
                      </label>

                      <label className={`radio-card flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${questionSelectionMode === 'tkp' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                        <input
                          type="radio"
                          name="qmode"
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                          value="tkp"
                          checked={questionSelectionMode === 'tkp'}
                          onChange={() => setQuestionSelectionMode('tkp')}
                        />
                        <div>
                          <strong className="text-sm font-semibold block text-slate-900 dark:text-white">Khusus TKP ({tplTKPCount} Soal)</strong>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Karakteristik Pribadi</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="batch-submit-row flex items-center justify-end pt-2">
                  <button type="submit" className="btn-confirm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-all active:scale-95">
                    Buat Paket & Tautan
                  </button>
                </div>
              </form>

              {/* Newly Generated Share Link Box */}
              {latestGeneratedUrl && (
                <div className="generated-link-callout p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex flex-col gap-2.5 mt-2">
                  <div className="callout-header flex items-center">
                    <span className="callout-badge inline-flex text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-0.5 rounded-full">Tautan Berhasil Dibuat</span>
                  </div>
                  <div className="link-input-copy-group flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      readOnly
                      className="form-control font-mono link-readonly-input flex-1 font-mono text-xs bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none"
                      value={latestGeneratedUrl}
                    />
                    <button
                      type="button"
                      className="btn-confirm px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-95"
                      onClick={() => handleCopyLink(latestGeneratedUrl)}
                    >
                      Salin Tautan
                    </button>
                    <button
                      type="button"
                      className="btn-cancel px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all active:scale-95"
                      onClick={() => handleCopyToken(latestGeneratedToken)}
                    >
                      Salin Token
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* History of Created Batches */}
            <div className="admin-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
              <div className="admin-card-header">
                <h3 className="admin-card-title text-lg font-bold text-slate-900 dark:text-white tracking-tight">Daftar Paket Tryout</h3>
              </div>

              {batches.length === 0 ? (
                <div className="admin-empty-state text-center py-10 text-slate-500 dark:text-slate-400">
                  <p>Belum ada paket Tryout yang dibuat.</p>
                </div>
              ) : (
                <div className="table-responsive overflow-x-auto w-full rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="admin-table w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Judul Paket</th>
                        <th className="px-4 py-3">Durasi</th>
                        <th className="px-4 py-3">Jumlah Soal</th>
                        <th className="px-4 py-3">Waktu Buat</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {batches.map((b, idx) => (
                        <tr key={b.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3.5 text-slate-500 font-medium">{idx + 1}</td>
                          <td className="px-4 py-3.5">
                            <strong className="font-semibold text-slate-900 dark:text-white block">{b.title}</strong>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Template: {b.sourceTemplateTitle || 'Standar BKN'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{b.duration} Menit</td>
                          <td className="px-4 py-3.5">
                            <button
                              className="btn-manage-q-badge px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition-all active:scale-95"
                              onClick={() => setManagingBatch(b)}
                              title="Kelola butir soal pada paket ini"
                            >
                              {b.totalCount || b.questionIds?.length || 110} Butir (Kelola Soal)
                            </button>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">{b.createdAt || '-'}</td>
                          <td className="px-4 py-3.5">
                            <div className="table-actions flex items-center gap-1.5 flex-wrap">
                              <button
                                className="btn-table-action px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
                                onClick={() => setManagingBatch(b)}
                                title="Kelola susunan soal paket ini"
                              >
                                Kelola Soal
                              </button>
                              <button
                                className="btn-table-action px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
                                onClick={() => handleCopyLink(b.shareUrl)}
                                title="Salin Tautan Siswa"
                              >
                                Salin Link
                              </button>
                              <button
                                className="btn-table-action px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
                                onClick={() => onPreviewTryout(b)}
                                title="Preview Ujian Sebagai Siswa"
                              >
                                Preview
                              </button>
                              <button
                                className="btn-table-action text-danger px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-all active:scale-95"
                                onClick={() => handleDeleteBatch(b.id)}
                                title="Hapus Paket"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: REKAP NILAI SISWA */}
        {activeTab === 'students' && (
          <div className="admin-tab-content flex flex-col gap-6">
            <div className="analytics-summary-grid grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="analytics-card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="analytics-label text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Peserta</span>
                <span className="analytics-value text-2xl font-extrabold text-slate-900 dark:text-white">{totalStudents}</span>
              </div>
              <div className="analytics-card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="analytics-label text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lolos Passing Grade</span>
                <span className="analytics-value text-success text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{passedStudents}</span>
                <span className="analytics-sub text-xs font-semibold text-emerald-600 dark:text-emerald-400">{passPercentage}% Lolos</span>
              </div>
              <div className="analytics-card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="analytics-label text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rata-Rata Total Skor</span>
                <span className="analytics-value text-primary text-2xl font-extrabold text-blue-600 dark:text-blue-400">{avgTotalScore}</span>
              </div>
            </div>

            <div className="admin-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
              <div className="admin-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="admin-card-title text-lg font-bold text-slate-900 dark:text-white tracking-tight">Rekap Nilai Siswa</h3>
                </div>
                <div className="header-action-group flex items-center gap-2 flex-wrap">
                  <button
                    id="btn-add-student-manual"
                    className="btn-confirm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-all active:scale-95"
                    onClick={handleOpenAddStudent}
                  >
                    + Input Nilai Manual
                  </button>
                  <button
                    className="btn-cancel px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-all active:scale-95"
                    onClick={() => setIsImportTokenOpen(true)}
                  >
                    Import Token Hasil
                  </button>
                  <button
                    className="btn-cancel px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-all active:scale-95"
                    onClick={() => Storage.exportStudentsCSV(filteredStudents)}
                    disabled={filteredStudents.length === 0}
                    title={selectedBatchFilter !== 'all' ? `Export CSV untuk: ${selectedBatchFilter}` : 'Export semua nilai ke CSV'}
                  >
                    Export ke CSV
                  </button>
                </div>
              </div>

              {/* Filter Paket Tryout Bar */}
              <div className="filter-bar flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                    Filter Paket:
                  </span>
                  <select
                    id="batch-filter-select"
                    className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                    value={selectedBatchFilter}
                    onChange={(e) => setSelectedBatchFilter(e.target.value)}
                  >
                    <option value="all">Semua Paket Tryout ({students.length} Siswa)</option>
                    {availableFilterBatches.map(bTitle => {
                      const countInBatch = students.filter(s => (s.batchTitle || '').trim() === bTitle).length;
                      return (
                        <option key={bTitle} value={bTitle}>
                          {bTitle} ({countInBatch} Siswa)
                        </option>
                      );
                    })}
                  </select>
                  {selectedBatchFilter !== 'all' && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 active:scale-95"
                      onClick={() => setSelectedBatchFilter('all')}
                    >
                      ✕ Reset Filter
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Menampilkan <strong className="text-slate-900 dark:text-white font-bold">{filteredStudents.length}</strong> dari {students.length} total peserta
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="admin-empty-state text-center py-10 text-slate-500 dark:text-slate-400">
                  {students.length === 0 ? (
                    <div className="flex flex-col items-center gap-2">
                      <p className="font-semibold text-sm">Belum ada data nilai siswa.</p>
                      <p className="text-xs text-slate-400">Gunakan tombol <strong>+ Input Nilai Manual</strong> atau <strong>Import Token Hasil</strong> untuk merekap nilai.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <p className="font-semibold text-sm">Tidak ada peserta pada paket "{selectedBatchFilter}".</p>
                      <button
                        type="button"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline active:scale-95"
                        onClick={() => setSelectedBatchFilter('all')}
                      >
                        Tampilkan Semua Paket ({students.length} Siswa)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="table-responsive overflow-x-auto w-full rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="admin-table w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Nama Siswa</th>
                        <th className="px-4 py-3">No. Peserta</th>
                        <th className="px-4 py-3">Paket Tryout</th>
                        <th className="px-4 py-3">TWK (65)</th>
                        <th className="px-4 py-3">TIU (80)</th>
                        <th className="px-4 py-3">TKP (166)</th>
                        <th className="px-4 py-3">Total Skor</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredStudents.map((s, idx) => (
                        <tr key={s.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3.5 text-slate-500 font-medium">{idx + 1}</td>
                          <td className="px-4 py-3.5"><strong className="font-semibold text-slate-900 dark:text-white">{s.name}</strong></td>
                          <td className="px-4 py-3.5 text-slate-500 text-xs font-mono">{s.participantNumber}</td>
                          <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{s.batchTitle}</td>
                          <td className="px-4 py-3.5">
                            <span className={s.passedTWK ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                              {s.scoreTWK}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={s.passedTIU ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                              {s.scoreTIU}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={s.passedTKP ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                              {s.scoreTKP}
                            </span>
                          </td>
                          <td className="px-4 py-3.5"><strong className="text-base font-extrabold text-slate-900 dark:text-white">{s.totalScore}</strong></td>
                          <td className="px-4 py-3.5">
                            <span className={`status-pill px-2.5 py-1 text-xs font-bold rounded-full ${s.isPassed ? 'pill-success bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'pill-danger bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'}`}>
                              {s.isPassed ? 'LOLOS' : 'GUGUR'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="table-actions flex items-center gap-1.5">
                              <button
                                className="btn-table-action px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95"
                                onClick={() => handleOpenEditStudent(s)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-table-action text-danger px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-all active:scale-95"
                                onClick={() => handleDeleteStudent(s.id)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: BANK SOAL & TEMPLATE */}
        {activeTab === 'questions' && (
          <div className="admin-tab-content flex flex-col gap-6">
            <div className="admin-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5">
              <div className="admin-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="admin-card-title text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Template Bank Soal ({templates.length} Template)
                  </h3>
                  <p className="admin-card-subtitle text-xs md:text-sm text-slate-500 dark:text-slate-400">
                    Kelola berbagai template bank soal. Setiap template dapat diedit butir soalnya, diduplikasi, dan dipilih saat membuat paket Tryout baru.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-create-template"
                    className="btn-confirm px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                    onClick={() => {
                      setNewTemplateTitle('');
                      setNewTemplateDesc('');
                      setNewTemplateSource('bkn_default');
                      setCloneSourceId(templates[0]?.id || '');
                      setIsCreateTemplateModalOpen(true);
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>+ Buat Template Baru</span>
                  </button>
                </div>
              </div>

              {/* Template Cards Grid */}
              <div className="templates-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
                {templates.map((tpl) => {
                  const tplQuestions = tpl.questions || [];
                  const qTotal = tplQuestions.length;
                  const twkCount = tplQuestions.filter(q => q.category === 'TWK').length;
                  const tiuCount = tplQuestions.filter(q => q.category === 'TIU').length;
                  const tkpCount = tplQuestions.filter(q => q.category === 'TKP').length;

                  return (
                    <div
                      key={tpl.id}
                      className="template-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all flex flex-col justify-between gap-4 shadow-sm"
                    >
                      <div className="template-card-top flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                                {tpl.title}
                              </h4>
                              {tpl.isDefault && (
                                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                  Default BKN
                                </span>
                              )}
                              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {qTotal} Soal
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                              {tpl.description || 'Tidak ada deskripsi template.'}
                            </p>
                          </div>
                        </div>

                        {/* Composition Subtest Stats */}
                        <div className="subtest-stats-row grid grid-cols-3 gap-2 mt-1">
                          <div className="stat-pill px-3 py-2 rounded-xl bg-red-50/80 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/40 text-center">
                            <span className="block text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">TWK</span>
                            <strong className="text-sm font-extrabold text-slate-900 dark:text-white">{twkCount} Soal</strong>
                          </div>
                          <div className="stat-pill px-3 py-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-center">
                            <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">TIU</span>
                            <strong className="text-sm font-extrabold text-slate-900 dark:text-white">{tiuCount} Soal</strong>
                          </div>
                          <div className="stat-pill px-3 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-center">
                            <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">TKP</span>
                            <strong className="text-sm font-extrabold text-slate-900 dark:text-white">{tkpCount} Soal</strong>
                          </div>
                        </div>
                      </div>

                      <div className="template-card-bottom pt-3 border-t border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          Update: {tpl.updatedAt || tpl.createdAt || '-'}
                        </span>

                        <div className="template-actions flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            className="btn-confirm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1"
                            onClick={() => handleOpenEditorForTemplate(tpl)}
                            title="Buka Editor Soal Lengkap"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            <span>Editor Soal ({qTotal})</span>
                          </button>

                          <button
                            type="button"
                            className="btn-cancel px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-all active:scale-95"
                            onClick={() => handleOpenEditInfo(tpl)}
                            title="Ubah Judul & Keterangan"
                          >
                            Ubah Info
                          </button>

                          <button
                            type="button"
                            className="btn-cancel px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-all active:scale-95"
                            onClick={() => handleDuplicateTemplate(tpl.id)}
                            title="Duplikat Template Ini"
                          >
                            Duplikat
                          </button>

                          {templates.length > 1 && (
                            <button
                              type="button"
                              className="btn-table-action text-danger px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-all active:scale-95"
                              onClick={() => handleDeleteTemplate(tpl.id)}
                              title="Hapus Template"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SINKRONISASI DATA ANTAR-ADMIN */}
        {activeTab === 'sync' && (
          <div className="admin-tab-content">
            <div className="admin-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-5">
              <div className="admin-card-header flex flex-col gap-1">
                <h3 className="admin-card-title text-lg font-bold text-slate-900 dark:text-white tracking-tight">Sinkronisasi Data Antar-Admin (Local Storage)</h3>
                <p className="admin-card-subtitle text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  Karena sistem tidak memakai database pusat, gunakan ekspor-impor file JSON atau kode token untuk menyinkronkan paket Tryout, bank soal, dan rekap nilai antar perangkat pengawas.
                </p>
              </div>

              {/* Status Banner */}
              {syncStatus && (
                <div className={`sync-status-alert p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${syncStatus.type === 'success' ? 'sync-success bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'sync-error bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'}`}>
                  <span>{syncStatus.msg}</span>
                </div>
              )}

              <div className="sync-panels-grid grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {/* Panel 1: Ekspor Data */}
                <div className="sync-box p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">1. Ekspor Data Admin Anda</h4>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Unduh seluruh paket Tryout, bank soal, dan data siswa saat ini untuk dikirimkan ke admin lain.</p>
                  <div className="sync-action-buttons flex flex-wrap gap-2.5">
                    <button className="btn-confirm px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-all active:scale-95" onClick={handleExportSyncFile}>
                      Unduh File Sync (.json)
                    </button>
                    <button className="btn-cancel px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-all active:scale-95" onClick={handleCopySyncCode}>
                      Salin Kode Sync (Papan Klip)
                    </button>
                  </div>
                </div>

                {/* Panel 2: Impor & Sinkronisasi Data */}
                <div className="sync-box p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">2. Impor Data dari Admin Lain</h4>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Pilih mode penggabungan data:</p>
                  
                  <div className="sync-mode-selector flex flex-col gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <label className="radio-label flex items-center gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="syncMode"
                        className="text-blue-600 focus:ring-blue-500"
                        value="merge"
                        checked={syncMode === 'merge'}
                        onChange={() => setSyncMode('merge')}
                      />
                      <span>Gabung Data (Merge) — Disarankan</span>
                    </label>
                    <label className="radio-label flex items-center gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="syncMode"
                        className="text-blue-600 focus:ring-blue-500"
                        value="overwrite"
                        checked={syncMode === 'overwrite'}
                        onChange={() => setSyncMode('overwrite')}
                      />
                      <span>Timpa Semua Data (Overwrite)</span>
                    </label>
                  </div>

                  {/* Upload File */}
                  <div className="sync-upload-section flex flex-col gap-1.5">
                    <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Upload File .json dari Admin lain:</label>
                    <input
                      type="file"
                      accept=".json"
                      className="form-control text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950/60 dark:file:text-blue-300 cursor-pointer"
                      onChange={handleImportSyncFile}
                    />
                  </div>

                  {/* Or Paste Token */}
                  <form onSubmit={handleImportSyncCodeSubmit} className="sync-code-form flex flex-col gap-1.5">
                    <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Atau tempel Kode Sync di sini:</label>
                    <div className="sync-input-group flex flex-col gap-2">
                      <textarea
                        rows="2"
                        className="form-control font-mono w-full px-3.5 py-2 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
                        placeholder="Tempel kode sync base64..."
                        value={syncCodeInput}
                        onChange={(e) => setSyncCodeInput(e.target.value)}
                      />
                      <button type="submit" className="btn-confirm self-end px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-sm transition-all active:scale-95">
                        Terapkan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD/EDIT STUDENT MANUAL SCORE */}
      {isStudentModalOpen && (
        <div className="modal-backdrop is-open fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsStudentModalOpen(false)}>
          <div className="modal-dialog bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="modal-header-brand">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingStudentId ? 'Edit Data Nilai Siswa' : 'Input Nilai Siswa'}</h3>
              </div>
              <button className="btn-modal-close text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg transition-colors" onClick={() => setIsStudentModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveStudent} className="modal-body-form p-5 flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Nama Siswa *</label>
                <input
                  id="student-name-form-input"
                  type="text"
                  className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  placeholder="Contoh: Muhammad Rizky"
                  value={studentFormData.name}
                  onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                />
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">No Peserta / Asal Sekolah</label>
                <input
                  type="text"
                  className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  placeholder="Contoh: 2401-SKD-001"
                  value={studentFormData.participantNumber}
                  onChange={(e) => setStudentFormData({ ...studentFormData, participantNumber: e.target.value })}
                />
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Paket Tryout</label>
                {availableFilterBatches.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <select
                      className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white outline-none cursor-pointer"
                      value={availableFilterBatches.includes(studentFormData.batchTitle) ? studentFormData.batchTitle : '__custom__'}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setStudentFormData({ ...studentFormData, batchTitle: '' });
                        } else {
                          setStudentFormData({ ...studentFormData, batchTitle: e.target.value });
                        }
                      }}
                    >
                      {availableFilterBatches.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                      <option value="__custom__">+ Ketik Nama Paket Lain...</option>
                    </select>
                    {(!availableFilterBatches.includes(studentFormData.batchTitle) || studentFormData.batchTitle === '') && (
                      <input
                        type="text"
                        className="form-control w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                        placeholder="Ketik nama paket tryout kustom..."
                        value={studentFormData.batchTitle}
                        onChange={(e) => setStudentFormData({ ...studentFormData, batchTitle: e.target.value })}
                        required
                      />
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                    placeholder="Contoh: Tryout SKD #1"
                    value={studentFormData.batchTitle}
                    onChange={(e) => setStudentFormData({ ...studentFormData, batchTitle: e.target.value })}
                    required
                  />
                )}
              </div>

              <div className="score-inputs-row grid grid-cols-3 gap-3">
                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Skor TWK</label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    className="form-control w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    value={studentFormData.scoreTWK}
                    onChange={(e) => setStudentFormData({ ...studentFormData, scoreTWK: e.target.value })}
                  />
                </div>

                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Skor TIU</label>
                  <input
                    type="number"
                    min="0"
                    max="175"
                    className="form-control w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    value={studentFormData.scoreTIU}
                    onChange={(e) => setStudentFormData({ ...studentFormData, scoreTIU: e.target.value })}
                  />
                </div>

                <div className="form-group flex flex-col gap-1.5">
                  <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Skor TKP</label>
                  <input
                    type="number"
                    min="0"
                    max="225"
                    className="form-control w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    value={studentFormData.scoreTKP}
                    onChange={(e) => setStudentFormData({ ...studentFormData, scoreTKP: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-actions flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" className="btn-cancel px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all active:scale-95" onClick={() => setIsStudentModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-confirm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-95">
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: IMPORT TOKEN HASIL SISWA */}
      {isImportTokenOpen && (
        <div className="modal-backdrop is-open fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsImportTokenOpen(false)}>
          <div className="modal-dialog bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="modal-header-brand">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Import Token Hasil Siswa</h3>
              </div>
              <button className="btn-modal-close text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg transition-colors" onClick={() => setIsImportTokenOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleImportTokenSubmit} className="modal-body-form p-5 flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Tempelkan token nilai dari kartu skor siswa:</label>
                <textarea
                  className="form-control font-mono w-full px-3.5 py-2.5 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  rows="4"
                  placeholder="Tempel token di sini..."
                  value={importTokenInput}
                  onChange={(e) => setImportTokenInput(e.target.value)}
                />
              </div>
              {importError && <p className="pin-error-text text-xs text-red-600 dark:text-red-400 font-medium">{importError}</p>}
              <div className="modal-footer-actions flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" className="btn-cancel px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all active:scale-95" onClick={() => setIsImportTokenOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-confirm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-95">
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INTEGRATED QUESTION EDITOR (CONNECTED TO EDITING TEMPLATE) */}
      <AdminModal
        isOpen={isQuestionModalOpen}
        onClose={() => {
          setIsQuestionModalOpen(false);
          setEditingTemplate(null);
        }}
        modalTitle={editingTemplate ? `Kelola Soal: ${editingTemplate.title}` : 'Panel Administrasi Soal'}
        questions={editingTemplate ? (editingTemplate.questions || []) : questions}
        onUpdateQuestions={handleUpdateTemplateQuestions}
        examDuration={examDuration}
        onUpdateDuration={onUpdateDuration}
      />

      {/* MODAL 4: BUAT TEMPLATE BANK SOAL BARU */}
      {isCreateTemplateModalOpen && (
        <div className="modal-backdrop is-open fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsCreateTemplateModalOpen(false)}>
          <div className="modal-dialog bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="modal-header-brand">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Buat Template Bank Soal Baru</h3>
              </div>
              <button className="btn-modal-close text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg transition-colors" onClick={() => setIsCreateTemplateModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateTemplateSubmit} className="modal-body-form p-5 flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Nama Template *</label>
                <input
                  id="new-template-title-input"
                  type="text"
                  className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  placeholder="Contoh: Bank Soal Tryout HOTS Batch 2"
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                />
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Deskripsi / Keterangan</label>
                <textarea
                  rows="2"
                  className="form-control w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  placeholder="Contoh: Paket soal latihan intensif penalaran analitis dan studi kasus."
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                />
              </div>

              <div className="form-group flex flex-col gap-2">
                <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Sumber Soal Awal</label>
                <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <label className="radio-label flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="tplSource"
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      value="bkn_default"
                      checked={newTemplateSource === 'bkn_default'}
                      onChange={() => setNewTemplateSource('bkn_default')}
                    />
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Salin 110 Soal Standar BKN (Disarankan)</strong>
                      <span className="text-[11px] text-slate-500">Mulai dengan salinan 110 soal standar resmi sehingga siap langsung diedit.</span>
                    </div>
                  </label>

                  <label className="radio-label flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="tplSource"
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      value="clone"
                      checked={newTemplateSource === 'clone'}
                      onChange={() => setNewTemplateSource('clone')}
                    />
                    <div className="w-full">
                      <strong className="block text-slate-900 dark:text-white">Salin dari Template Lain</strong>
                      {newTemplateSource === 'clone' && (
                        <select
                          className="form-control mt-1.5 w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
                          value={cloneSourceId}
                          onChange={(e) => setCloneSourceId(e.target.value)}
                        >
                          {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.title} ({t.questions?.length || 0} Soal)</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>

                  <label className="radio-label flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="tplSource"
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      value="empty"
                      checked={newTemplateSource === 'empty'}
                      onChange={() => setNewTemplateSource('empty')}
                    />
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Bank Kosong (0 Soal)</strong>
                      <span className="text-[11px] text-slate-500">Mulai dari kosong dan tambahkan butir soal satu per satu.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="modal-footer-actions flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" className="btn-cancel px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all active:scale-95" onClick={() => setIsCreateTemplateModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-confirm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-95">
                  Buat Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: UBAH INFO TEMPLATE */}
      {isEditInfoModalOpen && (
        <div className="modal-backdrop is-open fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsEditInfoModalOpen(false)}>
          <div className="modal-dialog bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="modal-header-brand">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ubah Informasi Template</h3>
              </div>
              <button className="btn-modal-close text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg transition-colors" onClick={() => setIsEditInfoModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveEditInfo} className="modal-body-form p-5 flex flex-col gap-4">
              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Nama Template *</label>
                <input
                  type="text"
                  className="form-control w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white outline-none"
                  value={editingInfoTitle}
                  onChange={(e) => setEditingInfoTitle(e.target.value)}
                />
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300">Deskripsi / Keterangan</label>
                <textarea
                  rows="3"
                  className="form-control w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white outline-none"
                  value={editingInfoDesc}
                  onChange={(e) => setEditingInfoDesc(e.target.value)}
                />
              </div>

              <div className="modal-footer-actions flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" className="btn-cancel px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all active:scale-95" onClick={() => setIsEditInfoModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-confirm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-95">
                  Simpan Perubahan
                </button>
              </div>
            </form>
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
    </div>
  );
}
