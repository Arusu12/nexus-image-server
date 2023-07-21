## nexus-image-server
A simple server application made with Expressjs that uses MongoDB as image storage system. With help of tokens for authentication, images are stored, edited, deleted and displayed with proper routes.

Developed by Arusu mainly for storing files for sites created by him, while making it an open-source application for others to easily do it too.

Currently available routes-
```
GET Request to '/image/:imageId/' to view image.
```
```
POST Request to '/saveImage' with "token, image, Id" parameteres in body to save an image.
```
```
POST Request to '/image/:imageId/delete' with "token" parameteres in body to delete an image.
```
Please make sure to use formData.

An npm library to easily do the tasks is being developed along with the image server. Please be patient and keep an eye on the repository.

How to host the server on render using easy steps-
>1. Create new 'Web Service'.
>2. Put repository link - `https://github.com/Arusu12/nexus-image-server`
>3. Choose subdomain name.
>4. Set 'Build Command' to `npm i`
>5. Set 'Start Command' to `node .`
>6. Create the web server and wait for it to be deployed.
>7. Go to Environment and create new secret file with `.env` name and `IMAGE_MONGODB_URI = 'YOUR_DATABASE_URI'` as Contents.

Example of using the server using axios-
```
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function saveImage(token, imageId, imagePath) {
  try {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('Id', imageId);
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post('http://example.com/saveImage', formData, {
      headers: formData.getHeaders()
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save image.');
  }
}

async function deleteImage(token, imageId) {
    try {
      const formData = new FormData();
      formData.append('token', token);
  
      const response = await axios.post(`http://example.com/image/${imageId}/delete`, formData, {
        headers: formData.getHeaders()
      });
  
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete image.');
    }
  }

// Example usage:
// The functions provided here should be used under async with await.
(async () => {
    try {
      const result = await saveImage('YOUR_TOKEN_HERE', 'YOUR_IMAGE_ID_HERE', 'YOUR_IMAGE_PATH_HERE');
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  })();
```
**It's hereby allowed to be used in any kind of work of proper sense with proper credits given to the creator.**
