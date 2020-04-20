import ReverMediaError from '../ReverMediaError';
import fetchBlob from '../fetchBlob';

export default async function fetchBase64(args) {
  const response = await fetchBlob(args);

  try {
    const base64 = response?.base64?.();
    const mimeType = args?.reverMediaObject?.mimeType;

    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    throw new ReverMediaError(
      `an error occurred trying to parse the blob file.\nParsing error: ${err?.message ??
        'No details.'}`,
    );
  }
}
