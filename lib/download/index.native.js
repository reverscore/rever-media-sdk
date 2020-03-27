import ReverMediaError from '../ReverMediaError';

export default async function download() {
  throw new ReverMediaError(
    'currently, the download functionality is not available for React Native clients.',
  );
}
