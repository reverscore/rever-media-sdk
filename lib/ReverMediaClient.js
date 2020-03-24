import upload from './upload';

export default class ReverMedia {
  constructor(args) {
    this.azureStorageToken = args.azureStorageToken;
    this.organization = args.organization;
    this.reverToken = args.reverToken;
    this.reverURL = args.reverURL;
  }

  upload({ file, fileExtension, filePath, fileType }) {
    return upload({
      azureStorageToken: this.azureStorageToken,
      file,
      fileExtension,
      filePath,
      fileType,
      organization: this.organization,
      reverToken: this.reverToken,
      reverURL: this.reverURL,
    });
  }
}
