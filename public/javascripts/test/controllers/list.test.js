const proxyquire = require('proxyquireify')( require );

// requiring dependencies.
const
  Backbone = require('backbone'),
  sinon = require('sinon');

// requiring fake objects.
const
  FakeRegion = require('./fakes/fake-region'),
  FakeLayout = require('./fakes/fake-list-layout');

const assert = chai.assert;

const stubs = {
  '../views/list/movie-list-layout': FakeLayout,
  '../views/list/movie-list-filter-bar': Backbone.View,
  '../views/list/movie-list-item-view': Backbone.View,
  '../views/list/movie-list-view': Backbone.View
};

const MovieList = proxyquire('../../apps/movies/controllers/list', stubs);

describe('Initiating the list controller', function () {
  it('has setup function', function () {
    assert.typeOf(MovieList.setup, 'function');
  });
  it('has the right region', function () {
    const movieList = MovieList.setup({region: '.list-region'});

    assert.match(movieList.region, /.list-region/i);
  });
});

describe('viewing the list', function () {
  beforeEach(function () {
    this.region = FakeRegion.setup();
  });

  it('renders the list in the given region', function () {
    const
      getRegion = function () {
        return FakeRegion.setup();
      },
      stub = sinon.stub(FakeLayout.prototype, 'getRegion', getRegion),
      movieList = MovieList.setup({ region: this.region });

    // initializing the tested behavior.
    movieList.view();

    // making sure the layout is rendered in the given region.
    assert.ok( this.region.stub.called );

    // making sure layout's getRegion() was called twice.
    assert.ok( stub.calledTwice );

    // making sure getRegion() first call passed the right arg.
    assert.match(stub.getCall( 0 ).args[ 0 ], /^filters/);

    // making sure getRegion() second call passed the right arg.
    assert.match(stub.getCall( 1 ).args[ 0 ], /^list/);

    /* making sure the filter view is rendered in the layout's
      filters bar region */
    assert.ok( stub.getCall( 0 ).returnValue.stub.calledOnce );

    /* making sure the movie list view is rendered in the
      layout's list region. */
    assert.ok( stub.getCall( 1 ).returnValue.stub.calledOnce );
  });
});

describe('removing the list', function () {
  beforeEach(function () {
    this.region = FakeRegion.setup();
  });

  it('has to destroy the entire region', function () {
    const
      remove = sinon.spy(this.region, 'remove'),
      movieList = MovieList.setup({ region: this.region });

    movieList.destroy();

    assert.ok( remove.called );
  });
});