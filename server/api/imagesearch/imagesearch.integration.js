'use strict';

var app = require('../..');
import request from 'supertest';

var newImagesearch;

describe('Imagesearch API:', function() {

  describe('GET /api/imagesearch', function() {
    var imagesearchs;

    beforeEach(function(done) {
      request(app)
        .get('/api/imagesearch')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          imagesearchs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      imagesearchs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/imagesearch', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/imagesearch')
        .send({
          name: 'New Imagesearch',
          info: 'This is the brand new imagesearch!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newImagesearch = res.body;
          done();
        });
    });

    it('should respond with the newly created imagesearch', function() {
      newImagesearch.name.should.equal('New Imagesearch');
      newImagesearch.info.should.equal('This is the brand new imagesearch!!!');
    });

  });

  describe('GET /api/imagesearch/:id', function() {
    var imagesearch;

    beforeEach(function(done) {
      request(app)
        .get('/api/imagesearch/' + newImagesearch._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          imagesearch = res.body;
          done();
        });
    });

    afterEach(function() {
      imagesearch = {};
    });

    it('should respond with the requested imagesearch', function() {
      imagesearch.name.should.equal('New Imagesearch');
      imagesearch.info.should.equal('This is the brand new imagesearch!!!');
    });

  });

  describe('PUT /api/imagesearch/:id', function() {
    var updatedImagesearch;

    beforeEach(function(done) {
      request(app)
        .put('/api/imagesearch/' + newImagesearch._id)
        .send({
          name: 'Updated Imagesearch',
          info: 'This is the updated imagesearch!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedImagesearch = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedImagesearch = {};
    });

    it('should respond with the updated imagesearch', function() {
      updatedImagesearch.name.should.equal('Updated Imagesearch');
      updatedImagesearch.info.should.equal('This is the updated imagesearch!!!');
    });

  });

  describe('DELETE /api/imagesearch/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/imagesearch/' + newImagesearch._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when imagesearch does not exist', function(done) {
      request(app)
        .delete('/api/imagesearch/' + newImagesearch._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
