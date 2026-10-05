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
  onOpenAdmin
}) {
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  const totalSeconds = examDuration * 60;
  const remaining = Math.max(0, timerSeconds);
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const pad = (n) => n.toString().padStart(2, '0');
  const timerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  let timerClass = 'timer-badge normal-time';
  if (remaining <= 300) {
    timerClass = 'timer-badge critical-time';
  } else if (remaining <= 600) {
    timerClass = 'timer-badge warning-time';
  }

  const progressPercentage = Math.max(0, Math.min(100, (remaining / totalSeconds) * 100));

  const handleToggleAudio = () => {
    const nextState = sounds.toggle();
    setAudioEnabled(nextState);
  };

  return (
    <>
      {/* Top Progress Bar */}
      <div className="timer-progress-track">
        <div
          className="timer-progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <header className="main-header">
        <div className="header-inner">
          {/* Logo & Identitas */}
          <div className="brand-section">
            <div className="brand-logo-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="brand-titles">
              <h1>SIMULASI CAT SKD</h1>
              <span className="brand-sub">Seleksi Kompetensi Dasar Kedinasan</span>
            </div>
          </div>

          {/* Timer Hitung Mundur & Badge Mode */}
          <div className="header-center">
            <div className="timer-container">
              <div className={timerClass} title="Sisa Waktu Pengerjaan">
                <span className="timer-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <span className="timer-text">{timerText}</span>
              </div>
            </div>
            {isReviewMode && (
              <span className="header-mode-badge" style={{ display: 'inline-flex' }}>
                MODE PEMBAHASAN & REVIEW
              </span>
            )}
          </div>

          {/* Alat Bantu & Tombol Admin */}
          <div className="header-actions">
            <button
              className="icon-btn"
              title="Perkecil Ukuran Huruf (A-)"
              onClick={() => onChangeFontSize(-1)}
              aria-label="Perkecil Font"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19L10 5l6 14M6.5 14h7M18 12h4" />
              </svg>
            </button>
            <button
              className="icon-btn"
              title="Perbesar Ukuran Huruf (A+)"
              onClick={() => onChangeFontSize(1)}
              aria-label="Perbesar Font"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19L10 5l6 14M6.5 14h7M20 9v6M17 12h6" />
              </svg>
            </button>
            <button
              className="icon-btn"
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
              className="icon-btn"
              title="Layar Penuh (CAT Mode)"
              onClick={onToggleFullscreen}
              aria-label="Layar Penuh"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
            <button
              className="icon-btn"
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
            <button
              className="btn-admin-portal"
              title="Buka Panel Administrasi Soal"
              onClick={onOpenAdmin}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Panel Admin</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
