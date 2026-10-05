import { DEFAULT_QUESTIONS } from '../data/questionsData.js';

// Dedicated, strictly namespaced storage keys
export const STORAGE_KEYS = {
  // Shared Configuration
  SHARED_THEME: 'skd_shared_theme',
  SHARED_ROLE: 'skd_shared_role',

  // Admin Domain Keys
  ADMIN_AUTH: 'skd_admin_auth',
  ADMIN_PIN: 'skd_admin_pin',
  ADMIN_QUESTIONS: 'skd_admin_master_questions',
  ADMIN_QUESTION_TEMPLATES: 'skd_admin_question_templates',
  ADMIN_BATCHES: 'skd_admin_tryout_batches',
  ADMIN_STUDENT_LIST: 'skd_admin_student_list',
  ADMIN_EXAM_DURATION: 'skd_admin_exam_duration',

  // Student Domain Keys
  STUDENT_ACTIVE_TRYOUT: 'skd_student_active_tryout',
  STUDENT_INFO: 'skd_student_info',
  STUDENT_ANSWERS: 'skd_student_answers',
  STUDENT_FLAGS: 'skd_student_flags',
  STUDENT_TIMER: 'skd_student_timer',
  STUDENT_STATUS: 'skd_student_status',
  STUDENT_LAST_RESULT: 'skd_student_last_result',

  // Preview Domain Keys (Admin testing tryout preview - completely isolated from real student)
  PREVIEW_ACTIVE_TRYOUT: 'skd_preview_active_tryout',
  PREVIEW_ANSWERS: 'skd_preview_answers',
  PREVIEW_FLAGS: 'skd_preview_flags',
  PREVIEW_TIMER: 'skd_preview_timer',
  PREVIEW_LAST_RESULT: 'skd_preview_last_result'
};

// Legacy keys for seamless automatic migration without data loss
const LEGACY_KEYS = {
  QUESTIONS: 'skd_exam_questions_v1',
  TRYOUT_BATCHES: 'skd_tryout_batches_v1',
  STUDENT_LIST: 'skd_student_list_v1',
  USER_ANSWERS: 'skd_exam_user_answers',
  USER_FLAGS: 'skd_exam_user_flags',
  EXAM_TIMER: 'skd_exam_timer_remaining',
  EXAM_STATUS: 'skd_exam_status',
  EXAM_DURATION: 'skd_exam_duration_minutes',
  THEME: 'skd_exam_theme',
  EXAM_RESULT: 'skd_exam_last_result',
  ROLE: 'skd_active_role',
  ACTIVE_STUDENT_INFO: 'skd_active_student_info',
  ACTIVE_TRYOUT_BATCH: 'skd_active_tryout_batch'
};

function getWithMigration(newKey, legacyKey) {
  const current = localStorage.getItem(newKey);
  if (current !== null) return current;
  if (legacyKey) {
    const legacy = localStorage.getItem(legacyKey);
    if (legacy !== null) {
      localStorage.setItem(newKey, legacy);
      return legacy;
    }
  }
  return null;
}

