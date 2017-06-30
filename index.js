exports.register = function (plugin, options, next) {

    plugin.ext('onPreHandler', function(request, reply){

      request.pre = request.pre || {};
      request.url.pathname = request.url.pathname || "";

      var urlRegex = /\/v(\d+)\/[A-Za-z-]+/;
      var urlMatches = request.url.pathname.match(urlRegex);

      if(urlMatches){
        var versionNumberFromUrl = parseInt(urlMatches[1]);
        request.pre.version = { versionNumber: versionNumberFromUrl, version: 'v' + versionNumberFromUrl, mode: "url" };
        return reply.continue();
      }

      var headerRegex = /application\/vnd.([A-Za-z-]+).([A-Za-z-]+).v(\d+)\+json/;
      var accept = request.headers.accept;

      if(!accept){
          return reply.continue();
      }

      var matches = accept.match(headerRegex);

      if(!matches || matches.length < 3){
          return reply.continue();
      }
      var versionNumberFromHeader = parseInt(matches[3]);

      request.pre.version = { versionNumber: versionNumberFromHeader, version: 'v' + versionNumberFromHeader, mode: "header" };
      return reply.continue();
    });

    plugin.log(["version-prereq"], "registered version prereq");
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
