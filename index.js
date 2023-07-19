const express = require('express');
const fileUpload = require('express-fileupload');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

const routes = require('./server/routes/siteRoutes.js');
app.use('/', routes);

const port = 3002;
server.listen(port, () => console.log(`Listening to port ${port}`));