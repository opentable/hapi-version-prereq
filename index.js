exports.register = function (plugin, options, next) {

    plugin.ext('onPreHandler', function(request, extNext){

      request.pre = request.pre || {};
      request.url.pathname = request.url.pathname || "";

      var urlRegex = /\/v\d+\/[A-Za-z-]+/;

      if(request.url.pathname.match(urlRegex)){
        var bits = request.url.pathname.split("/");
        request.pre.version = { version: bits[1], mode: "url" };
        return extNext();
      }

      var headerRegex = /application\/vnd.([A-Za-z-]+).([A-Za-z-]+).(v\d+)\+json/;
      var accept = request.headers.accept;

      if(!accept){
          return extNext();
      }

      var matches = accept.match(headerRegex);

      if(!matches || matches.length < 3){
          return extNext();
      }

      request.pre.version = { version: matches[3], mode: "header" };
      extNext();
    });

    plugin.log(["version-prereq"], "registered version prereq");
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
