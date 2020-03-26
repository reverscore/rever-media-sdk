import ReverMediaError from '../../ReverMediaError';
import fetchBlob from '../fetchBlob';

export default async function fetchAsBase64(args) {
  const response = await fetchBlob(args);

  try {
    const base64 = response?.base64?.();
    return base64;
  } catch (err) {
    throw new ReverMediaError(
      `an error occurred trying to parse the blob file.\nParsing error: ${err?.message ??
        'No details.'}`,
    );
  }
}
