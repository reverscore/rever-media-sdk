import upload from './upload';
import fetchBase64 from './fetchBase64';
import download from './download';
import fetchToLocalPath from './fetchToLocalPath';

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

  fetchBase64(reverMediaObject, options) {
    return fetchBase64({
      azureStorageToken: this.azureStorageToken,
      options,
      organization: this.organization,
      reverMediaObject,
      reverToken: this.reverToken,
    });
  }

  setAzureStorageToken(azureStorageToken) {
    this.azureStorageToken = azureStorageToken;
  }

  download(reverMediaObject) {
    return download({
      azureStorageToken: this.azureStorageToken,
      organization: this.organization,
      reverMediaObject,
      reverToken: this.reverToken,
    });
  }

  fetchToLocalPath(reverMediaObject, options) {
    return fetchToLocalPath({
      azureStorageToken: this.azureStorageToken,
      options,
      organization: this.organization,
      reverMediaObject,
      reverToken: this.reverToken,
    });
  }
}
