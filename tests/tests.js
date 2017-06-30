describe('tests', function(){
  var should = require('should');
  var plugin = require('../index');
  var handler;
  var p = {
    ext: function(event, fn){
      handler = fn;
    },
    log: function(){}
  };

  it('should register the plugin', function(done){
    plugin.register(p, {}, function(){
      handler.should.not.eql(null);
      done();
    });
  });

  it('should correctly parse a versioned url', function(done){
    var request = {
      pre: {},
      headers: {},
      url: { pathname: '/v1/my-url' }
    };

    handler(request, { continue: function(){
      request.pre.version.version.should.eql('v1');
      request.pre.version.versionNumber.should.eql(1);
      request.pre.version.mode.should.eql('url');
      done();
    }});
  });

  it('should correctly parse a version header', function(done){
    var request = {
      pre: {},
      headers: { accept: 'application/vnd.myorg.mytype.v1+json' },
      url: { pathname: '/my-url' }
    };

    handler(request, { continue: function(){
      request.pre.version.version.should.eql('v1');
      request.pre.version.versionNumber.should.eql(1);
      request.pre.version.mode.should.eql('header');
      done();
    }});
  });

  it('should not break if pre is undefined', function(done){
    var request = {
      headers: { accept: 'application/vnd.myorg.mytype.v1+json' },
      url: { pathname: '/my-url' }
    };

    handler(request, { continue: function(){
      request.pre.version.version.should.eql('v1');
      request.pre.version.versionNumber.should.eql(1);
      request.pre.version.mode.should.eql('header');
      done();
    }});
  });

  it('should ignore a non-versioned route', function(done){
    var request = {
      pre: {},
      headers: {},
      url: { pathname: '/my-url' }
    };

    handler(request, { continue: function(){
      (request.pre.version === undefined).should.be.true;
      done();
    }});
  });

  it('should not break if the path is empty', function(done){
    var request = {
      pre: {},
      headers: {},
      url: {}
    };

    handler(request, { continue: function(){
      (request.pre.version === undefined).should.be.true;
      done();
    }});
  });

  it('should give precedence to url version if both header and url version are supplied', function(done){
    var request = {
      pre: {},
      headers: { accept: 'application/vnd.myorg.mytype.v1+json'},
      url: { pathname: '/v2/my-url'}
    };

    handler(request, { continue: function(){
      request.pre.version.version.should.eql('v2');
      request.pre.version.versionNumber.should.eql(2);
      request.pre.version.mode.should.eql('url');
      done();
    }});
  });

  it('should not match an invalid accept header', function(done){
    var request = {
      pre: {},
      headers: { accept: 'application/blarg+json'},
      url: { pathname: '/my-url'}
    };

    handler(request, { continue: function(){
      (request.pre.version === undefined).should.be.true;
      done();
    }});
  });
});
