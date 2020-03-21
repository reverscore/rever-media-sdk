import uploadImage from './uploadImage';

export default class ReverMedia {
  constructor(args) {
    this.reverURL = args.reverURL;
    this.reverToken = args.reverToken;
    this.organization = args.organization;
    this.azureToken = args.azureToken;
  }

  uploadImage({ file, fileExtension, filePath }) {
    return uploadImage({
      azureToken: this.azureToken,
      file,
      fileExtension,
      filePath,
      organization: this.organization,
      reverToken: this.reverToken,
      reverURL: this.reverURL,
    });
  }
}
