import ReverMediaError from '../ReverMediaError';
import fetchBlob from '../fetchBlob';
import { isUnauthorizedError } from '../unauthorizedError';

export default async function fetchToLocalPath(args) {
  try {
    const arrayBuffer = await fetchBlob(args);
    const blob = new Blob([arrayBuffer], { type: args?.reverMediaObject?.mimeType });
    const blobURL = window.URL.createObjectURL(blob);

    return blobURL;
  } catch (err) {
    // Unauthorized errors must keep their status shape so consuming apps can
    // trigger their session recovery flows.
    if (isUnauthorizedError(err)) throw err;

    throw new ReverMediaError(
      `an error occurred trying to fetch the specified file to a local path.\nError: ${err.message ||
        'No details.'}`,
    );
  }
}
