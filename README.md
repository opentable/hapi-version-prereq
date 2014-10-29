#Hapi-version-prereq
[![Build Status](https://travis-ci.org/opentable/hapi-version-prereq.png?branch=master)](https://travis-ci.org/opentable/hapi-version-prereq) [![NPM version](https://badge.fury.io/js/hapi-version-prereq.png)](http://badge.fury.io/js/hapi-version-prereq) ![Dependencies](https://david-dm.org/opentable/hapi-version-prereq.png)

Hapi plugin for automagically populating the version header on routes that support it. At OT we use a mix of url-versioning and header-versioning. In some cases our APIs need to support both. This module represents some shared code for our narrow use-case.

installation:

```npm install hapi-version-prereq```

usage:

```
var hapi = require("hapi");
var joi = require("joi");

var server = Hapi.createServer('127.0.0.1', 3000, {});

server.route([{
  method: 'GET',
  path: '/v1/my-url',
  config: {
    handler: function(request, reply){
      reply(request.pre.version)
    }
  }
},
{
  method: 'GET',
  path: '/my-url',
  config: {
    handler: function(request, reply){
      reply(request.pre.version)
    },
    validate: {
      headers: {
        accept: joi.string().regex(/application\/vnd.myorg.mytype.v1\+json/)
      }
    }
  }
}]);

server.pack.register([
  {
    plugin: require('hapi-version-prereq'),
    options: {}
  }], function(err){
    if(err){
      throw err;
    }

    server.start(function(){
      server.log('server started');
    });
});

```

- `/v1/my-url => { version: 'v1', mode: 'url' }`
- `/my-url => { version: 'v1', mode: 'header' }`
