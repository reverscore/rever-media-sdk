export default function buildRequestPayload(args) {
  const { file, filePath, fileType, fileName } = args;
  if (file) return file;
  if (!filePath) return;

  return {
    name: fileName,
    type: fileType,
    uri: filePath,
  };
}
