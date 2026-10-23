const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_SAVED_DATA_URL_LENGTH = 140_000;
const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function compressProductPhoto(file: File): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error('JPG, PNG, ya WebP photo choose karein.');
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Photo 8 MB se chhoti honi chahiye.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const loadedImage = new Image();
      loadedImage.onload = () => resolve(loadedImage);
      loadedImage.onerror = () => reject(new Error('Photo open nahi ho paayi. Dusri image try karein.'));
      loadedImage.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Photo ko process nahi kar paaya.');

    let maxDimension = 640;
    for (let sizeAttempt = 0; sizeAttempt < 4; sizeAttempt += 1) {
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.8, 0.7, 0.6, 0.5]) {
        const compressed = canvas.toDataURL('image/webp', quality);
        if (compressed.length <= MAX_SAVED_DATA_URL_LENGTH) return compressed;
      }

      maxDimension = Math.round(maxDimension * 0.75);
    }

    throw new Error('Photo size kam nahi ho paayi. Chhoti image choose karein.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
