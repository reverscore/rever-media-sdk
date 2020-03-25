import ReverMediaError from '../ReverMediaError';

export default function paseBlobToBase64({ blob, mimeType }) {
  try {
    const encodedString = window.btoa(String.fromCharCode(...new Uint8Array(blob)));
    return `data:${mimeType};base64,${encodedString}`;
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err) {
  throw new ReverMediaError(
    `an error occurred trying to parse the fetched BLOB image.\nParsing error: ${err.message}`,
  );
}
