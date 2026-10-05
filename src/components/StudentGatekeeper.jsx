import React, { useState } from 'react';

export default function StudentGatekeeper({ onSubmitToken, onBackToRoleSelect }) {
  const [tokenInput, setTokenInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setErrorMessage('Silakan tempelkan tautan atau masukkan kode ujian.');
      return;
    }
    setErrorMessage('');
    onSubmitToken(tokenInput.trim());
  };

  return (
    <div className="student-gatekeeper-container min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="student-gatekeeper-card w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
        {/* Empty State Illustration / Icon */}
        <div className="gatekeeper-icon-halo w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>

        <h1 className="gatekeeper-title text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Tidak Ada Ujian Aktif
        </h1>
        <p className="gatekeeper-text text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Anda saat ini belum membuka paket Tryout apa pun. Silakan klik tautan ujian yang dibagikan oleh guru atau pengawas Anda, atau tempelkan tautan/token di bawah ini.
        </p>

        {/* Input Token Form */}
        <form onSubmit={handleSubmit} className="gatekeeper-form w-full mb-6">
          <div className="form-group text-left">
            <label htmlFor="gatekeeper-token-input" className="gatekeeper-label block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Punya Tautan atau Kode Tryout?
            </label>
            <div className="gatekeeper-input-wrapper flex gap-2">
              <input
                id="gatekeeper-token-input"
                type="text"
                className="form-control gatekeeper-input flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tempel link ujian: https://.../?to=... atau kode token"
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
              />
              <button type="submit" className="btn-confirm btn-gatekeeper-submit px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition shadow-sm shadow-blue-500/20 cursor-pointer flex-shrink-0">
                Mulai Ujian
              </button>
            </div>
            {errorMessage && <p className="gatekeeper-error text-xs text-rose-500 font-medium mt-2">{errorMessage}</p>}
          </div>
        </form>

        <div className="gatekeeper-actions">
          <button
            type="button"
            className="btn-text-secondary text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
            onClick={onBackToRoleSelect}
          >
            ← Kembali ke Pemilihan Peran
          </button>
        </div>
      </div>
    </div>
  );
}
