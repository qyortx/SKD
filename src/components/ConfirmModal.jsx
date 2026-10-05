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
    <div className="modal-backdrop is-open fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="modal-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="modal-header p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Konfirmasi Selesai Ujian</h3>
        </div>
        <div className="modal-body p-5 sm:p-6 flex flex-col gap-4 text-slate-600 dark:text-slate-300 text-sm">
          <p>Apakah Anda yakin ingin menyelesaikan dan mengumpulkan ujian sekarang?</p>

          {/* Rekap Status Jawaban */}
          <div className="summary-stats-grid grid grid-cols-3 gap-3 my-1">
            <div className="summary-stat-box stat-box-answered bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl text-center">
              <div className="stat-val text-2xl font-extrabold">{answeredCount}</div>
              <div className="stat-lbl text-[11px] font-medium opacity-90 mt-0.5">Sudah Terjawab</div>
            </div>
            <div className="summary-stat-box stat-box-unanswered bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 p-3 rounded-xl text-center">
              <div className="stat-val text-2xl font-extrabold">{unansweredCount}</div>
              <div className="stat-lbl text-[11px] font-medium opacity-90 mt-0.5">Belum Dijawab</div>
            </div>
            <div className="summary-stat-box stat-box-flagged bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 p-3 rounded-xl text-center">
              <div className="stat-val text-2xl font-extrabold">{flaggedCount}</div>
              <div className="stat-lbl text-[11px] font-medium opacity-90 mt-0.5">Ragu-Ragu</div>
            </div>
          </div>

          {unansweredCount > 0 ? (
            <div className="alert-box alert-warning flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs sm:text-sm">
              <svg className="flex-shrink-0 text-amber-600 dark:text-amber-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
              </svg>
              <span>
                Perhatian! Masih ada <strong>{unansweredCount} soal</strong> yang belum Anda jawab. Yakin ingin mengakhiri ujian sekarang?
              </span>
            </div>
          ) : flaggedCount > 0 ? (
            <div className="alert-box alert-info flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs sm:text-sm">
              <svg className="flex-shrink-0 text-blue-600 dark:text-blue-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>
                Semua soal sudah terjawab, namun masih ada <strong>{flaggedCount} soal</strong> bertanda ragu-ragu.
              </span>
            </div>
          ) : (
            <div className="alert-box alert-success flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm">
              <svg className="flex-shrink-0 text-emerald-600 dark:text-emerald-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
              </svg>
              <span>
                Luar biasa! Seluruh <strong>{totalCount} soal</strong> telah Anda jawab dengan lengkap.
              </span>
            </div>
          )}
        </div>
        <div className="modal-footer p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button className="btn btn-secondary btn-cancel px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer" onClick={onCancel}>
            Lanjutkan Mengerjakan
          </button>
          <button
            id="btn-confirm-submit"
            className="btn btn-finish btn-confirm px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition active:scale-95 shadow-sm shadow-emerald-500/20 cursor-pointer"
            onClick={onConfirm}
          >
            Ya, Selesaikan Ujian
          </button>
        </div>
      </div>
    </div>
  );
}
