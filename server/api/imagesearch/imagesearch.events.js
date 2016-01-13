/**
 * Imagesearch model events
 */

'use strict';

import {EventEmitter} from 'events';
var Imagesearch = require('./imagesearch.model');
var ImagesearchEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ImagesearchEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Imagesearch.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ImagesearchEvents.emit(event + ':' + doc._id, doc);
    ImagesearchEvents.emit(event, doc);
  }
}

export default ImagesearchEvents;
