import ReverMediaError from '../ReverMediaError';
import {
  buildUnauthorizedError,
  gotUnauthorizedResponse,
  isUnauthorizedError,
} from '../unauthorizedError';
import ReactNativeBlobUtil from 'react-native-blob-util';

export default async function download(args = {}) {
  const url = args?.reverMediaObject?.url;
  const fileExtension = args?.reverMediaObject?.fileExtension;
  const fileName = args?.reverMediaObject?.originalFileName;
  const appendExt = fileExtension?.substring(1);

  return ReactNativeBlobUtil.config({
    fileCache: true,
    appendExt,
    path: ReactNativeBlobUtil?.fs?.dirs?.DocumentDir + '/' + fileName,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      mime: args?.reverMediaObject?.mimeType,
    },
  })
    .fetch('GET', url, { Authorization: args?.reverToken })
    .then(response => {
      // React-native-blob-util resolves regardless of the HTTP status, so an
      // expired session that answers 401 must be detected here.
      if (gotUnauthorizedResponse(response)) {
        throw buildUnauthorizedError({ Authorization: args?.reverToken });
      }

      return response?.path();
    })
    .catch(err => {
      if (isUnauthorizedError(err)) throw err;

      throw new ReverMediaError(`an error occurred: ${err?.message ?? 'No error details.'}`);
    });
}
