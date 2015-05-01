module.exports = function(config) {
  if (!config)
    var config = {};
  if (!config.cssPath)
    config.cssPath = "";
  if (!config.jsPath)
    config.jsPath = "";

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
        output += '<script src=' + config.jsPath + '/' + script.src;
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
        output += '<link href="' + config.cssPath + style.src + '"';
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
