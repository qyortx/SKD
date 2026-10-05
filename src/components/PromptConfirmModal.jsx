import React, { useEffect } from 'react';

export default function PromptConfirmModal({
  isOpen,
  title = 'Konfirmasi Tindakan',
  subtitle = 'Pemberitahuan Sistem CAT SKD',
  message,
  confirmText = 'Lanjutkan',
  cancelText = 'Batal',
  showCancel = true,
  confirmVariant = 'primary', // 'primary' | 'danger' | 'warning' | 'success'
  icon = 'warning', // 'warning' | 'danger' | 'info' | 'logout' | 'success'
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel ? onCancel() : onConfirm && onConfirm();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm ? onConfirm() : onCancel && onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  // Icon Badge Rendering
  let iconNode = null;
  let iconBgClass = 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60';

  if (icon === 'danger') {
    iconBgClass = 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60';
    iconNode = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  } else if (icon === 'warning') {
    iconBgClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
    iconNode = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
      </svg>
    );
  } else if (icon === 'logout') {
    iconBgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    iconNode = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    );
  } else if (icon === 'success') {
    iconBgClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';
    iconNode = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  } else {
    // Default info
    iconNode = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    );
  }

  // Confirm Button Variant Styling
  let confirmBtnClass = 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20';
  if (confirmVariant === 'danger') {
    confirmBtnClass = 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20';
  } else if (confirmVariant === 'warning') {
    confirmBtnClass = 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20';
  } else if (confirmVariant === 'success') {
    confirmBtnClass = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20';
  }

  const handleClose = () => {
    if (onCancel) onCancel();
    else if (onConfirm) onConfirm();
  };

  return (
    <div
      className="modal-backdrop is-open fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-dialog prompt-confirm-dialog bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 sm:p-7 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Icon & Title */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBgClass}`}>
            {iconNode}
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="prompt-modal-title" className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Message Body */}
        <div id="prompt-modal-message" className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          {message}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {showCancel && (
            <button
              id="btn-modal-cancel-action"
              type="button"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer"
              onClick={onCancel || handleClose}
            >
              {cancelText}
            </button>
          )}
          <button
            id="btn-modal-confirm-action"
            type="button"
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95 shadow-sm cursor-pointer ${confirmBtnClass}`}
            onClick={onConfirm || handleClose}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
