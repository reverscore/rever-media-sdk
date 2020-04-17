import ReverMediaError from '../ReverMediaError';
import fetchBlob from '../fetchBlob';
import validateSize from './validateSize';

export default async function fetchBase64(args) {
  validateSize(args);
  const mimeType = args?.reverMediaObject?.mimeType;
  const arrayBuffer = await fetchBlob(args);
  return parseBufferToBase64(arrayBuffer, mimeType);
}

function parseBufferToBase64(arrayBuffer, mimeType) {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    const binary = uint8Array.reduce((result, i) => `${result}${String.fromCharCode([i])}`, '');
    const encodedString = window.btoa(binary);

    return `data:${mimeType};base64,${encodedString}`;
  } catch (err) {
    throw new ReverMediaError(
      `an error occurred trying to parse the fetched BLOB image.\nParsing error: ${err?.message ??
        'No error details.'}`,
    );
  }
}
