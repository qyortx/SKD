import React from 'react';

export default function QuestionPalette({
  questions,
  currentIndex,
  userAnswers,
  userFlags,
  onSelectIndex,
  isReviewMode,
  onConfirmFinish,
  isMobileDrawerOpen,
  onCloseDrawer
}) {
  const [filterKey, setFilterKey] = React.useState('all');

  const totalCount = questions.length;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== null && userAnswers[k] !== undefined).length;
  const unansweredCount = totalCount - answeredCount;
  const flaggedCount = Object.keys(userFlags).filter(k => userFlags[k]).length;

  return (
    <aside
      id="question-palette-sidebar"
      className={`palette-sidebar ${isMobileDrawerOpen ? 'drawer-open' : ''}`}
    >
      {/* Header */}
      <div className="palette-header">
        <div className="palette-title-row">
          <h3>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Nomor Soal ({totalCount})</span>
          </h3>
          <button
            className="icon-btn btn-close-drawer"
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
        <div className="filter-tabs-scroll">
          <button
            className={`filter-tab ${filterKey === 'all' ? 'active' : ''}`}
            onClick={() => setFilterKey('all')}
          >
            Semua ({totalCount})
          </button>
          <button
            className={`filter-tab ${filterKey === 'twk' ? 'active' : ''}`}
            onClick={() => setFilterKey('twk')}
          >
            TWK (1-30)
          </button>
          <button
            className={`filter-tab ${filterKey === 'tiu' ? 'active' : ''}`}
            onClick={() => setFilterKey('tiu')}
          >
            TIU (31-65)
          </button>
          <button
            className={`filter-tab ${filterKey === 'tkp' ? 'active' : ''}`}
            onClick={() => setFilterKey('tkp')}
          >
            TKP (66-110)
          </button>
          <button
            className={`filter-tab ${filterKey === 'answered' ? 'active' : ''}`}
            onClick={() => setFilterKey('answered')}
          >
            Sudah ({answeredCount})
          </button>
          <button
            className={`filter-tab ${filterKey === 'unanswered' ? 'active' : ''}`}
            onClick={() => setFilterKey('unanswered')}
          >
            Belum ({unansweredCount})
          </button>
          <button
            className={`filter-tab ${filterKey === 'flagged' ? 'active' : ''}`}
            onClick={() => setFilterKey('flagged')}
          >
            Ragu ({flaggedCount})
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="palette-legend">
        <div className="legend-item">
          <span className="legend-dot dot-unanswered" />
          <span>Belum Dijawab</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-answered" />
          <span>Sudah Dijawab</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-flagged" />
          <span>Ragu-Ragu</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-active" />
          <span>Sedang Aktif</span>
        </div>
      </div>

      {/* Grid 110 Tombol Nomor Soal */}
      <div className="palette-body">
        <div className="question-palette-grid">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
            const isFlagged = !!userFlags[q.id];

            // Filter visibility
            let visible = true;
            if (filterKey === 'twk') visible = q.id <= 30 || q.category === 'TWK';
            else if (filterKey === 'tiu') visible = (q.id >= 31 && q.id <= 65) || q.category === 'TIU';
            else if (filterKey === 'tkp') visible = q.id >= 66 || q.category === 'TKP';
            else if (filterKey === 'answered') visible = isAnswered;
            else if (filterKey === 'unanswered') visible = !isAnswered;
            else if (filterKey === 'flagged') visible = isFlagged;

            if (!visible) return null;

            let classes = ['palette-item'];
            if (isCurrent) classes.push('is-current');

            if (isReviewMode) {
              if (q.id <= 65) {
                if (userAnswers[q.id] === q.correctAnswer) {
                  classes.push('review-num-correct');
                } else {
                  classes.push('review-num-wrong');
                }
              } else {
                const pts = (q.points && q.points[userAnswers[q.id]]) || 0;
                if (pts >= 4) {
                  classes.push('review-num-correct');
                } else {
                  classes.push('review-num-tkp-medium');
                }
              }
            } else {
              if (isFlagged) {
                classes.push('is-flagged');
              } else if (isAnswered) {
                classes.push('is-answered');
              } else {
                classes.push('is-unanswered');
              }
            }

            return (
              <button
                key={q.id}
                type="button"
                className={classes.join(' ')}
                onClick={() => onSelectIndex(idx)}
                title={`Soal No. ${q.id} (${q.category || ''})`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Palette Footer */}
      {!isReviewMode && (
        <div className="palette-footer">
          <button className="btn btn-finish" onClick={onConfirmFinish}>
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
