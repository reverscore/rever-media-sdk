import ReverMediaError from '../ReverMediaError';
import fetchBlob from '../fetchBlob';

export default async function fetchToLocalPath(args) {
  try {
    const response = await fetchBlob(args);
    const path = await response?.path?.();
    return path;
  } catch (err) {
    throw new ReverMediaError(
      `an error occurred trying to get the local path where the file was stored.\nError: ${err.message ||
        'No details'}`,
    );
  }
}
