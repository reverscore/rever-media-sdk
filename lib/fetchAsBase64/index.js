import ReverMediaError from '../ReverMediaError';
import fetchBlob from '../fetchBlob';

export default async function fetchAsBase64(args) {
  const { mimeType } = args;
  const blob = await fetchBlob(args);
  return parseBlobToBase64({ blob, mimeType });
}

function parseBlobToBase64({ blob, mimeType }) {
  try {
    const encodedString = window.btoa(String.fromCharCode(...new Uint8Array(blob)));
    return `data:${mimeType};base64,${encodedString}`;
  } catch (err) {
    throw new ReverMediaError(
      `an error occurred trying to parse the fetched BLOB image.\nParsing error: ${err.message}`,
    );
  }
}
