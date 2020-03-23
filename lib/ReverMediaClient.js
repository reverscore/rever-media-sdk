import uploadImage from './uploadImage';

export default class ReverMedia {
  constructor(args) {
    this.azureStorageToken = args.azureStorageToken;
    this.organization = args.organization;
    this.reverToken = args.reverToken;
    this.reverURL = args.reverURL;
  }

  uploadImage({ file, fileExtension, filePath }) {
    return uploadImage({
      azureStorageToken: this.azureStorageToken,
      file,
      fileExtension,
      filePath,
      organization: this.organization,
      reverToken: this.reverToken,
      reverURL: this.reverURL,
    });
  }
}
