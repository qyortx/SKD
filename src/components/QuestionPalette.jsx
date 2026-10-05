import React from 'react';

export default function QuestionPalette({
  questions,
  currentIndex,
  userAnswers,
  userFlags,
  onSelectIndex,
  isReviewMode,
  isPreviewMode = false,
  onConfirmFinish,
  isMobileDrawerOpen,
  onCloseDrawer
}) {
  const [filterKey, setFilterKey] = React.useState('all');

  const totalCount = questions.length;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== null && userAnswers[k] !== undefined).length;
  const unansweredCount = totalCount - answeredCount;
  const flaggedCount = Object.keys(userFlags).filter(k => userFlags[k] && userAnswers[k] !== null && userAnswers[k] !== undefined).length;

  const twkCount = questions.filter(q => q.category === 'TWK' || (q.id <= 30 && !q.category)).length;
  const tiuCount = questions.filter(q => q.category === 'TIU' || (q.id >= 31 && q.id <= 65 && !q.category)).length;
  const tkpCount = questions.filter(q => q.category === 'TKP' || (q.id >= 66 && !q.category)).length;

  return (
    <aside
      id="question-palette-sidebar"
      className={`palette-sidebar w-full lg:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col flex-shrink-0 lg:sticky lg:top-20 max-h-[calc(100vh-6rem)] overflow-hidden transition-all ${
        isMobileDrawerOpen
          ? 'fixed inset-y-0 right-0 z-50 w-80 shadow-2xl flex'
          : 'hidden lg:flex'
      }`}
    >
      {/* Header */}
      <div className="palette-header p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
        <div className="palette-title-row flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Nomor Soal ({totalCount})</span>
          </h3>
          <button
            className="icon-btn btn-close-drawer lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            onClick={onCloseDrawer}
            aria-label="Tutup Lembar Nomor"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs-scroll flex gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            className={`filter-tab px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer transition ${
              filterKey === 'all'
                ? 'active bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            onClick={() => setFilterKey('all')}
          >
            Semua ({totalCount})
          </button>
          <button
            className={`filter-tab px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer transition ${
              filterKey === 'twk'
                ? 'active bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            onClick={() => setFilterKey('twk')}
          >
            TWK ({twkCount})
          </button>
          <button
            className={`filter-tab px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer transition ${
              filterKey === 'tiu'
                ? 'active bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            onClick={() => setFilterKey('tiu')}
          >
            TIU ({tiuCount})
          </button>
          <button
            className={`filter-tab px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer transition ${
              filterKey === 'tkp'
                ? 'active bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            onClick={() => setFilterKey('tkp')}
          >
            TKP ({tkpCount})
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="palette-legend p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
        <div className="legend-item flex items-center gap-1.5">
          <span className="legend-dot dot-unanswered w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
          <span>Belum Dijawab</span>
        </div>
        <div className="legend-item flex items-center gap-1.5">
          <span className="legend-dot dot-answered w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Sudah Dijawab</span>
        </div>
        <div className="legend-item flex items-center gap-1.5">
          <span className="legend-dot dot-flagged w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Ragu-Ragu</span>
        </div>
        <div className="legend-item flex items-center gap-1.5">
          <span className="legend-dot dot-active w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span>Sedang Aktif</span>
        </div>
      </div>

      {/* Grid 110 Tombol Nomor Soal */}
      <div className="palette-body flex-1 overflow-y-auto p-4">
        <div className="question-palette-grid grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
            const isFlagged = !!userFlags[q.id] && isAnswered;

            // Filter visibility
            let visible = true;
            if (filterKey === 'twk') visible = q.id <= 30 || q.category === 'TWK';
            else if (filterKey === 'tiu') visible = (q.id >= 31 && q.id <= 65) || q.category === 'TIU';
            else if (filterKey === 'tkp') visible = q.id >= 66 || q.category === 'TKP';

            if (!visible) return null;

            let itemClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400';

            if (isReviewMode) {
              if (q.id <= 65) {
                if (userAnswers[q.id] === q.correctAnswer) {
                  itemClass = 'btn-palette-correct bg-emerald-500 text-white border-emerald-600';
                } else {
                  itemClass = 'btn-palette-wrong bg-rose-500 text-white border-rose-600';
                }
              } else {
                const pts = (q.points && q.points[userAnswers[q.id]]) || 0;
                if (pts >= 4) {
                  itemClass = 'btn-palette-correct bg-emerald-500 text-white border-emerald-600';
                } else {
                  itemClass = 'btn-palette-tkp bg-amber-500 text-white border-amber-600';
                }
              }
            } else {
              if (isFlagged) {
                itemClass = 'btn-palette-flagged bg-amber-500 text-white border-amber-600';
              } else if (isAnswered) {
                itemClass = 'btn-palette-answered bg-emerald-500 text-white border-emerald-600';
              }
            }

            const currentRing = isCurrent ? 'btn-palette-current ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900 font-extrabold scale-105' : '';

            return (
              <button
                key={q.id || idx}
                type="button"
                className={`palette-item palette-btn h-10 rounded-lg text-xs font-bold flex items-center justify-center transition active:scale-95 cursor-pointer border ${itemClass} ${currentRing}`}
                onClick={() => onSelectIndex(idx)}
                title={`Soal No. ${idx + 1} (${q.category || ''})`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Palette Footer - Hidden in Preview Mode and Review Mode */}
      {!isReviewMode && !isPreviewMode && (
        <div className="palette-footer p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <button
            className="btn btn-finish w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm shadow-emerald-500/20 cursor-pointer"
            onClick={onConfirmFinish}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Kumpulkan Ujian</span>
          </button>
        </div>
      )}
    </aside>
  );
}
