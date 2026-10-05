/**
 * Image processing utility for local storage and question images.
 * Resizes large images to reasonable dimensions (max 1000px width/height)
 * and compresses them so that storing them in localStorage is fast and reliable.
 */

export function processAndCompressImage(file, maxWidth = 1000, maxHeight = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('File tidak ditemukan'));
    }

    if (!file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan gambar yang valid (JPG, PNG, GIF, WEBP, SVG)'));
    }

    // If SVG, read as text/dataURL directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          dataUrl: e.target.result,
          width: 'auto',
          height: 'auto',
          sizeKb: Math.round(file.size / 1024)
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Handle transparency with white background if converting to JPEG
        const isPng = file.type === 'image/png';
        const mimeType = isPng ? 'image/png' : 'image/jpeg';

        if (!isPng) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(mimeType, quality);
        const approxSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          width,
          height,
          sizeKb: approxSizeKb
        });
      };

      img.onerror = () => reject(new Error('Gagal memproses file gambar.'));
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
