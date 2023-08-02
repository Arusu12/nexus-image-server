require('../models/database');
const Image = require('../models/image')
const Token = require('../models/token')
const sharp = require('sharp');

const fs = require('fs')

exports.main = async (req, res) => {
  try {
    res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nexus Image Server</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;background-color:#f2f2f2}.container{text-align:center}.logo{font-size:2rem;font-weight:700;color:#333;margin-bottom:1rem}.description{font-size:1.2rem;color:#666;margin-bottom:2rem}</style></head><body><div class="container"><h1 class="logo">Nexus Image Server</h1><p class="description">An image server to store and serve images to Nexus.</p></div></body></html>')
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.gallery = async (req, res) => {
  try {
    const token = req.query.token
    const getAuthor = async (token) => (await Token.findOne({ token: token })) ? (await Token.findOne({ token: token })).owner : 'Ghost';
    const author = await getAuthor(token)
    const images = await Image.find({uploaderToken: token})
    res.render('gallery', {images, author})
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.list = async (req, res) => {
  try {
    const images = await Image.find({uploaderToken: req.body.token})
    const map = images.map((image) => {
      return {
        Id: image.Id,
        uploaded: image.dateUploaded,
      };
    });

    res.json(map)
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.loadImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const size = req.query.size;

    const image = await Image.findOne({ Id: imageId }).exec();

    if (!image) {
      res.status(404).send('Image not found.');
      return;
    }

    let imageBuffer = image.file;

    if (size && !isNaN(size)) {
      const percentageSize = parseFloat(size) / 100;

      const { width: originalWidth, height: originalHeight } = await sharp(imageBuffer).metadata();

      const newWidth = Math.round(originalWidth * percentageSize);
      const newHeight = Math.round(originalHeight * percentageSize);

      imageBuffer = await sharp(imageBuffer).resize(newWidth, newHeight).toBuffer();
    }

    res.contentType('image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.saveImage = async (req, res) => {
  try {
    const { fileTypeFromBuffer } = await import('file-type');
    const findExistingImage = await Image.findOne({ Id: req.body.Id }).exec();

    const TOKEN = await Token.findOne({ token: req.body.token })
    if (!TOKEN) {
      res.json({ data: '[TOKEN ERROR] Access token not valid.', error: { type: 'TOKEN:404', details: 'The provided access token is invalid or does not exist.', timestamp: new Date().toISOString() } });
      return;
    }
    if (TOKEN.maxUses <= TOKEN.uses) {
      res.json({ data: `[TOKEN ERROR] Token usage limit of ${TOKEN.maxUses} reached.`, error: { type: 'TOKEN:429', details: 'The maximum usage limit for this token has been reached.', timestamp: new Date().toISOString() } });
      return;
    }
    if (findExistingImage) {
      res.json({ data: '[DATABASE ERROR] Image with the same ID already exists.', error: { type: 'DATABASE:409', details: 'An image with the provided ID already exists in the database.', timestamp: new Date().toISOString() } });
      return;
    }    
    
    await Token.updateOne({ token: req.body.token }, { $inc: { uses: 1 } })

    const image = new Image({})

    image.type = 'image'
    image.Id = req.body.Id
    image.uploaderToken = TOKEN.token
    if (req.files.image && req.files.image !== '') {
      const buffer = fs.readFileSync(req.files.image.tempFilePath);
      const fileInfo = await fileTypeFromBuffer(buffer);

      if (!fileInfo || !fileInfo.mime.startsWith('image/')) {
        res.json({ data: '[FILE ERROR] Invalid file format. Only image files are allowed.', error: { type: 'FILE:400', details: 'The uploaded file is not a valid image.', timestamp: new Date().toISOString() } });
        return;
      }
      
      image.file = buffer;
    }
    
    image.save()
    res.json({data:'[SUCCESS] Image has been uploaded to the server.', success:{type:"DATABASE:201", details:`The image was successfully uploaded to the server and added to the Database.`, timestamp: new Date().toISOString(), fileId:`${image.Id}`, uploader:`${TOKEN.owner}`}});
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findOne({ Id: req.params.imageId });

    if (image) {
      const TOKEN = await Token.findOne({ token: req.body.token })
      if (!TOKEN) {
        res.json({ data: '[TOKEN ERROR] Access token not valid.', error: { type: 'TOKEN:401', details: 'The provided access token is invalid or does not exist.', timestamp: new Date().toISOString() } });
        return;
      }
      if (TOKEN.token !== image.uploaderToken) {
        res.json({ data: `[TOKEN ERROR] Token for ${image.Id} is incorrect.`, error: { type: 'TOKEN:401', details: 'Can not delete a photo without authority.', timestamp: new Date().toISOString() } });
        return;
      }
      await image.deleteOne();
      res.json({data:'[SUCCESS] Image has been deleted.', success:{type:"DATABASE:200", details:`The image was successfully deleted from the Database.`, timestamp: new Date().toISOString(), fileId:`${image.Id}`}});
    } else {
      res.json({ data: '[DATABASE ERROR] Image not Found.', error: { type: 'FILE:404', details: 'The server can not find the specified file in the Database.', timestamp: new Date().toISOString()}});
    }

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};