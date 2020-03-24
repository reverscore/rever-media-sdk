import ReverMediaError from '../../ReverMediaError';
import upload from './upload';
import createReverMediaObject from './createReverMediaObject';

export default async function uploadToAzure(args = {}) {
  validateArgs(args);

  try {
    const azureData = await upload(args);
    if (isAzureError(azureData)) return handleAzureError(azureData);
  } catch (err) {
    return handleAzureError(err?.message);
  }

  try {
    const reverMediaObject = await createReverMediaObject(args);
    return reverMediaObject;
  } catch (err) {
    return handleReverError(err?.message);
  }
}

function validateArgs(args) {
  const { azureStorageURL, azureStorageToken } = args;

  if (!azureStorageURL) {
    throw new ReverMediaError(
      'the "providers__azure_storage_storageURL" attribute is required in the specified organization in order to upload the file to Azure Storage.',
    );
  }

  if (!azureStorageToken) {
    throw new ReverMediaError('the "azureStorageToken" argument is required.');
  }
}

function handleAzureError(errorMessage = 'No error details.') {
  throw new ReverMediaError(
    `An error occurred trying to upload your file to Azure Storage.\nAzure error: ${errorMessage}`,
  );
}

// In some tests the Azure Storage request was resolved successfully but its data attribute was a string containing the actual error. That's why we should cover that case with this regex.
function isAzureError(data) {
  return /error/i.test(data);
}

function handleReverError(errorMessage = 'No error details.') {
  throw new ReverMediaError(
    `An error occurred trying to create a Rever Media Object.\nRever error: ${errorMessage}`,
  );
}
