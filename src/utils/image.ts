// Reads an uploaded image and returns a downscaled JPEG data URL plus the
// original filename. Downscaling keeps the cart small enough for localStorage
// and gives a preview that survives page reloads. (There is no backend yet, so
// this is a stored preview — the artist collects the full-resolution reference
// during follow-up.)

const MAX_DIMENSION = 1000; // longest edge, in pixels
const JPEG_QUALITY = 0.85;

export interface ProcessedImage {
  name: string;
  dataUrl: string;
}

export function processReferenceImage(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load the image.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback: store the original data URL if canvas is unavailable.
          resolve({ name: file.name, dataUrl: reader.result as string });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve({ name: file.name, dataUrl: canvas.toDataURL('image/jpeg', JPEG_QUALITY) });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
