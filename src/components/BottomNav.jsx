import React from 'react';

export default function BottomNav({
  currentIndex,
  totalQuestions,
  isFlagged,
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
    <nav className="bottom-nav-toolbar" aria-label="Navigasi Soal">
      <div className="nav-left">
        <button
          className="btn btn-secondary"
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

      <div className="nav-center">
        {!isReviewMode && (
          <>
            <button
              className={`btn ${isFlagged ? 'btn-warning active' : 'btn-outline-warning'}`}
              onClick={onToggleFlag}
              title="Shortcut: R"
            >
              {isFlagged ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v19" />
                  </svg>
                  <span>Ragu-Ragu (Ditandai)</span>
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
              className="btn btn-secondary"
              onClick={onClearAnswer}
              title="Shortcut: H atau Delete"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Hapus Pilihan</span>
            </button>
          </>
        )}
      </div>

      <div className="nav-right">
        {!isLast ? (
          <button
            className="btn btn-primary"
            onClick={onNext}
            title="Shortcut: Panah Kanan atau N"
          >
            <span>Soal Berikutnya</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : (
          !isReviewMode && (
            <button
              className="btn btn-finish-alt"
              onClick={onConfirmFinish}
            >
              <span>Selesai Ujian</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )
        )}

        {isReviewMode ? (
          <button className="btn btn-primary" onClick={onShowResultCard}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            <span>Lihat Kartu Skor</span>
          </button>
        ) : (
          <button
            className="btn btn-finish"
            onClick={onConfirmFinish}
            title="Selesaikan Ujian Sekarang"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Selesai Ujian</span>
          </button>
        )}
      </div>
    </nav>
  );
}
