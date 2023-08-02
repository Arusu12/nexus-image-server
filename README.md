## nexus-image-server
A simple server application made with Expressjs that uses MongoDB as image storage system. With help of tokens for authentication, images are stored, edited, deleted and displayed with proper routes.

Developed by Arusu mainly for storing files for sites created by him, while making it an open-source application for others to easily do it too.

Currently available routes-
```
`GET` Request to '/image/:imageId/' to view image.
`GET` Request to '/image/gallery/?token=YOUR_TOKEN_HERE' to view images uploades using one token.
`POST` Request to '/saveImage' with "token, image, Id" parameteres in body to save an image.
`POST` Request to '/image/:imageId/delete' with "token" parameteres in body to delete an image.
```
Please make sure to use formData and append the parameters.

Interact with the server with the official npm package- `https://www.npmjs.com/package/nis.js`

How to host the server on render using easy steps-
>1. Create new 'Web Service'.
>2. Put repository link - `https://github.com/Arusu12/nexus-image-server`
>3. Choose subdomain name.
>4. Set 'Build Command' to `npm i`
>5. Set 'Start Command' to `node .`
>6. Create the web server and wait for it to be deployed.
>7. Go to Environment and create new secret file with `.env` name and `IMAGE_MONGODB_URI = 'YOUR_DATABASE_URI'` as Contents.

**It's hereby allowed to be used in any kind of work of proper sense with proper credits given to the creator.**