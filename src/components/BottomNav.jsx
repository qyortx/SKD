import React from 'react';

export default function BottomNav({
  currentIndex,
  totalQuestions,
  isFlagged,
  hasAnswer = false,
  onPrev,
  onNext,
  onToggleFlag,
  onClearAnswer,
  onConfirmFinish,
  isReviewMode,
  onShowResultCard
}) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <nav className="bottom-nav-toolbar bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 mt-4" aria-label="Navigasi Soal">
      <div className="nav-left flex items-center gap-2">
        <button
          className="btn btn-secondary px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-2 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          onClick={onPrev}
          disabled={isFirst}
          title="Shortcut: Panah Kiri atau P"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Soal Sebelumnya</span>
        </button>
      </div>

      <div className="nav-center flex items-center gap-2 flex-wrap">
        {!isReviewMode && (
          <>
            <button
              id="btn-toggle-flag"
              className={`btn btn-nav-flag px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition active:scale-95 ${
                isFlagged
                  ? 'btn-warning active bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 cursor-pointer'
                  : hasAnswer
                  ? 'btn-outline-warning border border-amber-300 dark:border-amber-700/60 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 cursor-pointer'
                  : 'opacity-40 cursor-not-allowed border border-slate-200 dark:border-slate-800 text-slate-400 bg-slate-50 dark:bg-slate-850'
              }`}
              onClick={onToggleFlag}
              disabled={!hasAnswer}
              title={
                !hasAnswer
                  ? 'Pilih jawaban terlebih dahulu untuk menandai ragu-ragu'
                  : isFlagged
                  ? 'Hapus tanda ragu-ragu (Shortcut: R)'
                  : 'Tandai soal ini sebagai ragu-ragu (Shortcut: R)'
              }
            >
              {isFlagged ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v19" />
                  </svg>
                  <span>Ragu-Ragu</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v19" />
                  </svg>
                  <span>Tandai Ragu-Ragu</span>
                </>
              )}
            </button>

            <button
              id="btn-clear-answer"
              className="btn btn-secondary btn-nav-clear px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-2 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              onClick={onClearAnswer}
              disabled={!hasAnswer}
              title={hasAnswer ? "Hapus pilihan jawaban pada soal ini (Shortcut: H atau Delete)" : "Belum ada pilihan jawaban yang dipilih"}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Hapus Pilihan</span>
            </button>
          </>
        )}
      </div>

      <div className="nav-right flex items-center gap-2.5 flex-wrap">
        {!isLast && (
          <button
            className="btn btn-primary px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition active:scale-95 shadow-sm shadow-blue-500/20 cursor-pointer"
            onClick={onNext}
            title="Shortcut: Panah Kanan atau N"
          >
            <span>Soal Berikutnya</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {isReviewMode && (
          <button
            className="btn btn-primary px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition active:scale-95 shadow-sm shadow-blue-500/20 cursor-pointer"
            onClick={onShowResultCard}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            <span>Lihat Kartu Skor</span>
          </button>
        )}
      </div>
    </nav>
  );
}
