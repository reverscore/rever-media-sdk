import fileDownload from 'js-file-download';
import fetchBlob from '../fetchBlob';

export default async function download(args) {
  const blob = await fetchBlob(args);
  const fileName = args?.reverMediaObject?.originalFileName;
  const mimeType = args?.reverMediaObject?.mimeType;

  fileDownload(blob, fileName, mimeType);
}
