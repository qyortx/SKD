import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import QuestionCard from './components/QuestionCard.jsx';
import BottomNav from './components/BottomNav.jsx';
import QuestionPalette from './components/QuestionPalette.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import ResultModal from './components/ResultModal.jsx';
import AdminModal from './components/AdminModal.jsx';
import { Storage } from './utils/storage.js';
import { sounds } from './utils/audio.js';

export default function App() {
  const [questions, setQuestions] = useState(() => Storage.getQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(() => Storage.getUserAnswers());
  const [userFlags, setUserFlags] = useState(() => Storage.getUserFlags());

  const [examDuration, setExamDuration] = useState(() => Storage.getExamDuration());
  const [timerSeconds, setTimerSeconds] = useState(() => Storage.getTimerRemaining());

  const [isReviewMode, setIsReviewMode] = useState(false);
  const [theme, setTheme] = useState(() => Storage.getTheme());
  const [fontSizeLevel, setFontSizeLevel] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [resultData, setResultData] = useState(() => Storage.getLastResult());

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

  // Sync answers and flags to localStorage
  useEffect(() => {
    Storage.saveUserAnswers(userAnswers);
  }, [userAnswers]);

  useEffect(() => {
    Storage.saveUserFlags(userFlags);
  }, [userFlags]);

  // Timer interval effect
  useEffect(() => {
    if (isReviewMode) return;

    const timer = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmitTimeUp();
          return 0;
        }
        const updated = prev - 1;
        Storage.saveTimerRemaining(updated);

        if (updated === 300 || updated === 60) {
          sounds.playWarning();
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isReviewMode]);

  // Keyboard navigation shortcuts
  useEffect(() => {
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
        handleToggleFlag();
      } else if (key === 'H' || e.key === 'Delete') {
        handleClearAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions, isReviewMode]);

  // Handlers
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

  // Kalkulasi Skor Ujian
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
    Storage.saveLastResult(res);
    Storage.saveExamStatus('completed');
    setIsResultOpen(true);

    if (isAllPassed) {
      sounds.playFanfare();
    }
  };

  const handleAutoSubmitTimeUp = () => {
    alert('Waktu ujian telah berakhir! Sistem akan secara otomatis mengumpulkan lembar jawaban Anda.');
    handleCalculateScore();
  };

  const handleStartReview = () => {
    setIsResultOpen(false);
    setIsReviewMode(true);
  };

  const handleRestartExam = () => {
    if (confirm('Apakah Anda yakin ingin memulai ujian baru? Seluruh jawaban Anda akan direset.')) {
      Storage.resetExamSession();
      setUserAnswers({});
      setUserFlags({});
      setIsReviewMode(false);
      setIsResultOpen(false);
      setTimerSeconds(examDuration * 60);
      setCurrentIndex(0);
      window.location.reload();
    }
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

  const currentQ = questions[currentIndex] || questions[0];
  const isCurrentFlagged = currentQ ? !!userFlags[currentQ.id] : false;
  const currentSelectedAnswer = currentQ ? userAnswers[currentQ.id] : undefined;

  const totalCount = questions.length;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== null && userAnswers[k] !== undefined).length;
  const unansweredCount = totalCount - answeredCount;
  const flaggedCount = Object.keys(userFlags).filter(k => userFlags[k]).length;

  return (
    <div className="app-wrapper">
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
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Workspace */}
      <main className="main-workspace">
        <section className="question-column">
          <QuestionCard
            question={currentQ}
            totalQuestions={totalCount}
            selectedAnswer={currentSelectedAnswer}
            onSelectOption={handleSelectOption}
            isReviewMode={isReviewMode}
            fontSizeLevel={fontSizeLevel}
          />

          <BottomNav
            currentIndex={currentIndex}
            totalQuestions={totalCount}
            isFlagged={isCurrentFlagged}
            onPrev={handlePrev}
            onNext={handleNext}
            onToggleFlag={handleToggleFlag}
            onClearAnswer={handleClearAnswer}
            onConfirmFinish={() => setIsConfirmOpen(true)}
            isReviewMode={isReviewMode}
            onShowResultCard={() => setIsResultOpen(true)}
          />
        </section>

        {/* Lembar Nomor Soal (110 Buttons) */}
        <QuestionPalette
          questions={questions}
          currentIndex={currentIndex}
          userAnswers={userAnswers}
          userFlags={userFlags}
          onSelectIndex={handleSelectIndex}
          isReviewMode={isReviewMode}
          onConfirmFinish={() => setIsConfirmOpen(true)}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseDrawer={() => setIsMobileDrawerOpen(false)}
        />
      </main>

      {/* Floating Toggle on Mobile */}
      <button
        className="btn-mobile-palette-toggle"
        onClick={() => setIsMobileDrawerOpen(prev => !prev)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span>Lembar Soal ({answeredCount}/110)</span>
      </button>

      {/* Modal Konfirmasi */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        totalCount={totalCount}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleCalculateScore}
      />

      {/* Modal Hasil Kartu Skor */}
      <ResultModal
        isOpen={isResultOpen}
        result={resultData}
        onClose={() => setIsResultOpen(false)}
        onStartReview={handleStartReview}
        onRestartExam={handleRestartExam}
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
