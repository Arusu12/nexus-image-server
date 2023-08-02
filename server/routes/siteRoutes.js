const express = require('express');
const router = express.Router();

const image = require('../controllers/image');

router.get('/', image.main);
router.get('/gallery/', image.gallery);

router.get('/image/:imageId/', image.loadImage);
router.post('/list/', image.list);
router.post('/saveImage', image.saveImage);
router.post('/image/:imageId/delete', image.deleteImage);
 
router.get('*', (req, res)=>{res.redirect('/')})

module.exports = router;