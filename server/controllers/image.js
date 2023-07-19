require('../models/database');
const Image = require('../models/image')
const Token = require('../models/token')
const fs = require('fs')

exports.main = async (req, res) => {
  try {
    res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nexus Image Server</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;background-color:#f2f2f2}.container{text-align:center}.logo{font-size:2rem;font-weight:700;color:#333;margin-bottom:1rem}.description{font-size:1.2rem;color:#666;margin-bottom:2rem}</style></head><body><div class="container"><h1 class="logo">Nexus Image Server</h1><p class="description">An image server to store and serve images to Nexus.</p></div></body></html>')
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.loadImage = async (req, res) => {
  try {
    const image = await Image.findOne({ Id: req.params.imageId }).exec();

    if (!image) {
      res.status(404).send('Image not found.');
      return;
    }

    res.contentType('image/png');
    res.send(image.file);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.saveImage = async (req, res) => {
  try {
    const findExistingImage = await Image.findOne({ Id: req.body.Id }).exec();

    const TOKEN = await Token.findOne({ token: req.body.token })
    if (!TOKEN) {
      res.send('[TOKEN ERROR] Access token not valid.');
      return;
    }
    if (TOKEN.maxUses <= TOKEN.uses) {
      res.send(`[TOKEN ERROR] Token usage limit of ${TOKEN.maxUses} reached.`);
      return;
    }
    if (findExistingImage) {
      res.send('[DATABASE ERROR] Image with the same ID already exists.');
      return;
    }
    
    await Token.updateOne({ token: req.body.token }, { $inc: { uses: 1 } })

    const image = new Image({})

    image.type = 'image'
    image.Id = req.body.Id
    image.uploaderToken = TOKEN.token
    if (req.files.image && req.files.image !== ''){
      const Data = fs.readFileSync(req.files.image.tempFilePath);
     image.file = Data
    }
    
    image.save()
    res.send('[SUCCESS] Image has been uploaded to the server.')
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};