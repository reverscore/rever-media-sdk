import ReverMediaError from '../ReverMediaError';
import fetchBlob from '../fetchBlob';

export default async function fetchToLocalPath(args) {
  try {
    const arrayBuffer = await fetchBlob(args);
    const blob = new Blob([arrayBuffer], { type: args?.reverMediaObject?.mimeType });
    const blobURL = window.URL.createObjectURL(blob);

    return blobURL;
  } catch (err) {
    throw new ReverMediaError(
      `an error occurred trying to fetch the specified file to a local path.\nError: ${err.message ||
        'No details.'}`,
    );
  }
}
