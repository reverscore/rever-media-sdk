import ReverMediaError from '../ReverMediaError';

export default async function uploadToAzure(args = {}) {
  validateArgs(args);
  return args;
}

function validateArgs(args) {
  const { azureStorageURL, azureToken } = args;

  if (!azureStorageURL) {
    throw new ReverMediaError(
      'the "providers__azure_storage_storageURL" attribute is required in the specified organization in order to upload the file to Azure Storage.',
    );
  }

  if (!azureToken) {
    throw new ReverMediaError('the "azureToken" argument is required.');
  }
}
