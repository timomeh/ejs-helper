module.exports = function(config) {
  var basePathRegex=new RegExp("^(http:|https:)?//");

  if (!config)
    var config = {};
    
  //normalize url form(to end in /)
  if (!config.cssPath) {
    config.cssPath = "";
  }else if(config.cssPath[config.cssPath.length-1]!=="/") {
    config.cssPath+="/";
  }

  if (!config.jsPath) {
    config.jsPath = "";
  }else if(config.jsPath[config.jsPath.length-1]!=="/") {
    config.jsPath+="/";
  }
  /*urlArgs as in requirejs config.
   *The search portion of the url,
   *could be useful for setting asset
   *version e.t.c
   */
  if (!config.urlArgs) {
    config.urlArgs = "";
  }else if(config.urlArgs[0] !== "?") {
    config.urlArgs = ("?"+config.urlArgs);
  }

  /**
   * Private function that detects whether the the base is
   * found in the url and returns it in the right form.
   * Asuming that an absolute path url is pointing to a
   * third party server, site wide urlArgs configuration
   * is ignored and the original url is returned in that case.
   * @param   {string} path   Any of the configured path keys 
   *                          "jsPath", "cssPath".
   * @param   {string} src    The ptovided url path relative
   *                          or absolute.
   * @returns {string}        Prepared url with urlArgs or 
   *                          the original abslute url.
   */
  function constructUrl(path,src){
      if (basePathRegex.test(src)||!config[path]) {
          return src;
      }
      return  config[path] + src + config.urlArgs;
  }
  return function(req, res, next) {
    var title = "";
    var styles = [];
    var headers = [];
    var scripts = {
      header: [],
      footer: []
    };

    res.locals.addHead = function (content) {
      headers.push(content);
    }

    res.locals.addScript = function (place, file, attr) {
      scripts[place].push({ src: file, attributes: attr });
    }

    res.locals.addStyle = function (file, attr) {
      styles.push({ src: file, attributes: attr });
    }

    res.locals.setTitle = function (t) {
      title = t;
    }

    res.locals.scripts = function (place) {
      var output = '';

      scripts[place].forEach(function (script) {
          output += '<script src="' + constructUrl("jsPath", script.src)+'"';
        for (attribute in script.attributes) {
          output += ' ' + attribute + '="' + script.attributes[attribute] + '"';
        }
        output += '></script>\n';
      });

      return output;
    }

    res.locals.styles = function () {
      var output = '';

      styles.forEach(function (style) {
          output += '<link href="' + constructUrl("cssPath", style.src) + '"';
        for (attribute in style.attributes) {
          output += ' ' + attribute + '="' + style.attributes[attribute] + '"';
        }
        output += '>\n';
      });

      return output;
    }

    res.locals.head = function () {
      return headers.join('\n');
    }

    res.locals.title = function () {
      return title;
    }

    next();
  }
}
