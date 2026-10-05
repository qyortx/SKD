import React from 'react';

export default function ResultModal({
  isOpen,
  result,
  onClose,
  onStartReview,
  onRestartExam,
  studentInfo,
  tryoutTitle,
  isPreviewMode = false,
  onBackToDashboard
}) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !result) return null;

  const handleCopyResultToken = () => {
    const payload = {
      name: studentInfo ? studentInfo.name : 'Peserta Mandiri',
      participantNumber: studentInfo ? studentInfo.participantNumber : '-',
      batchTitle: tryoutTitle || 'Simulasi Mandiri',
      scoreTWK: result.scoreTWK,
      scoreTIU: result.scoreTIU,
      scoreTKP: result.scoreTKP,
      totalScore: result.totalScore,
      passedTWK: result.passedTWK,
      passedTIU: result.passedTIU,
      passedTKP: result.passedTKP,
      isPassed: result.isAllPassed,
      timestamp: result.timestamp || new Date().toLocaleString('id-ID')
    };

    let token = '';
    try {
      token = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    } catch {
      token = btoa(JSON.stringify(payload));
    }
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="modal-backdrop is-open fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="modal-card result-modal-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Hasil Evaluasi Simulasi CAT SKD</h3>
          <button className="icon-btn text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition cursor-pointer" onClick={onClose} aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body p-5 sm:p-6 flex flex-col gap-4 text-sm max-h-[75vh] overflow-y-auto">
          {/* Identitas Peserta & Tryout */}
          {studentInfo && (
            <div className="result-student-header p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
              <div className="result-student-main">
                <span className="result-student-label text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Data Peserta Ujian:</span>
                <h4 className="result-student-name text-base font-bold text-slate-900 dark:text-white">{studentInfo.name}</h4>
                <span className="result-student-id text-xs text-slate-600 dark:text-slate-400">No. Peserta: {studentInfo.participantNumber}</span>
              </div>
              <div className="result-student-side text-right">
                <span className="result-batch-name text-xs font-bold text-blue-600 dark:text-blue-400 block">{tryoutTitle || 'Simulasi CAT SKD Kedinasan'}</span>
                <span className="result-timestamp text-[11px] text-slate-500 dark:text-slate-400">{result.timestamp || new Date().toLocaleString('id-ID')}</span>
              </div>
            </div>
          )}

          {/* Banner Kelulusan */}
          <div className={`result-banner p-4 sm:p-5 rounded-2xl flex items-center gap-4 ${
            result.isAllPassed
              ? 'banner-passed bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'banner-failed bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}>
            <div className="banner-icon flex-shrink-0">
              {result.isAllPassed ? (
                <svg className="text-emerald-600 dark:text-emerald-400" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
                </svg>
              ) : (
                <svg className="text-rose-600 dark:text-rose-400" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <div className="banner-text">
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                {result.isAllPassed
                  ? 'SELAMAT! ANDA LOLOS PASSING GRADE'
                  : 'BELUM MEMENUHI PASSING GRADE'}
              </h3>
              <p className="text-xs sm:text-sm mt-1 opacity-90 leading-relaxed">
                {result.isAllPassed
                  ? 'Nilai Anda berhasil melampaui seluruh ambang batas SKD CAT Kedinasan resmi.'
                  : 'Teruslah berlatih! Jangan patah semangat dan periksa kembali pembahasan soal.'}
              </p>
            </div>
          </div>

          {/* Total Skor */}
          <div className="total-score-showcase p-5 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700 text-center flex flex-col items-center justify-center">
            <div className="showcase-label text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Skor Akhir Anda</div>
            <div className="showcase-score text-5xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight my-1">{result.totalScore}</div>
            <div className="showcase-max text-xs text-slate-500 dark:text-slate-400">Skor Maksimal: 550 Poin | Nilai Ambang Batas Total: 311</div>
          </div>

          {/* Rincian Skor per Kategori */}
          <div className="breakdown-list flex flex-col gap-2.5">
            {/* TWK */}
            <div className="breakdown-card p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              <div className="breakdown-info">
                <span className="breakdown-title text-sm font-bold text-slate-900 dark:text-white block">1. Tes Wawasan Kebangsaan (TWK)</span>
                <span className="breakdown-sub text-xs text-slate-500 dark:text-slate-400">
                  Benar {result.correctTWK} dari 30 soal (Nilai 5 jika benar)
                </span>
              </div>
              <div className="breakdown-score-side text-right flex flex-col items-end">
                <div className="breakdown-score-val text-sm font-bold text-slate-900 dark:text-white font-mono">{result.scoreTWK} / 150</div>
                <span className={`status-pill px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${
                  result.passedTWK
                    ? 'pill-success bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'pill-danger bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  {result.passedTWK ? 'Lolos PG (≥65)' : 'Tidak Lolos (<65)'}
                </span>
              </div>
            </div>

            {/* TIU */}
            <div className="breakdown-card p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              <div className="breakdown-info">
                <span className="breakdown-title text-sm font-bold text-slate-900 dark:text-white block">2. Tes Inteligensia Umum (TIU)</span>
                <span className="breakdown-sub text-xs text-slate-500 dark:text-slate-400">
                  Benar {result.correctTIU} dari 35 soal (Nilai 5 jika benar)
                </span>
              </div>
              <div className="breakdown-score-side text-right flex flex-col items-end">
                <div className="breakdown-score-val text-sm font-bold text-slate-900 dark:text-white font-mono">{result.scoreTIU} / 175</div>
                <span className={`status-pill px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${
                  result.passedTIU
                    ? 'pill-success bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'pill-danger bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  {result.passedTIU ? 'Lolos PG (≥80)' : 'Tidak Lolos (<80)'}
                </span>
              </div>
            </div>

            {/* TKP */}
            <div className="breakdown-card p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              <div className="breakdown-info">
                <span className="breakdown-title text-sm font-bold text-slate-900 dark:text-white block">3. Tes Karakteristik Pribadi (TKP)</span>
                <span className="breakdown-sub text-xs text-slate-500 dark:text-slate-400">
                  Terjawab {result.answeredTKP} dari 45 soal (Skala Poin 1 - 5)
                </span>
              </div>
              <div className="breakdown-score-side text-right flex flex-col items-end">
                <div className="breakdown-score-val text-sm font-bold text-slate-900 dark:text-white font-mono">{result.scoreTKP} / 225</div>
                <span className={`status-pill px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${
                  result.passedTKP
                    ? 'pill-success bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'pill-danger bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  {result.passedTKP ? 'Lolos PG (≥166)' : 'Tidak Lolos (<166)'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5 flex-wrap">
          {isPreviewMode && onBackToDashboard && (
            <button
              className="btn btn-secondary px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              onClick={onBackToDashboard}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Dashboard Admin</span>
            </button>
          )}
          <button className="btn btn-secondary px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer" onClick={() => window.print()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Cetak Hasil</span>
          </button>
          <button
            id="btn-copy-result-token"
            className="btn btn-secondary px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            onClick={handleCopyResultToken}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>{copied ? 'Tersalin!' : 'Salin Token'}</span>
          </button>
          <button className="btn btn-secondary px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer" onClick={onRestartExam}>
            Ujian Ulang
          </button>
          <button
            id="btn-view-review"
            className="btn btn-primary px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm shadow-blue-500/20 cursor-pointer"
            onClick={onStartReview}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Lihat Pembahasan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
