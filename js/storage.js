/**
 * Storage Manager
 * Mengelola penyimpanan lokal (LocalStorage), sinkronisasi bank soal,
 * status jawaban ujian, preferensi pengguna, dan operasi impor/ekspor bank soal.
 */

const STORAGE_KEYS = {
  QUESTIONS: 'skd_exam_questions_v1',
  USER_ANSWERS: 'skd_exam_user_answers',
  USER_FLAGS: 'skd_exam_user_flags',
  EXAM_TIMER: 'skd_exam_timer_remaining',
  EXAM_STATUS: 'skd_exam_status', // 'not_started', 'in_progress', 'completed'
  EXAM_DURATION: 'skd_exam_duration_minutes', // Default 100 minutes
  THEME: 'skd_exam_theme',
  ADMIN_PIN: 'skd_exam_admin_pin',
  EXAM_RESULT: 'skd_exam_last_result'
};

const StorageManager = {
  // ===================== BANK SOAL =====================
  getQuestions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading questions from localStorage:', e);
    }
    // Jika belum ada di localStorage, gunakan DEFAULT_QUESTIONS dari questions-data.js
    this.saveQuestions(DEFAULT_QUESTIONS);
    return DEFAULT_QUESTIONS;
  },

  saveQuestions(questions) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
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

  saveQuestionItem(questionData, isNew = false) {
    const list = this.getQuestions();
    if (isNew) {
      // Tentukan ID baru
      const maxId = list.reduce((max, q) => Math.max(max, q.id || 0), 0);
      questionData.id = maxId + 1;
      list.push(questionData);
    } else {
      const idx = list.findIndex(q => q.id === questionData.id);
      if (idx !== -1) {
        list[idx] = questionData;
      } else {
        list.push(questionData);
      }
    }
    this.saveQuestions(list);
    return list;
  },

  deleteQuestionItem(questionId) {
    let list = this.getQuestions();
    list = list.filter(q => q.id !== questionId);
    // Renomor ulang ID 1..N agar urutan rapi dan konsisten 1..110
    list = list.map((q, idx) => ({
      ...q,
      id: idx + 1
    }));
    this.saveQuestions(list);
    return list;
  },

  // ===================== STATUS JAWABAN PESERTA =====================
  getUserAnswers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_ANSWERS);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  },

  saveUserAnswer(questionId, optionLetter) {
    const answers = this.getUserAnswers();
    if (optionLetter === null || optionLetter === undefined) {
      delete answers[questionId];
    } else {
      answers[questionId] = optionLetter;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(answers));
    } catch (e) {
      console.error('Error saving answer:', e);
    }
    return answers;
  },

  getUserFlags() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_FLAGS);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  },

  toggleUserFlag(questionId) {
    const flags = this.getUserFlags();
    flags[questionId] = !flags[questionId];
    try {
      localStorage.setItem(STORAGE_KEYS.USER_FLAGS, JSON.stringify(flags));
    } catch (e) {
      console.error('Error saving flags:', e);
    }
    return flags[questionId];
  },

  // ===================== TIMER & STATUS UJIAN =====================
  getExamDuration() {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM_DURATION);
    return stored ? parseInt(stored, 10) : 100; // default 100 menit
  },

  saveExamDuration(minutes) {
    localStorage.setItem(STORAGE_KEYS.EXAM_DURATION, minutes.toString());
  },

  getTimerRemaining() {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM_TIMER);
    if (stored !== null) {
      return parseInt(stored, 10);
    }
    return this.getExamDuration() * 60; // detik
  },

  saveTimerRemaining(seconds) {
    localStorage.setItem(STORAGE_KEYS.EXAM_TIMER, seconds.toString());
  },

  getExamStatus() {
    return localStorage.getItem(STORAGE_KEYS.EXAM_STATUS) || 'not_started';
  },

  saveExamStatus(status) {
    localStorage.setItem(STORAGE_KEYS.EXAM_STATUS, status);
  },

  getLastResult() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXAM_RESULT);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  saveLastResult(result) {
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULT, JSON.stringify(result));
  },

  resetExamSession() {
    localStorage.removeItem(STORAGE_KEYS.USER_ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.USER_FLAGS);
    localStorage.removeItem(STORAGE_KEYS.EXAM_TIMER);
    localStorage.removeItem(STORAGE_KEYS.EXAM_STATUS);
    localStorage.removeItem(STORAGE_KEYS.EXAM_RESULT);
  },

  // ===================== TEMA & PENGATURAN =====================
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },

  saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // ===================== EXPORT & IMPORT =====================
  exportQuestionsJSON() {
    const questions = this.getQuestions();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Bank_Soal_CAT_SKD_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importQuestionsJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Validasi struktur minimal
          const valid = parsed.every(q => q.id && q.question && q.options);
          if (!valid) {
            callback({ success: false, message: 'Format JSON tidak valid! Setiap soal harus memiliki id, question, dan options.' });
            return;
          }
          this.saveQuestions(parsed);
          callback({ success: true, count: parsed.length, data: parsed });
        } else {
          callback({ success: false, message: 'File JSON kosong atau bukan array soal.' });
        }
      } catch (err) {
        callback({ success: false, message: 'Gagal mem-parsing file JSON: ' + err.message });
      }
    };
    reader.readAsText(file);
  }
};
