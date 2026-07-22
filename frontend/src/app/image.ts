/**
 * Image helpers for tool photos.
 *
 * Photos are stored inline with the tool as a data URL, because the whole
 * inventory lives in localStorage (see ToolService). localStorage is capped at
 * roughly 5MB per origin, so a phone photo straight off disk would blow the
 * budget after two or three tools. Every upload is therefore downscaled to a
 * thumbnail and re-encoded as JPEG before it is ever handed to the service.
 */

/** Longest edge, in pixels, of a stored tool photo. */
const MAX_DIMENSION = 480;

/** JPEG quality for the re-encoded thumbnail. */
const QUALITY = 0.72;

/** Rejects anything that is not a browser-decodable image. */
const ACCEPTED = /^image\/(jpeg|png|webp|gif|bmp)$/;

export class ImageError extends Error {}

/**
 * Reads a user-selected file and resolves to a downscaled JPEG data URL.
 * Rejects with an ImageError carrying a message safe to show to the user.
 */
export function toThumbnailDataUrl(file: File): Promise<string> {
  if (!ACCEPTED.test(file.type)) {
    return Promise.reject(new ImageError('That file is not a supported image (JPEG, PNG, WebP or GIF).'));
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        resolve(render(image));
      } catch (err) {
        reject(err instanceof ImageError ? err : new ImageError('Could not process that image.'));
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new ImageError('That image could not be read.'));
    };

    image.src = objectUrl;
  });
}

/** Draws the image onto a canvas scaled to fit MAX_DIMENSION and encodes it. */
function render(image: HTMLImageElement): string {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new ImageError('Could not process that image.');
  }

  // JPEG has no alpha, so transparent PNGs would otherwise composite onto black.
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', QUALITY);
}
