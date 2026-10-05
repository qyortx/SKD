import { DEFAULT_QUESTIONS } from '../data/questionsData.js';

const STORAGE_KEYS = {
  QUESTIONS: 'skd_exam_questions_v1',
  USER_ANSWERS: 'skd_exam_user_answers',
  USER_FLAGS: 'skd_exam_user_flags',
  EXAM_TIMER: 'skd_exam_timer_remaining',
  EXAM_STATUS: 'skd_exam_status',
  EXAM_DURATION: 'skd_exam_duration_minutes',
  THEME: 'skd_exam_theme',
  EXAM_RESULT: 'skd_exam_last_result'
};

export const Storage = {
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

  getUserAnswers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_ANSWERS);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  },

  saveUserAnswers(answers) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(answers));
    } catch (e) {
      console.error('Error saving answers:', e);
    }
  },

  getUserFlags() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_FLAGS);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  },

  saveUserFlags(flags) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_FLAGS, JSON.stringify(flags));
    } catch (e) {
      console.error('Error saving flags:', e);
    }
  },

  getExamDuration() {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM_DURATION);
    return stored ? parseInt(stored, 10) : 100;
  },

  saveExamDuration(minutes) {
    localStorage.setItem(STORAGE_KEYS.EXAM_DURATION, minutes.toString());
  },

  getTimerRemaining() {
    const stored = localStorage.getItem(STORAGE_KEYS.EXAM_TIMER);
    if (stored !== null) {
      return parseInt(stored, 10);
    }
    return this.getExamDuration() * 60;
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

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },

  saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
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
