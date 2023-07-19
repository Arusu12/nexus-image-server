const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.IMAGE_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Connected to Database.')
});

// Models
require('./image')