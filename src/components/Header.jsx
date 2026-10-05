import React from 'react';
import { sounds } from '../utils/audio.js';

export default function Header({
  timerSeconds,
  examDuration,
  isReviewMode,
  theme,
  onToggleTheme,
  onToggleFullscreen,
  fontSizeLevel,
  onChangeFontSize,
  onOpenAdmin,
  role = 'student',
  isPreviewMode = false,
  isTimerPaused = false,
  onTogglePauseTimer,
  onSwitchRole,
  onBack,
  activeStudentInfo,
  tryoutTitle
}) {
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  const totalSeconds = examDuration * 60;
  const remaining = Math.max(0, timerSeconds);
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const pad = (n) => n.toString().padStart(2, '0');
  const timerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  let timerColorClass = 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';
  if (remaining <= 300) {
    timerColorClass = 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900 animate-pulse';
  } else if (remaining <= 600) {
    timerColorClass = 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900';
  }

  const progressPercentage = Math.max(0, Math.min(100, (remaining / totalSeconds) * 100));

  const handleToggleAudio = () => {
    const nextState = sounds.toggle();
    setAudioEnabled(nextState);
  };

  return (
    <>
      {/* Top Progress Bar */}
      {!isReviewMode && (
        <div className="timer-progress-track fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-[60]">
          <div
            className="timer-progress-fill h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      <header className="main-header sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors w-full">
        <div className="header-inner w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Logo & Identitas */}
          <div className="brand-section flex-1 flex items-center gap-3 min-w-0">
            {onBack && (
              <button
                className="btn-back-header flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold transition active:scale-95 cursor-pointer"
                onClick={onBack}
                title={isReviewMode ? "Kembali ke Menu Utama" : isPreviewMode ? "Kembali ke Dashboard Admin" : "Kembali / Keluar Ujian"}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                <span>{isReviewMode ? "Menu Utama" : isPreviewMode ? "Dashboard Admin" : "Keluar"}</span>
              </button>
            )}
            <div className="brand-logo-icon w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="brand-titles flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight line-clamp-1">{tryoutTitle || 'SIMULASI CAT SKD'}</h1>
                {isPreviewMode && (
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Preview Pengawas
                  </span>
                )}
              </div>
              <span className="brand-sub text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                {isPreviewMode
                  ? 'Mode Simulasi / Preview Pengawas (Tidak Tercatat di Nilai Siswa)'
                  : activeStudentInfo
                  ? `Peserta: ${activeStudentInfo.name} (${activeStudentInfo.participantNumber})`
                  : 'Seleksi Kompetensi Dasar Kedinasan'}
              </span>
            </div>
          </div>

          {/* Timer Hitung Mundur & Badge Mode */}
          <div className="header-center flex items-center gap-2.5">
            {!isReviewMode ? (
              <div className="timer-container flex items-center gap-2">
                <div className={`timer-badge flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm sm:text-base font-bold font-mono shadow-xs ${timerColorClass}`} title="Sisa Waktu Pengerjaan">
                  <span className="timer-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                  <span className="timer-text">{timerText}</span>
                </div>
                {isPreviewMode && onTogglePauseTimer && (
                  <button
                    type="button"
                    onClick={onTogglePauseTimer}
                    className="pause-timer-btn px-2.5 py-1.5 rounded-full text-xs font-bold border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900 transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    title={isTimerPaused ? "Lanjutkan Timer Simulasi" : "Jeda Waktu Simulasi"}
                  >
                    {isTimerPaused ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        <span>Lanjut</span>
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        <span>Jeda</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="review-mode-indicator flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold shadow-xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Mode Pembahasan</span>
              </div>
            )}
          </div>

          {/* Alat Bantu & Tombol Admin */}
          <div className="header-actions flex-1 flex items-center justify-end gap-1.5 min-w-0">
            <button
              className="icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Perkecil Ukuran Huruf (A-)"
              onClick={() => onChangeFontSize(-1)}
              aria-label="Perkecil Font"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19L10 5l6 14M6.5 14h7M18 12h4" />
              </svg>
            </button>
            <button
              className="icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Perbesar Ukuran Huruf (A+)"
              onClick={() => onChangeFontSize(1)}
              aria-label="Perbesar Font"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19L10 5l6 14M6.5 14h7M20 9v6M17 12h6" />
              </svg>
            </button>
            <button
              className="icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={audioEnabled ? "Suara Efek: Aktif" : "Suara Efek: Nonaktif"}
              onClick={handleToggleAudio}
              aria-label="Toggle Suara"
            >
              {audioEnabled ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>
            <button
              className="icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Layar Penuh (CAT Mode)"
              onClick={onToggleFullscreen}
              aria-label="Layar Penuh"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
            <button
              className="icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Ganti Tema Gelap/Terang"
              onClick={onToggleTheme}
              aria-label="Ganti Tema"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            {!isPreviewMode && onSwitchRole && (
              <button
                className="btn-switch-role-header hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition active:scale-95 cursor-pointer"
                title="Ganti Peran (Admin / Peserta)"
                onClick={onSwitchRole}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4"/></svg>
                <span>Ganti Peran</span>
              </button>
            )}
            {!isPreviewMode && role === 'admin' && onOpenAdmin && (
              <button
                className="btn-admin-portal inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-xs"
                title="Buka Panel Administrasi Soal"
                onClick={onOpenAdmin}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Panel Admin</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
