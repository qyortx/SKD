import React, { useState } from "react";
import { Storage } from "../utils/storage.js";

export default function RoleSelection({ onSelectRole, onDirectOpenToken }) {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");

  const handleAdminClick = () => {
    if (Storage.isAdminAuthenticated()) {
      onSelectRole("admin");
    } else {
      setPinInput("");
      setPinError("");
      setIsAdminModalOpen(true);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (Storage.verifyAdminPin(pinInput)) {
      Storage.setAdminAuth(true);
      setPinError("");
      setIsAdminModalOpen(false);
      onSelectRole("admin");
    } else {
      setPinError("PIN Admin salah. Default: admin123");
    }
  };

  const handleStudentDirectToken = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setTokenError("Masukkan tautan atau token ujian terlebih dahulu.");
      return;
    }
    setTokenError("");
    onDirectOpenToken(tokenInput.trim());
  };

  return (
    <div className="role-portal-container min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="role-portal-card-wrapper w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Header Title */}
        <div className="role-portal-header text-center flex flex-col items-center max-w-xl">
          <div className="role-portal-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
            Simulasi CAT SKD Kedinasan
          </div>
          <h1 className="role-portal-title text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pilih Peran Anda
          </h1>
          <p className="role-portal-desc text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Pilih peran untuk masuk ke ruang kerja.
          </p>
        </div>

        {/* Dual Role Grid */}
        <div className="role-grid grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card 1: Admin / Pengawas */}
          <div className="role-card role-card-admin bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="role-card-icon-wrapper role-card-icon-admin w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <div className="role-card-content">
                <h2 className="role-card-heading text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Pengawas & Admin
                </h2>
                <p className="role-card-summary text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Kelola paket Tryout (TO), buat tautan soal untuk siswa, atur
                  durasi, edit butir soal, dan pantau rekapitulasi nilai siswa.
                </p>
              </div>
            </div>

            <button
              className="btn-role-action btn-role-admin w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-sm shadow-blue-500/20 cursor-pointer"
              onClick={handleAdminClick}
            >
              <span>Masuk Sebagai Admin</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Card 2: Siswa / Peserta */}
          <div className="role-card role-card-student bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="role-card-icon-wrapper role-card-icon-student w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div className="role-card-content">
                <h2 className="role-card-heading text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Peserta & Siswa
                </h2>

                {/* Quick Input Token / Link */}
                <form
                  onSubmit={handleStudentDirectToken}
                  className="student-token-form bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 mb-6"
                >
                  <label
                    className="student-token-label block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2"
                    htmlFor="student-token-input"
                  >
                    Punya Tautan / Token Tryout?
                  </label>
                  <div className="student-token-input-group flex gap-2">
                    <input
                      id="student-token-input"
                      type="text"
                      className="student-token-input flex-1 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Tempel tautan atau kode token..."
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn-token-submit px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer"
                      title="Buka Ujian"
                    >
                      Buka
                    </button>
                  </div>
                  {tokenError && (
                    <div className="student-token-error text-xs text-rose-500 font-medium mt-1.5">
                      {tokenError}
                    </div>
                  )}
                </form>
              </div>
            </div>

            <button
              className="btn-role-action btn-role-student w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-sm shadow-emerald-500/20 cursor-pointer"
              onClick={() => onSelectRole("student")}
            >
              <span>Masuk Portal Siswa</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Admin PIN Modal */}
      {isAdminModalOpen && (
        <div
          className="modal-backdrop is-open fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsAdminModalOpen(false)}
        >
          <div
            className="modal-dialog modal-pin-dialog bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="modal-header-brand flex items-center gap-3">
                <div className="modal-logo-icon w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Verifikasi PIN Admin
                </h3>
              </div>
              <button
                className="btn-modal-close text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg transition p-1 rounded-md cursor-pointer"
                onClick={() => setIsAdminModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleAdminSubmit}
              className="modal-body-form p-5 sm:p-6 flex flex-col gap-4"
            >
              <p className="pin-dialog-hint text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Masukkan PIN keamanan untuk mengakses ruang kendali
                pengawas/admin. (Default PIN:{" "}
                <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-bold">
                  admin123
                </code>
                )
              </p>
              <div className="form-group">
                <input
                  id="admin-pin-input"
                  type="password"
                  className="form-control pin-input w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan PIN Admin..."
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                />
              </div>
              {pinError && (
                <div className="pin-error-text text-xs text-rose-500 font-medium">
                  {pinError}
                </div>
              )}
              <div className="modal-footer-actions flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  className="btn-cancel px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition active:scale-95 cursor-pointer"
                  onClick={() => setIsAdminModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  id="btn-submit-admin-pin"
                  type="submit"
                  className="btn-confirm px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold transition shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  Buka Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
