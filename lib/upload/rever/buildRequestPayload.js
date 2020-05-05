export default function buildRequestPayload(args) {
  const { file, filePath, fileType, fileName, isPublic } = args;

  if (file) {
    file.isPublic = Boolean(isPublic);
    return file;
  }

  if (!filePath) return;

  return {
    isPublic: Boolean(isPublic),
    name: fileName,
    type: fileType,
    uri: filePath,
  };
}
