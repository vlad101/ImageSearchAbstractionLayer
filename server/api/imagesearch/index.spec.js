'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var imagesearchCtrlStub = {
  index: 'imagesearchCtrl.index',
  show: 'imagesearchCtrl.show',
  create: 'imagesearchCtrl.create',
  update: 'imagesearchCtrl.update',
  destroy: 'imagesearchCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var imagesearchIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './imagesearch.controller': imagesearchCtrlStub
});

describe('Imagesearch API Router:', function() {

  it('should return an express router instance', function() {
    imagesearchIndex.should.equal(routerStub);
  });

  describe('GET /api/imagesearch', function() {

    it('should route to imagesearch.controller.index', function() {
      routerStub.get
        .withArgs('/', 'imagesearchCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/imagesearch/:id', function() {

    it('should route to imagesearch.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'imagesearchCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/imagesearch', function() {

    it('should route to imagesearch.controller.create', function() {
      routerStub.post
        .withArgs('/', 'imagesearchCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/imagesearch/:id', function() {

    it('should route to imagesearch.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'imagesearchCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/imagesearch/:id', function() {

    it('should route to imagesearch.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'imagesearchCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/imagesearch/:id', function() {

    it('should route to imagesearch.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'imagesearchCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
