import omit from 'lodash/omit';

import uploadToAzure from '../../uploadImage/uploadToAzure';

const baseArgs = {
  azureStorageURL: 'https://rever.blob.core.windows.net/rever-useast1-unstable01',
  azureToken: 'my azure token',
};

describe('Upload to Azure Storage', () => {
  it('should throw an error if the Azure Storage URL is not specified', async () => {
    const args = omit(baseArgs, 'azureStorageURL');

    await expect(uploadToAzure(args)).rejects.toThrow(
      'the "providers__azure_storage_storageURL" attribute is required in the specified organization in order to upload the file to Azure Storage.',
    );
  });

  it('should throw an error if the Azure Storage token is not specified', async () => {
    const args = omit(baseArgs, 'azureToken');

    await expect(uploadToAzure(args)).rejects.toThrow('the "azureToken" argument is required.');
  });
});
