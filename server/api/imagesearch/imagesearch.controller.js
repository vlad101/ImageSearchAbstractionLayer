/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/imagesearch              ->  index
 * POST    /api/imagesearch              ->  create
 * GET     /api/imagesearch/:id          ->  show
 * PUT     /api/imagesearch/:id          ->  update
 * DELETE  /api/imagesearch/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var request = require('request');
var Imagesearch = require('./imagesearch.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

/*
  [{
    term":"123",
    "date":"2016-01-14T15:38:35.852Z"
  }, ...]
*/
function responseWithImageResult(res, statusCode) {
  statusCode = statusCode || 200;
  var data = [];
  return function(entity) {
    if (entity) {
      for(var o in entity) {
        var jsonObj = entity[o].toObject();
        delete jsonObj._id;
        delete jsonObj.__v;
        entity[o] = jsonObj;
      }
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

// https://api.imgur.com/endpoints/gallery#gallery-search
// https://api.imgur.com/models/gallery_image
/*
  Imgur JSON response
  {
    "description":"My personal experience",
    "topic":"Funny",
    "link":"http://i.imgur.com/RC61ZtE.jpg"
  }
*/
export function imageSearch(req, res) {

  var params = {
    imgurClientId: '35b0765618d05b7',
    searchStr: req.params.search,
    offset: 1
  };

  // Validate search string
  if(!params.searchStr) {
    return res.status(500).send({error: 'Invalid search string'});
  }

  // Validate offset value
  for(var prop in req.query) {
    if(prop === 'offset')
      if(req.query[prop] % 1 !== 0 || req.query[prop] <= 0) {
        return res.status(500).send({error: 'Invalid offset'});
      }
      params.offset = req.query[prop];
  }

  doGetImgurResult(req, res, params);
}

function doGetImgurResult(req, res, params) {

  request({
    url: 'https://api.imgur.com/3/gallery/search/time/' + params.offset + '?q=' + params.searchStr,
    headers: {
        'Authorization': 'Client-ID ' + params.imgurClientId
    },
    json: true
  }, function(err, resp, json) {
    if (err) handleError(resp);
    var jsonData = json.data;
    var propList = ['id', 'title', 'datetime', 'type', 'animated', 'width', 'height', 'size', 
                    'views', 'bandwidth', 'deletehash', 'gifv', 'mp4', 'webm', 'looping', 'vote', 
                    'favorite', 'nsfw', 'comment_count', 'comment_preview', 'topic_id', 'section', 
                    'account_url', 'account_id', 'ups', 'downs', 'points', 'score', 'is_album',
                    'cover', 'cover_width', 'cover_height', 'privacy', 'layout', 'images_count'];
    jsonData = doPrepareData(jsonData, propList);

    createImageSearch(req, res, jsonData, params.searchStr);
  });
}

// Creates a new Imagesearch in the DB
function createImageSearch(req, res, jsonData, searchQuery) {

  var imageSearch = {
    term: searchQuery
  };
  Imagesearch.createAsync(imageSearch)
    .then(function() {
      return res.status(200).send(jsonData);
    })
    .catch(handleError(res));
}

// Prepare json data
function doPrepareData(jsonData, propList) {
  for(var o in jsonData) {
    for(var i = 0; i < propList.length; i++)  
      delete jsonData[o][propList[i]];
  }
  return jsonData;
}

// Gets a list of Imagesearchs
export function index(req, res) {
  Imagesearch.findAsync()
    .then(responseWithImageResult(res))
    .catch(handleError(res));
}

// Creates a new Imagesearch in the DB
export function create(req, res) {
  Imagesearch.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Gets a single Imagesearch from the DB
export function show(req, res) {
  Imagesearch.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Imagesearch in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Imagesearch.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Imagesearch from the DB
export function destroy(req, res) {
  Imagesearch.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}