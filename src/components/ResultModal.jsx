import React from 'react';

export default function ResultModal({
  isOpen,
  result,
  onClose,
  onStartReview,
  onRestartExam
}) {
  if (!isOpen || !result) return null;

  return (
    <div className="modal-backdrop is-open" role="dialog" aria-modal="true">
      <div className="modal-card result-modal-card">
        <div className="modal-header">
          <h3>Hasil Evaluasi Simulasi CAT SKD</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {/* Banner Kelulusan */}
          <div className={`result-banner ${result.isAllPassed ? 'banner-passed' : 'banner-failed'}`}>
            <div className="banner-icon">
              {result.isAllPassed ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <div className="banner-text">
              <h3>
                {result.isAllPassed
                  ? 'SELAMAT! ANDA LOLOS PASSING GRADE'
                  : 'BELUM MEMENUHI PASSING GRADE'}
              </h3>
              <p>
                {result.isAllPassed
                  ? 'Nilai Anda berhasil melampaui seluruh ambang batas SKD CAT Kedinasan resmi.'
                  : 'Teruslah berlatih! Jangan patah semangat dan periksa kembali pembahasan soal.'}
              </p>
            </div>
          </div>

          {/* Total Skor */}
          <div className="total-score-showcase">
            <div className="showcase-label">Total Skor Akhir Anda</div>
            <div className="showcase-score">{result.totalScore}</div>
            <div className="showcase-max">Skor Maksimal: 550 Poin | Nilai Ambang Batas Total: 311</div>
          </div>

          {/* Rincian Skor per Kategori */}
          <div className="breakdown-list">
            {/* TWK */}
            <div className="breakdown-card">
              <div className="breakdown-info">
                <span className="breakdown-title">1. Tes Wawasan Kebangsaan (TWK)</span>
                <span className="breakdown-sub">
                  Benar {result.correctTWK} dari 30 soal (Nilai 5 jika benar)
                </span>
              </div>
              <div className="breakdown-score-side">
                <div className="breakdown-score-val">{result.scoreTWK} / 150</div>
                <span className={`status-pill ${result.passedTWK ? 'pill-success' : 'pill-danger'}`}>
                  {result.passedTWK ? 'Lolos PG (≥65)' : 'Tidak Lolos (<65)'}
                </span>
              </div>
            </div>

            {/* TIU */}
            <div className="breakdown-card">
              <div className="breakdown-info">
                <span className="breakdown-title">2. Tes Inteligensia Umum (TIU)</span>
                <span className="breakdown-sub">
                  Benar {result.correctTIU} dari 35 soal (Nilai 5 jika benar)
                </span>
              </div>
              <div className="breakdown-score-side">
                <div className="breakdown-score-val">{result.scoreTIU} / 175</div>
                <span className={`status-pill ${result.passedTIU ? 'pill-success' : 'pill-danger'}`}>
                  {result.passedTIU ? 'Lolos PG (≥80)' : 'Tidak Lolos (<80)'}
                </span>
              </div>
            </div>

            {/* TKP */}
            <div className="breakdown-card">
              <div className="breakdown-info">
                <span className="breakdown-title">3. Tes Karakteristik Pribadi (TKP)</span>
                <span className="breakdown-sub">
                  Terjawab {result.answeredTKP} dari 45 soal (Skala Poin 1 - 5)
                </span>
              </div>
              <div className="breakdown-score-side">
                <div className="breakdown-score-val">{result.scoreTKP} / 225</div>
                <span className={`status-pill ${result.passedTKP ? 'pill-success' : 'pill-danger'}`}>
                  {result.passedTKP ? 'Lolos PG (≥166)' : 'Tidak Lolos (<166)'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Cetak Hasil</span>
          </button>
          <button className="btn btn-secondary" onClick={onRestartExam}>
            Ujian Ulang
          </button>
          <button className="btn btn-primary" onClick={onStartReview}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Lihat Pembahasan & Kunci</span>
          </button>
        </div>
      </div>
    </div>
  );
}
