import upload from './upload';
import fetchBase64 from './fetchBase64';

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

  fetchBase64(reverMediaObject) {
    return fetchBase64({
      azureStorageToken: this.azureStorageToken,
      organization: this.organization,
      reverMediaObject,
      reverToken: this.reverToken,
    });
  }

  setAzureStorageToken(azureStorageToken) {
    this.azureStorageToken = azureStorageToken;
  }
}
