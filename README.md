# EJS Helper

<a href="https://www.npmjs.com/package/ejs-helper">
  <img src="https://img.shields.io/npm/v/ejs-helper.svg" alt="ejs-helper on npm" />
</a>

EJS Helper is a collection of functions to have a better template including experience in [Express](https://github.com/strongloop/express).

Works with Express `4.x` and EJS `2.x`.

## Installation

```bash
npm install ejs-helper --save
```

## Usage

### Express integration

```js
var ejsHelper = require('ejs-helper');

app.use(ejsHelper({
    cssPath: '/static/css/',
    jsPath: '/static/js/',
    urlArgs: 'v='+requie("package.json").version+'&awesomeness=true'
}));
```

### Template integration

Most of the times you will have something like a `header.ejs` and `footer.ejs` which will be included in a `somePage.ejs` as a re-usable template. But sometimes you want to insert CSS- or JavaScript-Files into your header and/or footer from your `somePage`. Sending locals along `res.render()` is not the best solution.

This will be implemented like this:

**header.ejs**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title><%= title() %></title>
  <meta charset="UTF-8">
<%- head();  -%>
<%- scripts('header'); %>
<%- styles(); -%>
</head>
<body>
```

**footer.ejs**

```html
<%- scripts('footer'); %>
</body>
</html>
```

**somePage.ejs**

```html
<%
setTitle('Some Page');
addHead('<meta name="description" content="This is some page">');
addHead('<meta name="author" content="Timo Mämecke">');
addStyle('style.css');
addStyle('print.css', { media: 'print' });
addScript('header', 'script1.js', { async: 'async' });
addScript('footer', 'script2.js');
%>
<% include header %>
   <h1>Lorem ipsum</h1>
   <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
<% include footer %>
```

The rendered HTML will look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Some Page</title>
  <meta charset="UTF-8">
  <meta name="description" content="This is some page">
  <meta name="author" content="Timo Mämecke">
  <script src="/static/js/script1.js" async="async"></script>
  <link href="/static/css/style.css">
  <link href="/static/css/print.css" media="print">
</head>
<body>
  <h1>Lorem ipsum</h1>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
  <script src="/static/js/script2.js"></script>
</body>
</html>
```

## Options

* `cssPath` will be prepended to the filename of the CSS href
* `jsPath` will be prepended to the filename of the script src
* `urlArgs` are extra query string arguments appended to relative path URLs

The above configuration is ignored if absolute url is provided. eg:

```js
addScript('footer', 'https://cdnjs.cloudflare.com/ajax/libs/require.min.js')
```

OR

```js
addScript('footer', '//cdnjs.cloudflare.com/ajax/libs/require.min.js')
```

OR

```js
addScript('footer', 'http//cdnjs.cloudflare.com/ajax/libs/equire.min.js')
```

Then the original url is used and for example in the second case when `scripts('footer')`
is called, no matter what configuration is used, it will result to:

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/require.min.js"></script>
```

## Methods

You can use these methods in your template.

**setTitle()**  
Sets the title of the page

**addHead(htmlString)**  
Adds a String of HTML.  
* *htmlString* *(required)* is a line of text/html.

**addStyle(file, attributes)**  
Adds a Stylesheet `<link>`.  
* *file* *(required)* is the filename of the CSS file.
* *attributes* *(optional)* is a key-value object of HTML Attributes.

**addScript(place, file, attributes)**  
Adds a JavaScript `<script>`.  
* *place* *(required)* can be `header` or `footer`.  
* *file* *(required)* is the filename of the JavaScript file.
* *attributes* *(optional)* is a key-value object of HTML Attributes.

**title()**  
Returns the specified title.

**head()**  
Returns the specified HTML.

**styles()**  
Returns the specified Style Sources.

**scripts(place)**  
Returns the specified Script Sources.
* *place* *(required)* can be `header` or `footer`.

## License

The MIT License (MIT)

Copyright (c) 2015 Timo Mämecke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
