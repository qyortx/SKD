import React, { useState } from 'react';
import { MathText } from '../utils/mathRenderer.jsx';

export default function QuestionCard({
  question,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  isReviewMode,
  fontSizeLevel
}) {
  const [zoomImageData, setZoomImageData] = useState(null); // { src, caption }
  const [copiedToast, setCopiedToast] = useState('');

  if (!question) return null;

  const fontSizes = ['font-sm', 'font-normal', 'font-lg', 'font-xl'];
  const fontClass = fontSizes[fontSizeLevel + 1] || 'font-normal';

  const isSingleScoring = question.id <= 65 || question.scoringType === 'single';
  const category = question.category || (question.id <= 30 ? 'TWK' : question.id <= 65 ? 'TIU' : 'TKP');
  const catClass = `category-tag tag-${category.toLowerCase()}`;

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

  // Copy Image to Clipboard
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
        alert('Gagal menyalin gambar: ' + err.message);
      }
    }
  };

  return (
    <>
      <article className="question-card">
        {/* Header Soal */}
        <header className="question-card-header">
          <div className="meta-badges-row">
            <div className="meta-left">
              <span className="question-number-badge">
                Soal No. {question.id} dari {totalQuestions}
              </span>
              <span className={catClass}>{category}</span>
              <span className="topic-tag">
                {question.topic || question.categoryName || 'Kompetensi Dasar'}
              </span>
            </div>

            <div className={`scoring-info-badge ${isSingleScoring ? 'single-scoring' : 'scale-scoring'}`}>
              <span>Bobot Nilai:</span>{' '}
              {isSingleScoring ? (
                <>
                  <strong>Benar = 5 Poin</strong> | Salah/Kosong = 0 Poin
                </>
              ) : (
                <>
                  <strong>Skala 1 - 5 Poin</strong> (Setiap pilihan bernilai)
                </>
              )}
            </div>
          </div>

          {/* Judul Soal dengan Math Support */}
          <div className="question-title-box">
            <h2>
              <MathText text={question.title || `Soal Nomor ${question.id}`} />
            </h2>
          </div>
        </header>

        {/* Gambar Soal Utama (Jika Ada) */}
        {question.image && (
          <div className="question-image-box">
            <div className="question-image-wrapper">
              <img
                src={question.image}
                alt={question.imageCaption || `Ilustrasi Soal Nomor ${question.id}`}
                className="question-img"
                onClick={() => setZoomImageData({ src: question.image, caption: question.imageCaption || `Soal Nomor ${question.id}` })}
                title="Klik untuk memperbesar gambar"
                loading="lazy"
              />
              <div className="img-action-overlay">
                <button
                  className="img-overlay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyImage(question.image, 'Gambar Soal');
                  }}
                  title="Salin gambar soal ke clipboard"
                  type="button"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Salin</span>
                </button>
                <button
                  className="img-overlay-btn"
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
              <div className="question-img-caption">
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
        <div className={`question-body ${fontClass}`}>
          <MathText text={question.question} as="div" />
        </div>

        {/* Pilihan Opsi A - E dengan Dukungan Gambar & Rumus Matematika */}
        <div className={`options-list ${fontClass}`}>
          {letters.map((letter) => {
            const optionText = question.options ? question.options[letter] : '';
            const optionImg = question.optionImages ? question.optionImages[letter] : null;

            if (!optionText && !optionImg) return null;

            const isSelected = selectedAnswer === letter;
            let cardClasses = ['option-card'];
            if (isSelected) cardClasses.push('is-selected');

            let reviewBadge = null;

            if (isReviewMode) {
              if (isSingleScoring) {
                const isCorrect = question.correctAnswer === letter;
                if (isCorrect) cardClasses.push('review-correct');
                if (isSelected && !isCorrect) cardClasses.push('review-wrong');

                if (isCorrect) {
                  reviewBadge = <span className="review-badge badge-success">Kunci Benar (+5)</span>;
                } else if (isSelected) {
                  reviewBadge = <span className="review-badge badge-danger">Jawaban Anda (+0)</span>;
                }
              } else {
                // TKP 66-110
                const pts = (question.points && question.points[letter] !== undefined)
                  ? question.points[letter]
                  : 0;
                if (pts === 5) cardClasses.push('review-correct');
                if (isSelected) cardClasses.push('review-user-chosen');

                reviewBadge = (
                  <span className={`review-badge ${pts === 5 ? 'badge-success' : 'badge-neutral'}`}>
                    Nilai: {pts} Poin {isSelected && '• Pilihan Anda'}
                  </span>
                );
              }
            }

            return (
              <div
                key={letter}
                className={cardClasses.join(' ')}
                onClick={() => onSelectOption(letter)}
              >
                <div className="option-indicator">{letter}</div>
                <div className="option-content">
                  {/* Lampiran Gambar pada Opsi */}
                  {optionImg && (
                    <div className="option-img-container">
                      <img
                        src={optionImg}
                        alt={`Opsi ${letter}`}
                        className="option-img-preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomImageData({ src: optionImg, caption: `Pilihan Opsi ${letter} (Soal #${question.id})` });
                        }}
                        title="Klik untuk memperbesar gambar opsi"
                      />
                      <button
                        type="button"
                        className="option-img-copy-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyImage(optionImg, `Gambar Opsi ${letter}`);
                        }}
                        title="Salin gambar opsi ini"
                      >
                        📋
                      </button>
                    </div>
                  )}

                  {/* Teks Opsi (jika ada) */}
                  {optionText && (
                    <div className="option-text">
                      <MathText text={optionText} />
                    </div>
                  )}

                  {reviewBadge}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kotak Pembahasan (Review Mode) */}
        {isReviewMode && (
          <div className="explanation-card">
            <div className="explanation-header">
              <div className="exp-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <strong>Pembahasan & Kunci Jawaban Resmi</strong>
              </div>
              <div className={`exp-points-badge ${pointsEarned > 0 ? 'bg-success' : 'bg-danger'}`}>
                Skor Anda: +{pointsEarned} Poin
              </div>
            </div>
            <div className="explanation-body">
              <div className="exp-row">
                <span>Jawaban Anda:</span> <strong>{selectedAnswer || 'Tidak Dijawab'}</strong>
                {isSingleScoring && (
                  <>
                    {' '} | <span>Kunci Jawaban Benar:</span>{' '}
                    <strong className="text-success">{question.correctAnswer}</strong>
                  </>
                )}
              </div>
              <div className="exp-content">
                <MathText text={question.explanation || 'Belum ada penjelasan tambahan untuk soal ini.'} as="p" />
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Toast Salin Gambar */}
      {copiedToast && (
        <div className="copied-floating-toast">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Lightbox Zoom Modal untuk Gambar Soal / Opsi */}
      {zoomImageData && (
        <div
          className="modal-backdrop is-open img-zoom-backdrop"
          onClick={() => setZoomImageData(null)}
          style={{ zIndex: 1200 }}
        >
          <div className="img-zoom-container" onClick={(e) => e.stopPropagation()}>
            <div className="img-zoom-header">
              <span>{zoomImageData.caption || 'Detail Gambar'}</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-xs btn-secondary"
                  onClick={() => handleCopyImage(zoomImageData.src, 'Gambar')}
                >
                  📋 Salin Gambar
                </button>
                <button
                  className="icon-btn"
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
            <div className="img-zoom-body">
              <img
                src={zoomImageData.src}
                alt={zoomImageData.caption || 'Gambar Penuh'}
                className="img-zoom-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
