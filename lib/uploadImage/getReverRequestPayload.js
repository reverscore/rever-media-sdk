export default function getReverRequestPayload(args) {
  const { file, filePath, fileType } = args;
  if (file) return file;
  if (!filePath) return;

  return {
    name: getNameFromPath(filePath),
    type: fileType,
    uri: filePath,
  };
}

// It will receive a path like "/MyFolder/Subfolder/file.jpg" and return "file.jpg"
function getNameFromPath(path) {
  return path.substring(path.lastIndexOf('/') + 1);
}
