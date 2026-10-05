import React, { useState } from 'react';
import { MathText } from '../utils/mathRenderer.jsx';
import { Storage } from '../utils/storage.js';
import { encodeTryout, buildShareableUrl } from '../utils/tryoutEncoder.js';

export default function BatchQuestionManager({
  batch,
  masterQuestions,
  onBack,
  onBatchUpdated
}) {
  const [currentQuestionIds, setCurrentQuestionIds] = useState(() => batch.questionIds || []);
  const [filterCat, setFilterCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFromBankOpen, setIsAddFromBankOpen] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Map master questions by ID across templates and master bank
  const masterMap = new Map();
  try {
    Storage.getQuestionTemplates().forEach(t => {
      (t.questions || []).forEach(q => {
        if (!masterMap.has(q.id)) masterMap.set(q.id, q);
      });
    });
  } catch (e) {}
  masterQuestions.forEach(q => {
    if (!masterMap.has(q.id)) masterMap.set(q.id, q);
  });
  if (Array.isArray(batch.questions)) {
    batch.questions.forEach(q => {
      if (!masterMap.has(q.id)) masterMap.set(q.id, q);
    });
  }

  // Get active questions in batch
  const batchQuestions = currentQuestionIds.map(id => masterMap.get(id)).filter(Boolean);

  // Filtered batch questions
  const filteredBatchQuestions = batchQuestions.filter(q => {
    const matchesCat = filterCat === 'all' || q.category === filterCat;
    const matchesSearch = !searchQuery.trim() ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.topic && q.topic.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Questions available in bank/templates that are NOT yet in this batch
  const allMasterList = Array.from(masterMap.values());
  const unaddedQuestions = allMasterList.filter(q => !currentQuestionIds.includes(q.id));

  // Save changes to Storage & re-encode link
  const syncBatchChanges = async (newIds) => {
    setCurrentQuestionIds(newIds);
    Storage.updateBatchQuestions(batch.id, newIds);

    // Re-generate URL token with updated question IDs
    const updatedPayload = {
      ...batch,
      questionIds: newIds,
      totalCount: newIds.length
    };
    const newToken = await encodeTryout(updatedPayload);
    const newUrl = buildShareableUrl(newToken);

    const fullUpdatedBatch = {
      ...updatedPayload,
      token: newToken,
      shareUrl: newUrl
    };

    Storage.saveTryoutBatch(fullUpdatedBatch);
    if (onBatchUpdated) onBatchUpdated(fullUpdatedBatch);
    showToast('Daftar soal paket berhasil diperbarui & tautan disinkronkan!');
  };

  // Remove question from batch
  const handleRemoveQuestion = (qId) => {
    const nextIds = currentQuestionIds.filter(id => id !== qId);
    syncBatchChanges(nextIds);
  };

  // Move Question Up/Down
  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentQuestionIds.length) return;
    const copy = [...currentQuestionIds];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    syncBatchChanges(copy);
  };

  // Add selected questions from bank
  const handleConfirmAddSelected = () => {
    if (selectedToAdd.length === 0) {
      showToast('Pilih minimal satu butir soal untuk ditambahkan.');
      return;
    }
    const nextIds = [...currentQuestionIds, ...selectedToAdd];
    syncBatchChanges(nextIds);
    setSelectedToAdd([]);
    setIsAddFromBankOpen(false);
  };

  const toggleSelectToAdd = (qId) => {
    setSelectedToAdd(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const countTWK = batchQuestions.filter(q => q.category === 'TWK').length;
  const countTIU = batchQuestions.filter(q => q.category === 'TIU').length;
  const countTKP = batchQuestions.filter(q => q.category === 'TKP').length;

  return (
    <div className="batch-q-manager-wrapper max-w-[1440px] mx-auto px-4 py-6 w-full font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast-banner fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl font-medium text-sm border border-emerald-500 animate-bounce">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="batch-manager-header flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-6">
        <div className="batch-header-left flex items-start gap-4 flex-wrap">
          <button
            className="btn-back-nav inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95 shadow-sm"
            onClick={onBack}
            title="Kembali ke Daftar Paket"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>Daftar Paket</span>
          </button>
          <div className="batch-title-meta flex flex-col gap-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{batch.title}</h2>
            <div className="batch-meta-pills flex flex-wrap gap-2 text-xs font-semibold">
              <span className="meta-pill px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Durasi: {batch.duration} Menit</span>
              <span className="meta-pill px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Total: {batchQuestions.length} Butir</span>
              <span className="meta-pill pill-twk px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60">TWK: {countTWK}</span>
              <span className="meta-pill pill-tiu px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">TIU: {countTIU}</span>
              <span className="meta-pill pill-tkp px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">TKP: {countTKP}</span>
            </div>
          </div>
        </div>

        <div className="batch-header-actions flex items-center gap-3">
          <button
            className="btn-confirm inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-all active:scale-95"
            onClick={() => setIsAddFromBankOpen(true)}
          >
            <span>+ Tambah Soal dari Bank ({unaddedQuestions.length} Tersedia)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="batch-filter-row flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="cat-filter-tabs flex flex-wrap gap-2">
          <button
            className={`filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${filterCat === 'all' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            onClick={() => setFilterCat('all')}
          >
            Semua ({batchQuestions.length})
          </button>
          <button
            className={`filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${filterCat === 'TWK' ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            onClick={() => setFilterCat('TWK')}
          >
            TWK ({countTWK})
          </button>
          <button
            className={`filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${filterCat === 'TIU' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            onClick={() => setFilterCat('TIU')}
          >
            TIU ({countTIU})
          </button>
          <button
            className={`filter-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${filterCat === 'TKP' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            onClick={() => setFilterCat('TKP')}
          >
            TKP ({countTKP})
          </button>
        </div>

        <div className="batch-search-box flex-1 max-w-xs">
          <input
            type="text"
            className="form-control w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
            placeholder="Cari materi / teks soal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="batch-questions-list flex flex-col gap-3.5">
        {filteredBatchQuestions.length === 0 ? (
          <div className="admin-empty-state text-center py-12 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400">
            <p>Tidak ada butir soal yang sesuai filter.</p>
          </div>
        ) : (
          filteredBatchQuestions.map((q, idx) => (
            <div key={q.id} className="batch-q-card p-4 md:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
              <div className="batch-q-card-head flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="q-badge-group flex items-center gap-2 flex-wrap">
                  <span className="q-order-badge px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900">No. {idx + 1}</span>
                  <span className={`category-tag px-2.5 py-0.5 text-xs font-bold rounded-full uppercase ${
                    q.category === 'TWK'
                      ? 'tag-twk bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                      : q.category === 'TIU'
                      ? 'tag-tiu bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'tag-tkp bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  }`}>
                    {q.category}
                  </span>
                  {q.topic && <span className="topic-badge text-xs font-medium text-slate-500 dark:text-slate-400">{q.topic}</span>}
                </div>
                <div className="q-actions-group flex items-center gap-1.5">
                  <button
                    className="btn-icon-subtle w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
                    title="Geser Naik"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, -1)}
                  >
                    ▲
                  </button>
                  <button
                    className="btn-icon-subtle w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
                    title="Geser Turun"
                    disabled={idx === filteredBatchQuestions.length - 1}
                    onClick={() => handleMove(idx, 1)}
                  >
                    ▼
                  </button>
                  <button
                    className="btn-icon-danger px-3 py-1 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 rounded-lg transition-all active:scale-95"
                    title="Hapus dari Paket ini"
                    onClick={() => handleRemoveQuestion(q.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <div className="batch-q-card-body flex flex-col gap-3">
                <MathText text={q.question} as="div" className="batch-q-text text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed" />
                <div className="batch-q-options-compact grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-2">
                  {['A', 'B', 'C', 'D', 'E'].map(letter => {
                    const optText = q.options ? q.options[letter] : '';
                    if (!optText) return null;
                    const isKey = q.correctAnswer === letter;
                    return (
                      <div
                        key={letter}
                        className={`opt-compact-pill p-2.5 text-xs rounded-xl border flex items-start gap-1.5 leading-snug transition-all ${
                          isKey
                            ? 'is-key bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <strong className="font-bold">{letter}.</strong>
                        <span>{optText.length > 60 ? optText.slice(0, 60) + '...' : optText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: Tambah Soal dari Bank Soal */}
      {isAddFromBankOpen && (
        <div className="modal-backdrop is-open fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsAddFromBankOpen(false)}>
          <div className="modal-dialog modal-add-from-bank bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="modal-header-brand">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pilih Soal dari Bank Master</h3>
              </div>
              <button className="btn-modal-close text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg transition-colors" onClick={() => setIsAddFromBankOpen(false)}>✕</button>
            </div>

            <div className="modal-body p-5 overflow-y-auto flex-1 flex flex-col gap-4">
              <div className="add-bank-notice text-sm text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-3.5 rounded-xl">
                Pilih soal yang ingin dimasukkan ke dalam paket <strong>{batch.title}</strong>:
              </div>

              {unaddedQuestions.length === 0 ? (
                <div className="admin-empty-state text-center py-10 text-slate-500 dark:text-slate-400">
                  <p>Seluruh soal dari Bank Soal telah ada di dalam paket ini.</p>
                </div>
              ) : (
                <div className="unadded-questions-scroll flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {unaddedQuestions.map(q => {
                    const isChecked = selectedToAdd.includes(q.id);
                    return (
                      <label
                        key={q.id}
                        className={`unadded-q-item flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'is-selected border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={isChecked}
                          onChange={() => toggleSelectToAdd(q.id)}
                        />
                        <div className="unadded-q-info flex-1 min-w-0">
                          <div className="unadded-q-head flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`category-tag px-2 py-0.5 text-xs font-bold rounded-full uppercase ${
                              q.category === 'TWK'
                                ? 'tag-twk bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                                : q.category === 'TIU'
                                ? 'tag-tiu bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                                : 'tag-tkp bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            }`}>
                              {q.category}
                            </span>
                            <span className="q-id-ref text-xs font-mono text-slate-500 dark:text-slate-400">ID: #{q.id}</span>
                            {q.topic && <span className="topic-badge text-xs font-medium text-slate-500 dark:text-slate-400">{q.topic}</span>}
                          </div>
                          <div className="unadded-q-text text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                            {q.question.length > 120 ? q.question.slice(0, 120) + '...' : q.question}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="modal-footer-actions flex items-center justify-end gap-3 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                type="button"
                className="btn-cancel px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all active:scale-95"
                onClick={() => setIsAddFromBankOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-confirm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-95"
                onClick={handleConfirmAddSelected}
                disabled={selectedToAdd.length === 0}
              >
                Tambahkan ({selectedToAdd.length}) Soal ke Paket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
