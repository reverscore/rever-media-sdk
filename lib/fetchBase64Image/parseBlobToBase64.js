export default function paseBlobToBase64({ blob, mimeType }) {
  const encodedString = window.btoa(String.fromCharCode(...new Uint8Array(blob)));
  return `data:${mimeType};base64,${encodedString}`;
}
