# Rever Media SDK

Our JavaScript SDK to handle image and file uploads and downloads.

## Installation

```
npm i -s reverscore/rever-media-sdk
```

Additionally, our mobile app requires to install `react-native-blob-util` to handle BLOB files in React Native.

```
npm i -s react-native-blob-util
```

## Main API (Static methods)

### `ReverMedia.init({ reverURL, reverToken, organizationId, azureToken })`

It works as a factory, it returns a `ReverMediaClient` instance.

```js
import ReverMedia from 'rever-media-sdk';

const reverMediaClient = await ReverMedia.init({
  reverURL: 'https://env-app.reverscore.com/api/v1', // Please note the inclusion of "/api/v1"
  reverToken: 'A Rever session token',
  organizationId: 'Organization Id',
  azureStorageToken: 'Azure Storage Token', // Only required if the specified organization uses Azure as authentication method
});
```

### `ReverMedia.getResourceURL(reverMediaObject, options)`

An utility that returns the final URL to be sent to media provider servers. Is specially useful for the cache infrastructure that each client has to build.

```js
import { IMAGE_SIZES, getResourceURL } from 'rever-media-sdk';

const mediaObject = {
  url: 'https://myresourceurl.com',
  provider: 'AWS_S3',
};

const options = {
  size: IMAGE_SIZES.SQUARE,
};

const url = getResourceURL(mediaObject, options);
console.log(url); // Prints https://myresourceurl.com?size=square
```

### `ReverMedia.clearLocalCache()` (Mobile only)

Deletes any cached blob in mobile clients.

```js
import { clearLocalCache } from 'rever-media-sdk';

await clearLocalCache();
```

## Rever Media Client API (Instance methods)

### Rever Media Objects

All the methods of a `ReverMediaClient` instance work with `Rever Media Object` structures, either by receiving them as input for downloads or returning them as output for uploads.

Here's an example of what you can expect to find in a `Rever Media Object`:

```js
{
  id: '5e7524dc6d464e00110dfc74',
  url: 'http://env-app.reverscore.com/api/v1/media/5e7524dc6d464e00110dfc74/download',
  resourceType: 'image',
  mimeType: 'image/png',
  fileExtension: '.png',
  bytes: 284417,
  originalFileName: '63065b39-5c4a-4b0a-80c1-679a9655577a.png',
  isPublic: false,
  account: '5d604eb65696b20017dd4219',
  provider: 'AWS_S3',
  organization: '5c6ec95082876200173513e0',
  createdAt: '2020-03-20T00:00:00.883Z',
  updatedAt: '2020-03-20T20:00:00.883Z',
}
```

### `upload({ file, fileExtension, filePath, fileType, isPublic })`

This method allows to upload a file, either by passing a BLOB object or only specifying the file's path in a mobile device. It returns a `Rever Media Object`.

#### Important notes:

- When uploading a BLOB file, the `fileExtension` argument is required in order to properly generate the file name.
- A list of supported file types can be found [in this Wiki page](https://github.com/reverscore/rever-media-sdk/wiki/Supported-File-Types).

#### Uploading BLOB file (for Web clients)

```js
// Included in the example as reference of how to generate a BLOB from a base64 image string
function base64ToBLOB(base64) {
  const binary = window.atob(base64.split(',')[1]);
  const array = [];

  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }

  return new window.Blob([new Uint8Array(array)], { type: 'image/jpg' });
}

const base64Image = 'some base64 string';
const blobImage = base64ToBLOB(base64Image);

const reverMediaObject = await reverMediaClient.upload({
  file,
  fileExtension: 'jpg', // Or .jpg
  fileType: 'image/jpg',
});
```

#### Uploading file passing a file path (for React Native clients)

```js
const reverMediaObject = await reverMediaClient.upload({
  filePath: '/User/MyTempFiles/my-rev-photo.jpg',
  fileType: 'image/jpeg',
});
```

### `fetchBase64(reverMediaObject, options)`

It returns the base64 string corresponding to the provided Rever Media object. Additionaly, an `options` object can be passed to specify the desired image size.
If no size is specified the original image will be returned.

#### Important:

Multiple sizes are only available for images stored in AWS.

```js
import ReverMedia, { IMAGE_SIZES } from 'rever-media-sdk';

const reverMediaClient = await ReverMedia.init({ ...options });

const base64String = await reverMediaClient.fetchBase64(someMediaObject, {
  size: IMAGE_SIZES.WIDE,
});
```

Available image sizes and their dimensions are the following and can be found in the `IMAGE_SIZES` enum exported by this module:

```
SQUARE: {
  width: 120px
  height: 120px
},
THUMBNAIL: {
  width: 350px
  height: 430px
},
CARD: {
  width: 440px
  height: 390px
},
WIDE: {
  width: 850px
  height: 370px
}
```

### `fetchToLocalPath(reverMediaObject, options)`

This method works just like the `fetchBase64` method with the difference it returns the local path where the blob file was stored.
This is useful for better performance in mobile clients as you can see in the ["Performance tips"](https://github.com/RonRadtke/react-native-blob-util#user-content-performance-tips) section of the `react-native-blob-util` module.

![](https://github.com/joltup/rn-fetch-blob/raw/master/img/performance_1.png)

### `setAzureStorageToken(newAzureStorageToken)`

Allows to update the Azure Storage token to use for requests. This method is expected to be called by our apps after getting a new valid token.

```js
// Specific Azure tokens refreshing process for each App
const newTokens = await refreshAzureTokens();

reverMediaClient.setAzureStorageToken(newTokens.storageToken);

console.log(reverMediaClient.azureStorageToken); // Prints newTokens.storageToken
```

### `download(reverMediaObject)` (Web only)

Triggers a download process in Web browsers.

#### Important:

This functionality is not available for React Native clients where an error is thrown if this method is called.
