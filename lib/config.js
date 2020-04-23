const ONE_YEAR_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 365;

export default Object.freeze({
  mediaProviders: {
    aws: 'AWS_S3',
    externalAzureStorage: 'EXTERNAL_AZURE_STORAGE_SERVICE',
  },
  // These values were taken from the examples in the official Azure Storage REST API docs: https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob
  azureStorage: {
    apiVersion: '2019-07-07',
    blobType: 'BlockBlob',
    cacheTTL: ONE_YEAR_IN_MILLISECONDS,
  },
  IMAGE_SIZES: {
    SQUARE: 'square',
    THUMBNAIL: 'thumbnail',
    CARD: 'card',
    WIDE: 'wide',
  },
});
