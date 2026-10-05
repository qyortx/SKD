import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import QuestionCard from './components/QuestionCard.jsx';
import BottomNav from './components/BottomNav.jsx';
import QuestionPalette from './components/QuestionPalette.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import ResultModal from './components/ResultModal.jsx';
import AdminModal from './components/AdminModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import RoleSelection from './components/RoleSelection.jsx';
import StudentGatekeeper from './components/StudentGatekeeper.jsx';
import StudentRegistrationModal from './components/StudentRegistrationModal.jsx';
import PromptConfirmModal from './components/PromptConfirmModal.jsx';
import { Storage } from './utils/storage.js';
import { sounds } from './utils/audio.js';
import { getTryoutTokenFromUrl, decodeTryout } from './utils/tryoutEncoder.js';
import { HashRouter } from './utils/hashRouter.js';

export default function App() {
  // Role & Session State: 'admin' | 'student' | null
  const [role, setRole] = useState(() => {
    const route = HashRouter.getRoute();
    if (route.path === '/admin') {
      if (Storage.isAdminAuthenticated()) {
        return 'admin';
      }
      HashRouter.navigate('/');
      return null;
    }
    if (route.path === '/student' || route.path === '/exam' || route.path === '/review') return 'student';
    const savedRole = Storage.getRole();
    if (savedRole === 'admin' && !Storage.isAdminAuthenticated()) {
      Storage.clearRole();
      return null;
    }
    return savedRole;
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTryout, setActiveTryout] = useState(() => Storage.getActiveTryout());
  const [activeStudent, setActiveStudent] = useState(() => Storage.getActiveStudent());
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Questions and Exam State
  const [questions, setQuestions] = useState(() => {
    const savedActive = Storage.getActiveTryout();
    if (savedActive && savedActive.questions && savedActive.questions.length > 0) {
      return savedActive.questions;
    }
    return Storage.getQuestions();
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    return Storage.getCurrentIndex ? Storage.getCurrentIndex(false) : 0;
  });
  const [userAnswers, setUserAnswers] = useState(() => Storage.getUserAnswers());
  const [userFlags, setUserFlags] = useState(() => Storage.getUserFlags());

  const [examDuration, setExamDuration] = useState(() => {
    const savedActive = Storage.getActiveTryout();
    if (savedActive && savedActive.duration) {
      return savedActive.duration;
    }
    return Storage.getExamDuration();
  });

  const [timerSeconds, setTimerSeconds] = useState(() => {
    const savedActive = Storage.getActiveTryout();
    const duration = (savedActive && savedActive.duration) ? savedActive.duration : Storage.getExamDuration();
    return Storage.getTimerRemaining(duration);
  });
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const [isReviewMode, setIsReviewMode] = useState(() => {
    const { path } = HashRouter.getRoute();
    if (path === '/review') return true;
    return Storage.getExamStatus() === 'completed';
  });
  const [theme, setTheme] = useState(() => Storage.getTheme());
  const [fontSizeLevel, setFontSizeLevel] = useState(0);

  // Auto-prompt registration if student enters exam without registered identity
  useEffect(() => {
    if (role === 'student' && activeTryout && (!activeStudent || !activeStudent.name)) {
      setIsRegistrationOpen(true);
    }
  }, [role, activeTryout, activeStudent]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [resultData, setResultData] = useState(() => Storage.getLastResult());

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

  // Nilai Ambang Batas Resmi SKD CPNS
  const PASSING_GRADES = {
    TWK: 65,  // Soal 1-30 (Max 150)
    TIU: 80,  // Soal 31-65 (Max 175)
    TKP: 166, // Soal 66-110 (Max 225)
    TOTAL: 311
  };

  // Sync theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.saveTheme(theme);
  }, [theme]);

  // Sync answers, flags, and currentIndex to storage
  useEffect(() => {
    Storage.saveUserAnswers(userAnswers, isPreviewMode);
  }, [userAnswers, isPreviewMode]);

  useEffect(() => {
    Storage.saveUserFlags(userFlags, isPreviewMode);
  }, [userFlags, isPreviewMode]);

  useEffect(() => {
    if (Storage.saveCurrentIndex) {
      Storage.saveCurrentIndex(currentIndex, isPreviewMode);
    }
  }, [currentIndex, isPreviewMode]);

  // Handle URL token on mount: ?to=... or #to=...
  useEffect(() => {
    const urlToken = getTryoutTokenFromUrl();
    if (urlToken) {
      handleLoadTryoutFromToken(urlToken);
    }
  }, []);

  // Listen to browser Back/Forward (hashchange) and sync on mount
  useEffect(() => {
    const handleHashSync = () => {
      const { path } = HashRouter.getRoute();
      if (path === '/admin') {
        if (Storage.isAdminAuthenticated()) {
          setIsPreviewMode(false);
          setRole('admin');
          Storage.saveRole('admin');
        } else {
          // Unauthorized student/guest attempting to access /admin
          setIsPreviewMode(false);
          setRole(null);
          Storage.clearRole();
          HashRouter.navigate('/');
        }
      } else if (path === '/student') {
        setRole('student');
        Storage.saveRole('student');
      } else if (path === '/exam') {
        setRole('student');
        Storage.saveRole('student');
        setIsReviewMode(false);
      } else if (path === '/review') {
        setRole('student');
        Storage.saveRole('student');
        setIsReviewMode(true);
      } else if (path === '/' || path === '') {
        setIsPreviewMode(false);
        setRole(null);
        Storage.clearRole();
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Timer interval effect (runs only during active exam, paused during registration)
  useEffect(() => {
    if (role !== 'student' || !activeTryout || isReviewMode || isTimerPaused || isRegistrationOpen) return;

    const timer = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isPreviewMode) {
            handleAutoSubmitTimeUp();
          }
          return 0;
        }
        const updated = prev - 1;
        Storage.saveTimerRemaining(updated, isPreviewMode);

        if (!isPreviewMode && (updated === 300 || updated === 60)) {
          sounds.playWarning();
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [role, activeTryout, isReviewMode, isPreviewMode, isTimerPaused, isRegistrationOpen]);

  // Flush remaining state to storage on tab close or reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (role === 'student' && activeTryout && !isReviewMode) {
        Storage.saveTimerRemaining(timerSeconds, isPreviewMode);
        Storage.saveCurrentIndex(currentIndex, isPreviewMode);
        Storage.saveUserAnswers(userAnswers, isPreviewMode);
        Storage.saveUserFlags(userFlags, isPreviewMode);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [role, activeTryout, isReviewMode, timerSeconds, currentIndex, userAnswers, userFlags, isPreviewMode]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (role !== 'student' || !activeTryout) return;

    const handleKeyDown = (e) => {
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(key)) {
        handleSelectOption(key);
      } else if (['1', '2', '3', '4', '5'].includes(key)) {
        const map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E' };
        handleSelectOption(map[key]);
      } else if (e.key === 'ArrowRight' || key === 'N') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || key === 'P') {
        handlePrev();
      } else if (key === 'R') {
        const currentQ = questions[currentIndex];
        if (currentQ && userAnswers[currentQ.id] !== undefined && userAnswers[currentQ.id] !== null) {
          handleToggleFlag();
        }
      } else if (key === 'H' || e.key === 'Delete') {
        const currentQ = questions[currentIndex];
        if (currentQ && userAnswers[currentQ.id] !== undefined && userAnswers[currentQ.id] !== null) {
          handleClearAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [role, activeTryout, currentIndex, questions, userAnswers, isReviewMode]);

  // Resolve and unpack a Tryout token
  const handleLoadTryoutFromToken = async (rawToken) => {
    try {
      // Strip potential URL wrapper if user pasted full URL
      let token = rawToken.trim();
      if (token.includes('?to=')) {
        token = token.split('?to=')[1].split('&')[0];
      } else if (token.includes('#to=')) {
        token = token.split('#to=')[1].split('&')[0];
      }
      token = decodeURIComponent(token);

      const decoded = await decodeTryout(token);
      if (!decoded) {
        showAlert({
          title: 'Tautan Tidak Valid',
          message: 'Tautan atau token Tryout tidak valid. Silakan periksa kembali tautan yang Anda terima.',
          icon: 'danger',
          confirmVariant: 'danger'
        });
        return;
      }

      // Resolve questions
      let examQuestions = [];
      if (decoded.questions && Array.isArray(decoded.questions) && decoded.questions.length > 0) {
        examQuestions = decoded.questions;
      } else {
        const idMap = new Map();
        // Index questions from all admin templates and master bank
        try {
          Storage.getQuestionTemplates().forEach(t => {
            (t.questions || []).forEach(q => {
              if (!idMap.has(q.id)) idMap.set(q.id, q);
            });
          });
        } catch (e) {}
        Storage.getQuestions().forEach(q => {
          if (!idMap.has(q.id)) idMap.set(q.id, q);
        });

        if (decoded.questionIds && Array.isArray(decoded.questionIds) && decoded.questionIds.length > 0) {
          examQuestions = decoded.questionIds.map(id => idMap.get(id)).filter(Boolean);
        }
      }

      if (examQuestions.length === 0) {
        examQuestions = Storage.getQuestions();
      }

      const duration = decoded.duration || 100;
      const batchData = {
        id: decoded.id || 'to_' + Date.now().toString(36),
        title: decoded.title || 'Simulasi CAT SKD Kedinasan',
        duration: duration,
        questions: examQuestions
      };

      // Check if student was ALREADY working on this same tryout
      const currentActive = Storage.getActiveTryout();
      const isSameTryout = currentActive && (currentActive.id === batchData.id || currentActive.title === batchData.title);
      const existingAnswers = Storage.getUserAnswers();
      const hasExistingAnswers = Object.keys(existingAnswers).length > 0;
      const existingTimer = Storage.getTimerRemaining(duration);
      const isTimerOngoing = existingTimer > 0 && existingTimer < duration * 60;
      const existingStatus = Storage.getExamStatus();

      if (isSameTryout && (hasExistingAnswers || isTimerOngoing || existingStatus === 'in_progress')) {
        // RESUME active tryout! DO NOT wipe answers, flags, or timer on reload!
        setActiveTryout(batchData);
        setQuestions(batchData.questions || examQuestions);
        setExamDuration(duration);
        setTimerSeconds(existingTimer);
        setUserAnswers(existingAnswers);
        setUserFlags(Storage.getUserFlags());
        const savedIdx = Storage.getCurrentIndex ? Storage.getCurrentIndex() : 0;
        setCurrentIndex(savedIdx);
        setRole('student');
        Storage.saveRole('student');
        HashRouter.navigate(existingStatus === 'completed' ? '/review' : '/exam');

        // Clean up URL query (?to=...) quietly so refreshes don't re-trigger decoding
        try {
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, '', cleanUrl);
        } catch (e) {}
        return;
      }

      // Fresh tryout session handler
      const initializeFreshSession = () => {
        Storage.resetExamSession();
        setActiveTryout(batchData);
        Storage.saveActiveTryout(batchData);
        setQuestions(examQuestions);
        setExamDuration(duration);
        setTimerSeconds(duration * 60);
        Storage.saveExamDuration(duration);
        Storage.saveTimerRemaining(duration * 60);
        Storage.saveExamStatus('in_progress');

        setUserAnswers({});
        setUserFlags({});
        Storage.saveUserAnswers({});
        Storage.saveUserFlags({});
        setCurrentIndex(0);
        if (Storage.saveCurrentIndex) Storage.saveCurrentIndex(0);

        try {
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, '', cleanUrl);
        } catch (e) {}

        setRole('student');
        Storage.saveRole('student');
        HashRouter.navigate('/exam');

        const existingStudent = Storage.getActiveStudent();
        if (!existingStudent || !existingStudent.name) {
          setIsRegistrationOpen(true);
        }
      };

      // Check if student was in the middle of a different tryout
      if (currentActive && currentActive.id !== batchData.id && (hasExistingAnswers || isTimerOngoing)) {
        showConfirm({
          title: 'Ganti Paket Ujian?',
          message: `Anda sedang mengerjakan paket "${currentActive.title}". Membuka paket baru "${batchData.title}" akan mereset lembar jawaban ujian sebelumnya. Apakah Anda ingin melanjutkan?`,
          confirmText: 'Buka Paket Baru',
          cancelText: 'Lanjutkan Ujian Lama',
          confirmVariant: 'danger',
          icon: 'warning',
          onConfirm: initializeFreshSession
        });
        return;
      }

      initializeFreshSession();
    } catch (err) {
      console.error('Failed to load tryout from token:', err);
      showAlert({
        title: 'Gagal Memproses Paket',
        message: 'Gagal memproses paket ujian dari tautan. Pastikan token lengkap dan tidak terpotong.',
        icon: 'danger',
        confirmVariant: 'danger'
      });
    }
  };

  // Role Selection Handlers
  const handleSelectRole = (newRole) => {
    setIsPreviewMode(false);
    setRole(newRole);
    Storage.saveRole(newRole);
    if (newRole === 'admin') {
      HashRouter.navigate('/admin');
    } else if (newRole === 'student') {
      HashRouter.navigate(activeTryout ? '/exam' : '/student');
    } else {
      HashRouter.navigate('/');
    }
  };

  const handleSwitchRole = () => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
      Storage.resetExamSession(true);
      setActiveStudent(Storage.getActiveStudent());
      setActiveTryout(Storage.getActiveTryout());
      setUserAnswers(Storage.getUserAnswers());
      setUserFlags(Storage.getUserFlags());
    }
    setRole(null);
    Storage.clearRole();
    HashRouter.navigate('/');
  };

  const handleLogoutAdmin = () => {
    setIsPreviewMode(false);
    Storage.logoutAdmin();
    setRole(null);
    Storage.clearRole();
    HashRouter.navigate('/');
  };

  const handleStudentBack = () => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
      setIsTimerPaused(false);
      Storage.resetExamSession(true);
      const savedStudent = Storage.getActiveStudent();
      setActiveStudent(savedStudent);
      const savedTryout = Storage.getActiveTryout();
      setActiveTryout(savedTryout);
      if (savedTryout && savedTryout.questions && savedTryout.questions.length > 0) {
        setQuestions(savedTryout.questions);
      } else {
        setQuestions(Storage.getQuestions());
      }
      setUserAnswers(Storage.getUserAnswers());
      setUserFlags(Storage.getUserFlags());
      setRole('admin');
      Storage.saveRole('admin');
      HashRouter.navigate('/admin');
      return;
    }
    if (isReviewMode) {
      setIsReviewMode(false);
      handleSwitchRole();
      return;
    }
    showConfirm({
      title: 'Keluar dari Ruang Ujian?',
      message: 'Keluar dari ruang ujian dan kembali ke pemilihan peran? Jawaban saat ini tetap tersimpan di perangkat ini.',
      confirmText: 'Ya, Keluar',
      cancelText: 'Lanjutkan Ujian',
      confirmVariant: 'warning',
      icon: 'logout',
      onConfirm: () => {
        handleSwitchRole();
      }
    });
  };

  // Preview Tryout from Admin
  const handlePreviewTryoutFromAdmin = (batch) => {
    let examQuestions = [];

    if (batch.questions && Array.isArray(batch.questions) && batch.questions.length > 0) {
      examQuestions = batch.questions;
    } else if (batch.questionIds && Array.isArray(batch.questionIds) && batch.questionIds.length > 0) {
      const defaultBank = Storage.getQuestions();
      const templates = Storage.getQuestionTemplates ? Storage.getQuestionTemplates() : [];
      const templateQuestions = templates.flatMap(t => t.questions || []);
      const allKnown = [...defaultBank, ...templateQuestions];
      const idMap = new Map();
      allKnown.forEach(q => {
        idMap.set(q.id, q);
        idMap.set(String(q.id), q);
      });
      examQuestions = batch.questionIds.map(id => idMap.get(id) || idMap.get(String(id))).filter(Boolean);
    }
    if (!examQuestions || examQuestions.length === 0) {
      examQuestions = Storage.getQuestions();
    }

    const duration = batch.duration || 100;
    const batchData = {
      id: batch.id,
      title: batch.title,
      duration: duration,
      questions: examQuestions
    };

    setIsPreviewMode(true);
    setIsTimerPaused(false);
    setActiveTryout(batchData);
    Storage.saveActiveTryout(batchData, true);
    setQuestions(examQuestions);
    setExamDuration(duration);
    setTimerSeconds(duration * 60);
    Storage.saveTimerRemaining(duration * 60, true);
    setCurrentIndex(0);
    setUserAnswers({});
    setUserFlags({});
    Storage.saveUserAnswers({}, true);
    Storage.saveUserFlags({}, true);

    // Set preview student info in state only (DO NOT call Storage.saveActiveStudent!)
    setActiveStudent({
      name: 'Pengawas (Mode Preview)',
      participantNumber: 'ADMIN-PREVIEW'
    });

    setIsReviewMode(false);
    setRole('student');
    setIsRegistrationOpen(false);
    HashRouter.navigate('/exam');
  };

  // Student Registration Submission
  const handleStudentRegister = (studentData) => {
    setActiveStudent(studentData);
    Storage.saveActiveStudent(studentData);
    Storage.saveExamStatus('in_progress', isPreviewMode);
    setIsRegistrationOpen(false);
    sounds.playSelect();
  };

  // Handlers for Exam Operations
  const handleSelectOption = (letter) => {
    if (isReviewMode) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    sounds.playSelect();
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: letter
    }));
  };

  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    // CAT Rule: Cannot mark ragu-ragu if no answer option has been selected
    const answer = userAnswers[currentQ.id];
    if (answer === undefined || answer === null) {
      sounds.playWarning();
      return;
    }

    sounds.playClick();
    setUserFlags(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleClearAnswer = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    sounds.playClick();
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });

    // CAT Rule: If an answer is cleared, ragu-ragu flag must also be cleared
    setUserFlags(prev => {
      if (!prev[currentQ.id]) return prev;
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      sounds.playClick();
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sounds.playClick();
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSelectIndex = (idx) => {
    sounds.playClick();
    setCurrentIndex(idx);
    setIsMobileDrawerOpen(false);
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleChangeFontSize = (step) => {
    setFontSizeLevel(prev => Math.max(-1, Math.min(2, prev + step)));
  };

  // Score Calculation
  const handleCalculateScore = () => {
    setIsConfirmOpen(false);

    let scoreTWK = 0;
    let scoreTIU = 0;
    let scoreTKP = 0;

    let correctTWK = 0;
    let correctTIU = 0;
    let answeredTWK = 0;
    let answeredTIU = 0;
    let answeredTKP = 0;

    questions.forEach(q => {
      const userAns = userAnswers[q.id];
      const isAns = userAns !== undefined && userAns !== null;

      if (q.id <= 30 || q.category === 'TWK') {
        if (isAns) {
          answeredTWK++;
          if (userAns === q.correctAnswer) {
            scoreTWK += 5;
            correctTWK++;
          }
        }
      } else if (q.id <= 65 || q.category === 'TIU') {
        if (isAns) {
          answeredTIU++;
          if (userAns === q.correctAnswer) {
            scoreTIU += 5;
            correctTIU++;
          }
        }
      } else {
        // TKP 66-110: Poin 1 sampai 5
        if (isAns) {
          answeredTKP++;
          const pts = (q.points && q.points[userAns] !== undefined) ? q.points[userAns] : 0;
          scoreTKP += pts;
        }
      }
    });

    const totalScore = scoreTWK + scoreTIU + scoreTKP;
    const passedTWK = scoreTWK >= PASSING_GRADES.TWK;
    const passedTIU = scoreTIU >= PASSING_GRADES.TIU;
    const passedTKP = scoreTKP >= PASSING_GRADES.TKP;
    const isAllPassed = passedTWK && passedTIU && passedTKP;

    const res = {
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
      timestamp: new Date().toLocaleString('id-ID')
    };

    setResultData(res);
    Storage.saveLastResult(res, isPreviewMode);
    Storage.saveExamStatus('completed', isPreviewMode);

    // Student results are displayed on their screen and manually inputted/imported by Admin
    setIsResultOpen(true);

    if (isAllPassed) {
      sounds.playFanfare();
    }
  };

  const handleAutoSubmitTimeUp = () => {
    showAlert({
      title: 'Waktu Ujian Berakhir',
      message: 'Waktu ujian telah berakhir! Lembar jawaban Anda telah dikumpulkan secara otomatis oleh sistem.',
      icon: 'warning',
      confirmVariant: 'warning',
      confirmText: 'Lihat Hasil Skor'
    });
    handleCalculateScore();
  };

  const handleStartReview = () => {
    setIsResultOpen(false);
    setIsReviewMode(true);
    setCurrentIndex(0);
    HashRouter.navigate('/review');
  };

  const handleRestartExam = () => {
    showConfirm({
      title: 'Mulai Ujian Baru?',
      message: 'Seluruh jawaban dan progres Anda pada sesi ujian ini akan direset. Apakah Anda yakin ingin memulai kembali dari awal?',
      confirmText: 'Ya, Reset Ujian',
      cancelText: 'Batal',
      confirmVariant: 'danger',
      icon: 'danger',
      onConfirm: () => {
        closeConfirm();
        Storage.resetExamSession(isPreviewMode);
        setUserAnswers({});
        setUserFlags({});
        setIsReviewMode(false);
        setIsResultOpen(false);
        setTimerSeconds(examDuration * 60);
        setCurrentIndex(0);
        HashRouter.navigate('/exam');
      }
    });
  };

  // Update questions from admin
  const handleUpdateQuestions = (updatedList) => {
    setQuestions(updatedList);
    Storage.saveQuestions(updatedList);
  };

  // Update duration from admin
  const handleUpdateDuration = (mins) => {
    setExamDuration(mins);
    Storage.saveExamDuration(mins);
    setTimerSeconds(mins * 60);
  };

  // VIEW 1: ROLE SELECTION SCREEN
  if (!role) {
    return (
      <RoleSelection
        onSelectRole={handleSelectRole}
        onDirectOpenToken={handleLoadTryoutFromToken}
      />
    );
  }

  // VIEW 2: ADMIN DASHBOARD
  if (role === 'admin') {
    return (
      <AdminDashboard
        questions={questions}
        onUpdateQuestions={handleUpdateQuestions}
        examDuration={examDuration}
        onUpdateDuration={handleUpdateDuration}
        onLogoutAdmin={handleLogoutAdmin}
        onPreviewTryout={handlePreviewTryoutFromAdmin}
        onBackToPortal={handleSwitchRole}
      />
    );
  }

  // VIEW 3: STUDENT GATEKEEPER (When student has no active Tryout loaded)
  if (role === 'student' && !activeTryout) {
    return (
      <StudentGatekeeper
        onSubmitToken={handleLoadTryoutFromToken}
        onBackToRoleSelect={handleSwitchRole}
      />
    );
  }

  // VIEW 4: STUDENT EXAM WORKSPACE
  const currentQ = questions[currentIndex] || questions[0];
  const currentSelectedAnswer = currentQ ? userAnswers[currentQ.id] : undefined;
  const hasCurrentAnswer = currentSelectedAnswer !== undefined && currentSelectedAnswer !== null;
  const isCurrentFlagged = currentQ ? (!!userFlags[currentQ.id] && hasCurrentAnswer) : false;

  const totalCount = questions.length;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== null && userAnswers[k] !== undefined).length;
  const unansweredCount = totalCount - answeredCount;
  const flaggedCount = Object.keys(userFlags).filter(k => userFlags[k] && userAnswers[k] !== null && userAnswers[k] !== undefined).length;

  return (
    <div className="app-wrapper flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Header Bar */}
      <Header
        timerSeconds={timerSeconds}
        examDuration={examDuration}
        isReviewMode={isReviewMode}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onToggleFullscreen={handleToggleFullscreen}
        fontSizeLevel={fontSizeLevel}
        onChangeFontSize={handleChangeFontSize}
        onOpenAdmin={null}
        role={isPreviewMode ? 'admin' : 'student'}
        isPreviewMode={isPreviewMode}
        isTimerPaused={isTimerPaused}
        onTogglePauseTimer={() => setIsTimerPaused(prev => !prev)}
        onSwitchRole={null}
        onBack={handleStudentBack}
        activeStudentInfo={activeStudent}
        tryoutTitle={activeTryout?.title}
      />

      {/* Main Workspace */}
      <main className="main-workspace w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col lg:flex-row gap-6 items-start">
        <section className="question-column flex-1 w-full min-w-0 flex flex-col gap-6">
          <QuestionCard
            question={currentQ}
            totalQuestions={totalCount}
            currentIndex={currentIndex}
            selectedAnswer={currentSelectedAnswer}
            onSelectOption={handleSelectOption}
            isReviewMode={isReviewMode}
            isPreviewMode={isPreviewMode}
            fontSizeLevel={fontSizeLevel}
          />

          <BottomNav
            currentIndex={currentIndex}
            totalQuestions={totalCount}
            isFlagged={isCurrentFlagged}
            hasAnswer={hasCurrentAnswer}
            onPrev={handlePrev}
            onNext={handleNext}
            onToggleFlag={handleToggleFlag}
            onClearAnswer={handleClearAnswer}
            onConfirmFinish={() => setIsConfirmOpen(true)}
            isReviewMode={isReviewMode}
            onShowResultCard={() => setIsResultOpen(true)}
          />
        </section>

        {/* Lembar Nomor Soal (Palette) */}
        <QuestionPalette
          questions={questions}
          currentIndex={currentIndex}
          userAnswers={userAnswers}
          userFlags={userFlags}
          onSelectIndex={handleSelectIndex}
          isReviewMode={isReviewMode}
          isPreviewMode={isPreviewMode}
          onConfirmFinish={() => setIsConfirmOpen(true)}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseDrawer={() => setIsMobileDrawerOpen(false)}
        />
      </main>

      {/* Floating Toggle on Mobile */}
      <button
        className="btn-mobile-palette-toggle lg:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 text-sm font-semibold active:scale-95 transition-all"
        onClick={() => setIsMobileDrawerOpen(prev => !prev)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span>Lembar Soal ({answeredCount}/{totalCount})</span>
      </button>

      {/* Modal Registrasi Peserta Sebelum Ujian */}
      <StudentRegistrationModal
        isOpen={isRegistrationOpen}
        tryoutData={activeTryout}
        onSubmit={handleStudentRegister}
        onCancel={() => {
          setIsRegistrationOpen(false);
          if (!activeStudent || !activeStudent.name) {
            handleSwitchRole();
          }
        }}
      />

      {/* Modal Konfirmasi Selesai Ujian */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        totalCount={totalCount}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleCalculateScore}
      />

      {/* Modal Konfirmasi Tindakan / Dialog (Pengganti window.confirm & alert) */}
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

      {/* Modal Hasil Kartu Skor */}
      <ResultModal
        isOpen={isResultOpen}
        result={resultData}
        onClose={() => setIsResultOpen(false)}
        onStartReview={handleStartReview}
        onRestartExam={handleRestartExam}
        studentInfo={activeStudent}
        tryoutTitle={activeTryout?.title}
        isPreviewMode={isPreviewMode}
        onBackToDashboard={handleStudentBack}
      />

      {/* Modal Admin Kelola Soal & Kunci Jawaban */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        questions={questions}
        onUpdateQuestions={handleUpdateQuestions}
        examDuration={examDuration}
        onUpdateDuration={handleUpdateDuration}
      />
    </div>
  );
}
