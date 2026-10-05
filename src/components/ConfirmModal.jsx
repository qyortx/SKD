import React from 'react';

export default function ConfirmModal({
  isOpen,
  totalCount,
  answeredCount,
  unansweredCount,
  flaggedCount,
  onCancel,
  onConfirm
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop is-open" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Konfirmasi Selesai Ujian</h3>
        </div>
        <div className="modal-body">
          <p>Apakah Anda yakin ingin menyelesaikan dan mengumpulkan ujian sekarang?</p>

          {/* Rekap Status Jawaban */}
          <div className="summary-stats-grid">
            <div className="summary-stat-box stat-box-answered">
              <div className="stat-val">{answeredCount}</div>
              <div className="stat-lbl">Sudah Terjawab</div>
            </div>
            <div className="summary-stat-box stat-box-unanswered">
              <div className="stat-val">{unansweredCount}</div>
              <div className="stat-lbl">Belum Dijawab</div>
            </div>
            <div className="summary-stat-box stat-box-flagged">
              <div className="stat-val">{flaggedCount}</div>
              <div className="stat-lbl">Ragu-Ragu</div>
            </div>
          </div>

          {unansweredCount > 0 ? (
            <div className="alert-box alert-warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
              </svg>
              <span>
                Perhatian! Masih ada <strong>{unansweredCount} soal</strong> yang belum Anda jawab. Yakin ingin mengakhiri ujian sekarang?
              </span>
            </div>
          ) : flaggedCount > 0 ? (
            <div className="alert-box alert-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>
                Semua soal sudah terjawab, namun masih ada <strong>{flaggedCount} soal</strong> bertanda ragu-ragu.
              </span>
            </div>
          ) : (
            <div className="alert-box alert-success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
              </svg>
              <span>
                Luar biasa! Seluruh <strong>{totalCount} soal</strong> telah Anda jawab dengan lengkap.
              </span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Lanjutkan Mengerjakan
          </button>
          <button className="btn btn-finish" onClick={onConfirm}>
            Ya, Selesaikan Ujian
          </button>
        </div>
      </div>
    </div>
  );
}
