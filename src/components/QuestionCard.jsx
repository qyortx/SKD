import React, { useState } from 'react';
import { MathText } from '../utils/mathRenderer.jsx';

export default function QuestionCard({
  question,
  totalQuestions,
  currentIndex,
  selectedAnswer,
  onSelectOption,
  isReviewMode,
  isPreviewMode = false,
  fontSizeLevel
}) {
  const [zoomImageData, setZoomImageData] = useState(null);
  const [copiedToast, setCopiedToast] = useState('');
  const [showPreviewKey, setShowPreviewKey] = useState(false);

  if (!question) return null;

  const fontClasses = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
  const textClass = fontClasses[fontSizeLevel + 1] || 'text-base';

  const isSingleScoring = question.id <= 65 || question.scoringType === 'single';
  const category = question.category || (question.id <= 30 ? 'TWK' : question.id <= 65 ? 'TIU' : 'TKP');
  
  let catColorClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900';
  if (category === 'TWK') {
    catColorClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900';
  } else if (category === 'TKP') {
    catColorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900';
  }

  const letters = ['A', 'B', 'C', 'D', 'E'];

  // Points earned if in review mode
  let pointsEarned = 0;
  if (isReviewMode) {
    if (isSingleScoring) {
      pointsEarned = (selectedAnswer === question.correctAnswer) ? 5 : 0;
    } else {
      pointsEarned = (question.points && question.points[selectedAnswer] !== undefined)
        ? question.points[selectedAnswer]
        : 0;
    }
  }

  const handleCopyImage = async (imgSrc, label = 'Gambar') => {
    try {
      const res = await fetch(imgSrc);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopiedToast(`${label} disalin ke clipboard!`);
      setTimeout(() => setCopiedToast(''), 3000);
    } catch (err) {
      try {
        await navigator.clipboard.writeText(imgSrc);
        setCopiedToast(`${label} disalin!`);
        setTimeout(() => setCopiedToast(''), 3000);
      } catch (e) {
        setCopiedToast('Gagal menyalin gambar: ' + (e.message || err.message));
        setTimeout(() => setCopiedToast(''), 3500);
      }
    }
  };

  return (
    <>
      <article className="question-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm transition-colors">
        {/* Header Soal */}
        <header className="question-card-header mb-5 flex flex-col gap-3">
          <div className="meta-badges-row flex items-center justify-between flex-wrap gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="meta-left flex items-center gap-2 flex-wrap">
              <span className="question-number-badge px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Soal No. {currentIndex !== undefined ? currentIndex + 1 : question.id} dari {totalQuestions}
              </span>
              <span className={`category-tag px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${catColorClass}`}>
                {category}
              </span>
              <span className="topic-tag text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {question.topic || question.categoryName || 'Kompetensi Dasar'}
              </span>
              {isPreviewMode && (
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 border cursor-pointer ${
                    showPreviewKey
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                  onClick={() => setShowPreviewKey(prev => !prev)}
                  title="Tampilkan / sembunyikan kunci jawaban & pembahasan untuk pengawas"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{showPreviewKey ? 'Sembunyikan Kunci' : 'Intip Kunci & Pembahasan'}</span>
                </button>
              )}
            </div>

            <div className="scoring-info-badge text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span>Bobot Nilai:</span>{' '}
              {isSingleScoring ? (
                <>
                  <strong className="text-slate-900 dark:text-white">Benar = 5 Poin</strong> | Salah/Kosong = 0 Poin
                </>
              ) : (
                <>
                  <strong className="text-slate-900 dark:text-white">Skala 1 - 5 Poin</strong> (Setiap pilihan bernilai)
                </>
              )}
            </div>
          </div>

          {/* Judul Soal dengan Math Support */}
          <div className="question-title-box text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            <h2>
              <MathText text={question.title || `Soal Nomor ${question.id}`} />
            </h2>
          </div>
        </header>

        {/* Gambar Soal Utama (Jika Ada) */}
        {question.image && (
          <div className="question-image-box my-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-2">
            <div className="question-image-wrapper relative group inline-block">
              <img
                src={question.image}
                alt={question.imageCaption || `Ilustrasi Soal Nomor ${question.id}`}
                className="question-img max-h-72 rounded-lg cursor-zoom-in object-contain"
                onClick={() => setZoomImageData({ src: question.image, caption: question.imageCaption || `Soal Nomor ${question.id}` })}
                title="Klik untuk memperbesar gambar"
                loading="lazy"
              />
              <div className="img-action-overlay absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                <button
                  className="img-overlay-btn px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1 backdrop-blur-sm cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyImage(question.image, 'Gambar Soal');
                  }}
                  title="Salin gambar soal"
                  type="button"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Salin</span>
                </button>
                <button
                  className="img-overlay-btn px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1 backdrop-blur-sm cursor-pointer"
                  onClick={() => setZoomImageData({ src: question.image, caption: question.imageCaption || `Soal Nomor ${question.id}` })}
                  title="Perbesar gambar"
                  type="button"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Perbesar</span>
                </button>
              </div>
            </div>
            {question.imageCaption && (
              <div className="question-img-caption text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 italic">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>{question.imageCaption}</span>
              </div>
            )}
          </div>
        )}

        {/* Teks Pertanyaan dengan Formula Matematika */}
        <div className={`question-body ${textClass} text-slate-800 dark:text-slate-200 leading-relaxed font-normal mb-6`}>
          <MathText text={question.question} as="div" />
        </div>

        {/* Pilihan Opsi A - E dengan Dukungan Gambar & Rumus Matematika */}
        <div className="options-list flex flex-col gap-3 mb-6">
          {letters.map((letter) => {
            const optionText = question.options ? question.options[letter] : '';
            const optionImg = question.optionImages ? question.optionImages[letter] : null;

            if (!optionText && !optionImg) return null;

            const isSelected = selectedAnswer === letter;
            let cardColor = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/20';
            let indicatorColor = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

            if (isSelected) {
              cardColor = 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-600';
              indicatorColor = 'bg-blue-600 text-white';
            }

            let reviewBadge = null;
            const showKeyActive = isReviewMode || (isPreviewMode && showPreviewKey);

            if (showKeyActive) {
              if (isSingleScoring) {
                const isCorrect = question.correctAnswer === letter;
                if (isCorrect) {
                  cardColor = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 ring-1 ring-emerald-500';
                  indicatorColor = 'bg-emerald-600 text-white';
                  reviewBadge = <span className="review-badge px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 mt-1 inline-block">✓ Kunci Benar (+5)</span>;
                } else if (isSelected && !isCorrect && isReviewMode) {
                  cardColor = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 ring-1 ring-rose-500';
                  indicatorColor = 'bg-rose-600 text-white';
                  reviewBadge = <span className="review-badge px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 mt-1 inline-block">Jawaban Anda (+0)</span>;
                }
              } else {
                const pts = (question.points && question.points[letter] !== undefined)
                  ? question.points[letter]
                  : 0;
                if (pts === 5) {
                  cardColor = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500';
                }
                reviewBadge = (
                  <span className={`review-badge px-2 py-0.5 rounded text-[11px] font-bold mt-1 inline-block ${
                    pts === 5 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    Nilai: {pts} Poin {isSelected && isReviewMode && '• Pilihan Anda'}
                  </span>
                );
              }
            }

            return (
              <div
                key={letter}
                data-option={letter}
                role="button"
                tabIndex={0}
                className={`option-card group flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border transition cursor-pointer ${cardColor} ${textClass}`}
                onClick={() => onSelectOption(letter)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectOption(letter);
                  }
                }}
              >
                <div className={`option-indicator w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition ${indicatorColor}`}>
                  {letter}
                </div>
                <div className="option-content flex-1 flex flex-col">
                  {/* Lampiran Gambar pada Opsi */}
                  {optionImg && (
                    <div className="option-img-container mb-2 relative group inline-block">
                      <img
                        src={optionImg}
                        alt={`Opsi ${letter}`}
                        className="option-img-preview max-h-36 rounded border border-slate-200 dark:border-slate-700 object-contain"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomImageData({ src: optionImg, caption: `Pilihan Opsi ${letter} (Soal #${question.id})` });
                        }}
                        title="Klik untuk memperbesar"
                      />
                    </div>
                  )}

                  {/* Teks Opsi */}
                  {optionText && (
                    <div className="option-text text-slate-800 dark:text-slate-200 leading-snug">
                      <MathText text={optionText} />
                    </div>
                  )}

                  {reviewBadge}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kotak Pembahasan (Review Mode & Preview Peek) */}
        {(isReviewMode || (isPreviewMode && showPreviewKey)) && (
          <div className="explanation-card mt-6 p-4 sm:p-5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 text-sm">
            <div className="explanation-header flex items-center justify-between gap-2 pb-3 mb-3 border-b border-blue-200/80 dark:border-blue-800/80">
              <div className="exp-title flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span>Pembahasan & Kunci Jawaban Resmi {isPreviewMode && !isReviewMode ? '(Pratinjau Pengawas)' : ''}</span>
              </div>
              {isReviewMode && (
                <div className={`exp-points-badge px-3 py-1 rounded-full text-xs font-bold text-white ${pointsEarned > 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  Skor Anda: +{pointsEarned} Poin
                </div>
              )}
            </div>
            <div className="explanation-body space-y-2">
              <div className="exp-row text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {isReviewMode && (
                  <>
                    <span>Jawaban Anda:</span> <strong className="text-slate-900 dark:text-white">{selectedAnswer || 'Tidak Dijawab'}</strong>
                    {' | '}
                  </>
                )}
                {isSingleScoring && (
                  <>
                    <span>Kunci Jawaban Benar:</span>{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400">{question.correctAnswer}</strong>
                  </>
                )}
              </div>
              <div className="exp-content text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
                <MathText text={question.explanation || 'Belum ada penjelasan tambahan untuk soal ini.'} as="p" />
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Toast Salin Gambar */}
      {copiedToast && (
        <div className="copied-floating-toast fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-bounce">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Lightbox Zoom Modal untuk Gambar Soal / Opsi */}
      {zoomImageData && (
        <div
          className="modal-backdrop is-open fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1200] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImageData(null)}
        >
          <div className="img-zoom-container bg-white dark:bg-slate-900 rounded-2xl p-4 max-w-3xl max-h-[90vh] flex flex-col gap-3 shadow-2xl border border-slate-200 dark:border-slate-800 cursor-default" onClick={(e) => e.stopPropagation()}>
            <div className="img-zoom-header flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{zoomImageData.caption || 'Detail Gambar'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={() => handleCopyImage(zoomImageData.src, 'Gambar')}
                >
                  📋 Salin Gambar
                </button>
                <button
                  className="icon-btn p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  onClick={() => setZoomImageData(null)}
                  aria-label="Tutup Tampilan Penuh"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="img-zoom-body flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={zoomImageData.src}
                alt={zoomImageData.caption || 'Gambar Penuh'}
                className="img-zoom-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
