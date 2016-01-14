'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ImagesearchSchema = new mongoose.Schema({
  term:  { type: String, required: true },
  when:  { type: Date, default: new Date().toISOString() }
});

export default mongoose.model('Imagesearch', ImagesearchSchema);
