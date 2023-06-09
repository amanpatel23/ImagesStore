const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
  imageName: {
    type: String,
    required: true
  },
  ETag: {
    type: String,
    required: true
  },
  Location: {
    type: String, 
    required: true
  },
  Key: {
    type: String,
    required: true
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album'
  }
}, {
  timestamps: true
})

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;