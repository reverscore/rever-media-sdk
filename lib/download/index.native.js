import ReverMediaError from '../ReverMediaError';
import ReactNativeBlobUtil from 'react-native-blob-util';

export default async function download(args = {}) {
  const { url } = args?.reverMediaObject;
  const fileExtension = args?.reverMediaObject?.fileExtension;
  const appendExt = fileExtension?.substring(1);
  const reverToken = args?.reverToken;
  try {
    const response = await ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt,
      headers: {
        Authorization: reverToken,
      },
    }).fetch('GET', url);
    return response;
  } catch (err) {
    throw new ReverMediaError(`an error occurred: ${err?.message ?? 'No error details.'}`);
  }
}