export const Storage = {
  // ===================== ADMIN AUTHENTICATION =====================
  isAdminAuthenticated() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminAuth(isAuthenticated) {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },

  logoutAdmin() {
    this.setAdminAuth(false);
    this.clearRole();
  },

  getAdminPin() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || 'admin123';
  },

  saveAdminPin(pin) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, pin);
  },

  verifyAdminPin(inputPin) {
    return (inputPin || '').trim() === this.getAdminPin();
  },

  // ===================== ADMIN: QUESTION TEMPLATES (MULTI-BANK) =====================
  getQuestionTemplates() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_QUESTION_TEMPLATES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading question templates:', e);
    }

    // Default template fallback: initialize with current master questions
    const masterQuestions = this.getQuestions();
    const defaultTemplates = [
      {
        id: 'tpl_default',
        title: 'Bank Soal Standar CAT BKN (110 Soal)',
        description: 'Template resmi PermenPAN-RB: 30 TWK, 35 TIU, 45 TKP lengkap dengan pembahasan dan kunci jawaban.',
        createdAt: new Date().toLocaleString('id-ID'),
        updatedAt: new Date().toLocaleString('id-ID'),
        isDefault: true,
        questions: masterQuestions
      }
    ];
    this.saveQuestionTemplates(defaultTemplates);
    return defaultTemplates;
  },

  saveQuestionTemplates(templates) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_QUESTION_TEMPLATES, JSON.stringify(templates));
      return true;
    } catch (e) {
      console.error('Error saving question templates:', e);
      return false;
    }
  },

  saveQuestionTemplate(template) {
    const list = this.getQuestionTemplates();
    const idx = list.findIndex(t => t.id === template.id);
    const updatedTemplate = {
      ...template,
      updatedAt: new Date().toLocaleString('id-ID')
    };

    if (idx >= 0) {
      list[idx] = updatedTemplate;
    } else {
      list.push(updatedTemplate);
    }

    this.saveQuestionTemplates(list);

    // If updating default template, keep legacy/active master questions in sync
    if (updatedTemplate.isDefault || list.length === 1) {
      this.saveQuestions(updatedTemplate.questions);
    }

    return list;
  },

  deleteQuestionTemplate(templateId) {
    const list = this.getQuestionTemplates();
    if (list.length <= 1) {
      return { success: false, error: 'Minimal harus ada 1 Bank Soal / Template tersisa.' };
    }
    const filtered = list.filter(t => t.id !== templateId);
    this.saveQuestionTemplates(filtered);
    return { success: true, templates: filtered };
  },

  duplicateQuestionTemplate(templateId, customTitle) {
    const list = this.getQuestionTemplates();
    const source = list.find(t => t.id === templateId);
    if (!source) {
      return { success: false, error: 'Template sumber tidak ditemukan.' };
    }

    const newId = 'tpl_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);
    const newTemplate = {
      id: newId,
      title: customTitle || `Salinan - ${source.title}`,
      description: source.description || '',
      createdAt: new Date().toLocaleString('id-ID'),
      updatedAt: new Date().toLocaleString('id-ID'),
      isDefault: false,
      questions: JSON.parse(JSON.stringify(source.questions || []))
    };

    list.push(newTemplate);
    this.saveQuestionTemplates(list);
    return { success: true, template: newTemplate, templates: list };
  },

  getQuestionTemplateById(templateId) {
    const list = this.getQuestionTemplates();
    return list.find(t => t.id === templateId) || list[0] || null;
  },

  // ===================== ADMIN: MASTER QUESTIONS BANK =====================
  getQuestions() {
    try {
      const stored = getWithMigration(STORAGE_KEYS.ADMIN_QUESTIONS, LEGACY_KEYS.QUESTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading questions from localStorage:', e);
    }
    this.saveQuestions(DEFAULT_QUESTIONS);
    return DEFAULT_QUESTIONS;
  },

  saveQuestions(questions) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_QUESTIONS, JSON.stringify(questions));
      return true;
    } catch (e) {
      console.error('Error saving questions to localStorage:', e);
      return false;
    }
  },

  resetQuestionsToDefault() {
    this.saveQuestions(DEFAULT_QUESTIONS);
    return DEFAULT_QUESTIONS;
  },

  // ===================== ADMIN: TRYOUT BATCHES =====================
  getTryoutBatches() {
    try {
      const stored = getWithMigration(STORAGE_KEYS.ADMIN_BATCHES, LEGACY_KEYS.TRYOUT_BATCHES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveTryoutBatch(batch) {
    const list = this.getTryoutBatches();
    const existingIdx = list.findIndex(b => b.id === batch.id);
    if (existingIdx >= 0) {
      list[existingIdx] = batch;
    } else {
      list.unshift(batch);
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_BATCHES, JSON.stringify(list));
    return list;
  },

  deleteTryoutBatch(batchId) {
    const list = this.getTryoutBatches().filter(b => b.id !== batchId);
    localStorage.setItem(STORAGE_KEYS.ADMIN_BATCHES, JSON.stringify(list));
    return list;
  },

  updateBatchQuestions(batchId, questionIds) {
    const list = this.getTryoutBatches();
    const idx = list.findIndex(b => b.id === batchId);
    if (idx >= 0) {
      list[idx].questionIds = questionIds;
      list[idx].totalCount = questionIds.length;
      localStorage.setItem(STORAGE_KEYS.ADMIN_BATCHES, JSON.stringify(list));
    }
    return list;
  },

  // ===================== ADMIN: STUDENT GRADEBOOK =====================
  getStudentList() {
    try {
      const stored = getWithMigration(STORAGE_KEYS.ADMIN_STUDENT_LIST, LEGACY_KEYS.STUDENT_LIST);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveStudentResult(student) {
    const list = this.getStudentList();
    const record = {
      id: student.id || 'std_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      name: student.name || 'Anonim',
      participantNumber: student.participantNumber || '-',
      batchTitle: student.batchTitle || 'Tryout Mandiri',
      batchId: student.batchId || null,
      scoreTWK: Number(student.scoreTWK) || 0,
      scoreTIU: Number(student.scoreTIU) || 0,
      scoreTKP: Number(student.scoreTKP) || 0,
      totalScore: Number(student.totalScore) || 0,
      passedTWK: !!student.passedTWK,
      passedTIU: !!student.passedTIU,
      passedTKP: !!student.passedTKP,
      isPassed: !!student.isPassed,
      timestamp: student.timestamp || new Date().toLocaleString('id-ID')
    };

    const existingIdx = list.findIndex(s => s.id === record.id);
    if (existingIdx >= 0) {
      list[existingIdx] = record;
    } else {
      list.unshift(record);
    }

    localStorage.setItem(STORAGE_KEYS.ADMIN_STUDENT_LIST, JSON.stringify(list));
    return list;
  },

  updateStudentResult(id, updatedFields) {
    const list = this.getStudentList().map(s => {
      if (s.id === id) {
        const merged = { ...s, ...updatedFields };
        merged.totalScore = (Number(merged.scoreTWK) || 0) + (Number(merged.scoreTIU) || 0) + (Number(merged.scoreTKP) || 0);
        merged.passedTWK = merged.scoreTWK >= 65;
        merged.passedTIU = merged.scoreTIU >= 80;
        merged.passedTKP = merged.scoreTKP >= 166;
        merged.isPassed = merged.passedTWK && merged.passedTIU && merged.passedTKP;
        return merged;
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEYS.ADMIN_STUDENT_LIST, JSON.stringify(list));
    return list;
  },

  deleteStudentResult(id) {
    const list = this.getStudentList().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.ADMIN_STUDENT_LIST, JSON.stringify(list));
    return list;
  },

  clearAllStudents() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_STUDENT_LIST);
  },

  exportStudentsCSV(students) {
    const list = students || this.getStudentList();
    const headers = [
      'No',
      'Nama Siswa',
      'No Peserta / Instansi',
      'Paket Tryout',
      'TWK (Ambang 65)',
      'TIU (Ambang 80)',
      'TKP (Ambang 166)',
      'Total Skor (Max 550)',
      'Status Kelulusan',
      'Waktu Pengerjaan'
    ];

    const rows = list.map((s, idx) => [
      idx + 1,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.participantNumber || '').replace(/"/g, '""')}"`,
      `"${(s.batchTitle || '').replace(/"/g, '""')}"`,
      s.scoreTWK,
      s.scoreTIU,
      s.scoreTKP,
      s.totalScore,
      s.isPassed ? 'LOLOS PG' : 'TIDAK LOLOS',
      `"${s.timestamp || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Nilai_SKD_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },

  // ===================== ADMIN: EXAM DURATION =====================
  getExamDuration() {
    const stored = getWithMigration(STORAGE_KEYS.ADMIN_EXAM_DURATION, LEGACY_KEYS.EXAM_DURATION);
    return stored ? parseInt(stored, 10) : 100;
  },

  saveExamDuration(minutes) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_EXAM_DURATION, minutes.toString());
  },

  // ===================== STUDENT & PREVIEW EXAM SESSIONS =====================
  getActiveTryout(isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_ACTIVE_TRYOUT : STORAGE_KEYS.STUDENT_ACTIVE_TRYOUT;
    const legacyKey = isPreview ? null : LEGACY_KEYS.ACTIVE_TRYOUT_BATCH;
    try {
      const stored = getWithMigration(key, legacyKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveActiveTryout(tryout, isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_ACTIVE_TRYOUT : STORAGE_KEYS.STUDENT_ACTIVE_TRYOUT;
    if (!tryout) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(tryout));
    }
  },

  clearActiveTryout(isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_ACTIVE_TRYOUT : STORAGE_KEYS.STUDENT_ACTIVE_TRYOUT;
    localStorage.removeItem(key);
  },

  getActiveStudent() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const sessionStored = sessionStorage.getItem(STORAGE_KEYS.STUDENT_INFO);
        if (sessionStored) return JSON.parse(sessionStored);
      }
      const stored = getWithMigration(STORAGE_KEYS.STUDENT_INFO, LEGACY_KEYS.ACTIVE_STUDENT_INFO);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveActiveStudent(studentInfo) {
    try {
      if (!studentInfo) {
        if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(STORAGE_KEYS.STUDENT_INFO);
        localStorage.removeItem(STORAGE_KEYS.STUDENT_INFO);
      } else {
        // Save to sessionStorage for active tab session without polluting persistent localStorage
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEYS.STUDENT_INFO, JSON.stringify(studentInfo));
        }
        localStorage.removeItem(STORAGE_KEYS.STUDENT_INFO);
      }
    } catch (e) {
      console.error('Error saving active student:', e);
    }
  },

  clearActiveStudent() {
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(STORAGE_KEYS.STUDENT_INFO);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_INFO);
    } catch (e) {}
  },

  getUserAnswers(isPreview = false) {
    if (isPreview) {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.PREVIEW_ANSWERS);
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    }
    try {
      if (typeof sessionStorage !== 'undefined') {
        const sessionStored = sessionStorage.getItem(STORAGE_KEYS.STUDENT_ANSWERS);
        if (sessionStored) return JSON.parse(sessionStored);
      }
      const stored = getWithMigration(STORAGE_KEYS.STUDENT_ANSWERS, LEGACY_KEYS.USER_ANSWERS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  getCurrentIndex(isPreview = false) {
    const key = isPreview ? 'skd_preview_current_index' : 'skd_student_current_index';
    try {
      if (typeof sessionStorage !== 'undefined') {
        const sessionStored = sessionStorage.getItem(key);
        if (sessionStored !== null && sessionStored !== '') return parseInt(sessionStored, 10);
      }
      const stored = localStorage.getItem(key);
      return stored !== null && stored !== '' ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  },

  saveCurrentIndex(idx, isPreview = false) {
    const key = isPreview ? 'skd_preview_current_index' : 'skd_student_current_index';
    try {
      localStorage.setItem(key, idx.toString());
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, idx.toString());
      }
    } catch (e) {}
  },

  saveUserAnswers(answers, isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_ANSWERS : STORAGE_KEYS.STUDENT_ANSWERS;
    try {
      localStorage.setItem(key, JSON.stringify(answers));
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(answers));
      }
    } catch (e) {
      console.error('Error saving answers:', e);
    }
  },

  getUserFlags(isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_FLAGS : STORAGE_KEYS.STUDENT_FLAGS;
    try {
      if (typeof sessionStorage !== 'undefined') {
        const sessionStored = sessionStorage.getItem(key);
        if (sessionStored) return JSON.parse(sessionStored);
      }
      const stored = isPreview ? localStorage.getItem(key) : getWithMigration(key, LEGACY_KEYS.USER_FLAGS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  saveUserFlags(flags, isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_FLAGS : STORAGE_KEYS.STUDENT_FLAGS;
    try {
      localStorage.setItem(key, JSON.stringify(flags));
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(flags));
      }
    } catch (e) {
      console.error('Error saving flags:', e);
    }
  },

  getTimerRemaining(defaultMinutes = 100, isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_TIMER : STORAGE_KEYS.STUDENT_TIMER;
    try {
      if (typeof sessionStorage !== 'undefined') {
        const sessionStored = sessionStorage.getItem(key);
        if (sessionStored !== null && sessionStored !== '') return parseInt(sessionStored, 10);
      }
      const stored = isPreview ? localStorage.getItem(key) : getWithMigration(key, LEGACY_KEYS.EXAM_TIMER);
      if (stored !== null && stored !== '') return parseInt(stored, 10);
      return defaultMinutes * 60;
    } catch {
      return defaultMinutes * 60;
    }
  },

  saveTimerRemaining(seconds, isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_TIMER : STORAGE_KEYS.STUDENT_TIMER;
    try {
      const secStr = seconds.toString();
      localStorage.setItem(key, secStr);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, secStr);
      }
    } catch (e) {}
  },

  getExamStatus(isPreview = false) {
    const key = isPreview ? 'skd_preview_status' : STORAGE_KEYS.STUDENT_STATUS;
    try {
      if (typeof sessionStorage !== 'undefined') {
        const sessionStored = sessionStorage.getItem(key);
        if (sessionStored) return sessionStored;
      }
      const stored = isPreview ? localStorage.getItem(key) : getWithMigration(key, LEGACY_KEYS.EXAM_STATUS);
      return stored || 'not_started';
    } catch {
      return 'not_started';
    }
  },

  saveExamStatus(status, isPreview = false) {
    const key = isPreview ? 'skd_preview_status' : STORAGE_KEYS.STUDENT_STATUS;
    try {
      localStorage.setItem(key, status);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, status);
      }
    } catch (e) {}
  },

  getLastResult(isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_LAST_RESULT : STORAGE_KEYS.STUDENT_LAST_RESULT;
    try {
      if (typeof sessionStorage !== 'undefined') {
        const sessionStored = sessionStorage.getItem(key);
        if (sessionStored) return JSON.parse(sessionStored);
      }
      const stored = isPreview ? localStorage.getItem(key) : getWithMigration(key, LEGACY_KEYS.EXAM_RESULT);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveLastResult(result, isPreview = false) {
    const key = isPreview ? STORAGE_KEYS.PREVIEW_LAST_RESULT : STORAGE_KEYS.STUDENT_LAST_RESULT;
    try {
      localStorage.setItem(key, JSON.stringify(result));
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(result));
      }
    } catch (e) {}
  },

  resetExamSession(isPreview = false) {
    if (isPreview) {
      const keys = [
        STORAGE_KEYS.PREVIEW_ACTIVE_TRYOUT,
        STORAGE_KEYS.PREVIEW_ANSWERS,
        STORAGE_KEYS.PREVIEW_FLAGS,
        STORAGE_KEYS.PREVIEW_TIMER,
        STORAGE_KEYS.PREVIEW_LAST_RESULT,
        'skd_preview_status',
        'skd_preview_current_index'
      ];
      keys.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
        try { if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(k); } catch (e) {}
      });
    } else {
      const keys = [
        STORAGE_KEYS.STUDENT_ANSWERS,
        STORAGE_KEYS.STUDENT_FLAGS,
        STORAGE_KEYS.STUDENT_TIMER,
        STORAGE_KEYS.STUDENT_STATUS,
        STORAGE_KEYS.STUDENT_LAST_RESULT,
        'skd_student_current_index'
      ];
      keys.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
        try { if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(k); } catch (e) {}
      });
    }
  },

  // ===================== SHARED SETTINGS =====================
  getTheme() {
    return getWithMigration(STORAGE_KEYS.SHARED_THEME, LEGACY_KEYS.THEME) || 'light';
  },

  saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.SHARED_THEME, theme);
  },

  getRole() {
    return getWithMigration(STORAGE_KEYS.SHARED_ROLE, LEGACY_KEYS.ROLE);
  },

  saveRole(role) {
    if (!role) {
      localStorage.removeItem(STORAGE_KEYS.SHARED_ROLE);
    } else {
      localStorage.setItem(STORAGE_KEYS.SHARED_ROLE, role);
    }
  },

  clearRole() {
    localStorage.removeItem(STORAGE_KEYS.SHARED_ROLE);
  },

  // ===================== MULTI-ADMIN SYNC =====================
  getAdminSyncPayload() {
    return {
      appName: 'CAT_SKD_SIMULATOR',
      syncVersion: '2.0',
      exportedAt: new Date().toISOString(),
      batches: this.getTryoutBatches(),
      questions: this.getQuestions(),
      templates: this.getQuestionTemplates(),
      students: this.getStudentList(),
      examDuration: this.getExamDuration(),
      adminPin: this.getAdminPin()
    };
  },

  exportAdminSyncFile() {
    const payload = this.getAdminSyncPayload();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CAT_SKD_Admin_Sync_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(dataStr);
  },

  exportAdminSyncCode() {
    const payload = this.getAdminSyncPayload();
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  },

  importAdminSyncData(rawInput, mode = 'merge') {
    try {
      let parsed = null;
      if (typeof rawInput === 'object' && rawInput !== null) {
        parsed = rawInput;
      } else {
        const str = rawInput.trim();
        if (str.startsWith('{') && str.endsWith('}')) {
          parsed = JSON.parse(str);
        } else {
          const decoded = decodeURIComponent(escape(atob(str)));
          parsed = JSON.parse(decoded);
        }
      }

      if (!parsed || (!parsed.batches && !parsed.students && !parsed.questions && !parsed.templates)) {
        throw new Error('Format data sinkronisasi tidak valid.');
      }

      let batchesImported = 0;
      let studentsImported = 0;
      let questionsImported = 0;
      let templatesImported = 0;

      if (mode === 'overwrite') {
        if (Array.isArray(parsed.batches)) {
          localStorage.setItem(STORAGE_KEYS.ADMIN_BATCHES, JSON.stringify(parsed.batches));
          batchesImported = parsed.batches.length;
        }
        if (Array.isArray(parsed.students)) {
          localStorage.setItem(STORAGE_KEYS.ADMIN_STUDENT_LIST, JSON.stringify(parsed.students));
          studentsImported = parsed.students.length;
        }
        if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          this.saveQuestions(parsed.questions);
          questionsImported = parsed.questions.length;
        }
        if (Array.isArray(parsed.templates) && parsed.templates.length > 0) {
          this.saveQuestionTemplates(parsed.templates);
          templatesImported = parsed.templates.length;
        }
        if (parsed.examDuration) {
          this.saveExamDuration(parsed.examDuration);
        }
      } else {
        if (Array.isArray(parsed.batches)) {
          const currentBatches = this.getTryoutBatches();
          const batchMap = new Map(currentBatches.map(b => [b.id, b]));
          parsed.batches.forEach(b => {
            if (!batchMap.has(b.id)) {
              batchMap.set(b.id, b);
              batchesImported++;
            }
          });
          const mergedBatches = Array.from(batchMap.values());
          localStorage.setItem(STORAGE_KEYS.ADMIN_BATCHES, JSON.stringify(mergedBatches));
        }

        if (Array.isArray(parsed.students)) {
          const currentStudents = this.getStudentList();
          const studentMap = new Map(currentStudents.map(s => [s.id, s]));
          parsed.students.forEach(s => {
            if (!studentMap.has(s.id)) {
              studentMap.set(s.id, s);
              studentsImported++;
            }
          });
          const mergedStudents = Array.from(studentMap.values());
          localStorage.setItem(STORAGE_KEYS.ADMIN_STUDENT_LIST, JSON.stringify(mergedStudents));
        }

        if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          const currentQuestions = this.getQuestions();
          const questionMap = new Map(currentQuestions.map(q => [q.id, q]));
          parsed.questions.forEach(q => {
            if (!questionMap.has(q.id)) {
              questionMap.set(q.id, q);
              questionsImported++;
            }
          });
          const mergedQuestions = Array.from(questionMap.values());
          this.saveQuestions(mergedQuestions);
        }

        if (Array.isArray(parsed.templates) && parsed.templates.length > 0) {
          const currentTemplates = this.getQuestionTemplates();
          const tplMap = new Map(currentTemplates.map(t => [t.id, t]));
          parsed.templates.forEach(t => {
            if (!tplMap.has(t.id)) {
              tplMap.set(t.id, t);
              templatesImported++;
            }
          });
          this.saveQuestionTemplates(Array.from(tplMap.values()));
        }
      }

      return {
        success: true,
        stats: {
          batches: batchesImported,
          students: studentsImported,
          questions: questionsImported,
          templates: templatesImported
        }
      };
    } catch (err) {
      console.error('Failed to import admin sync data:', err);
      return {
        success: false,
        error: err.message || 'Gagal memproses data sinkronisasi.'
      };
    }
  },

  exportQuestionsJSON(questions) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Bank_Soal_CAT_SKD_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};
