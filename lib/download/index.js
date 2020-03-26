import fetchBlob from '../fetchBlob';

export default async function download(args) {
  const blob = await fetchBlob(args);
  const fileName = args?.reverMediaObject?.originalFileName;

  triggerBrowserDownload(blob, fileName);
}

function triggerBrowserDownload(blob, fileName) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
