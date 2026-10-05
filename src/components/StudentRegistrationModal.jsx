import React, { useState } from 'react';

export default function StudentRegistrationModal({
  isOpen,
  tryoutData,
  onSubmit,
  onCancel
}) {
  const [name, setName] = useState('');
  const [participantNumber, setParticipantNumber] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !tryoutData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Mohon masukkan Nama Lengkap Anda.');
      return;
    }
    if (!participantNumber.trim()) {
      setError('Mohon masukkan Nomor Peserta atau Asal Sekolah/Instansi.');
      return;
    }

    setError('');
    onSubmit({
      name: name.trim(),
      participantNumber: participantNumber.trim()
    });
  };

  const totalQuestions = tryoutData.questions ? tryoutData.questions.length : 110;
  const durationMinutes = tryoutData.duration || 100;

  return (
    <div className="modal-backdrop is-open fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="modal-dialog modal-registration-dialog bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden my-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="modal-header-brand flex items-center gap-3">
            <div className="modal-logo-icon w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Registrasi Peserta Ujian</h3>
              <p className="modal-header-sub text-xs text-slate-500 dark:text-slate-400">Simulasi CAT SKD Kedinasan Resmi</p>
            </div>
          </div>
          {onCancel && (
            <button className="btn-modal-close text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg transition p-1 rounded-md cursor-pointer" onClick={onCancel} title="Tutup">✕</button>
          )}
        </div>

        {/* Tryout Info Summary Card */}
        <div className="registration-tryout-preview m-5 sm:m-6 mb-0 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="tryout-preview-header flex items-center justify-between mb-1.5">
            <span className="tryout-preview-tag text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Paket Tryout Terverifikasi</span>
            <span className="tryout-preview-time text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded">{durationMinutes} Menit</span>
          </div>
          <h4 className="tryout-preview-title text-base font-bold text-slate-900 dark:text-white mb-3">{tryoutData.title || 'Simulasi Mandiri SKD CPNS / Kedinasan'}</h4>
          <div className="tryout-preview-stats grid grid-cols-3 gap-2 border-t border-slate-200/80 dark:border-slate-700/60 pt-3 text-center">
            <div className="preview-stat-item flex flex-col">
              <span className="stat-label text-[11px] text-slate-500 dark:text-slate-400">Total Soal</span>
              <span className="stat-val text-sm font-bold text-slate-900 dark:text-white">{totalQuestions} Butir</span>
            </div>
            <div className="preview-stat-item flex flex-col">
              <span className="stat-label text-[11px] text-slate-500 dark:text-slate-400">Komposisi</span>
              <span className="stat-val text-sm font-bold text-slate-900 dark:text-white">TWK, TIU, TKP</span>
            </div>
            <div className="preview-stat-item flex flex-col">
              <span className="stat-label text-[11px] text-slate-500 dark:text-slate-400">Sistem Skor</span>
              <span className="stat-val text-sm font-bold text-slate-900 dark:text-white">PermenPAN-RB</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="modal-body-form p-5 sm:p-6 flex flex-col gap-4">
          <div className="form-group flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="student-reg-name">
              Nama Lengkap Peserta <span className="text-rose-500">*</span>
            </label>
            <input
              id="student-reg-name"
              type="text"
              className="form-control w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Muhammad Donni Pratama"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label className="form-label text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="student-reg-id">
              Nomor Peserta / Asal Sekolah / Target Instansi <span className="text-rose-500">*</span>
            </label>
            <input
              id="student-reg-id"
              type="text"
              className="form-control w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: SKD-2026-089 / IPDN / STIS"
              value={participantNumber}
              onChange={(e) => setParticipantNumber(e.target.value)}
            />
          </div>

          {error && <div className="pin-error-text text-xs text-rose-500 font-medium">{error}</div>}

          <div className="exam-guidelines-box p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <h5 className="font-bold text-slate-800 dark:text-slate-200">Petunjuk Pelaksanaan Ujian:</h5>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] sm:text-xs">
              <li>Waktu pengerjaan otomatis berjalan sejak tombol Mulai Ujian ditekan.</li>
              <li>Pengerjaan dapat melompat nomor menggunakan panel nomor soal di sebelah kanan.</li>
              <li>Tandai "Ragu-Ragu" untuk soal yang ingin Anda periksa kembali.</li>
              <li>Sistem otomatis mengumpulkan lembar jawaban saat waktu tersisa 00:00:00.</li>
            </ul>
          </div>

          <div className="modal-footer-actions flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {onCancel && (
              <button type="button" className="btn-cancel px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition active:scale-95 cursor-pointer" onClick={onCancel}>
                Batal
              </button>
            )}
            <button type="submit" className="btn-confirm btn-start-exam px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer">
              <span>Mulai Ujian Sekarang</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
