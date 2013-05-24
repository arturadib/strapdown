;(function(window, document) {

  // Hide body until we're done fiddling with the DOM
  document.body.style.display = 'none';

  //////////////////////////////////////////////////////////////////////
  //
  // Shims for IE < 9
  //

  document.head = document.getElementsByTagName('head')[0];

  if (!('getElementsByClassName' in document)) {
    document.getElementsByClassName = function(name) {
      function getElementsByClassName(node, classname) {
        var a = [];
        var re = new RegExp('(^| )'+classname+'( |$)');
        var els = node.getElementsByTagName("*");
        for(var i=0,j=els.length; i<j; i++)
            if(re.test(els[i].className))a.push(els[i]);
        return a;
      }
      return getElementsByClassName(document.body, name);
    }
  }

  var htmlCollectionToArray = (function () {
    function toArr(coll) {
      var arr = [],
          i,
          len = coll.length;
      for (i = 0; i < len; i++) {
        arr.push(coll[i]);
      }
      return arr;
    }
    return function (coll) {
      try {
        return Array.prototype.slice.call(coll, 0);
      } catch (e) {
        // E.g. IE8 fails using slice.
        // http://stackoverflow.com/a/2735133/319878
        return toArr(coll);
      }
    };
  }());

  //////////////////////////////////////////////////////////////////////
  //
  // Get user elements we need
  //
  var xmps = document.getElementsByTagName('xmp'),
      textareas = document.getElementsByTagName('textarea'),
      markdownEl = xmps[0] || textareas[0],
      titleEl = document.getElementsByTagName('title')[0],
      scriptEls = document.getElementsByTagName('script'),
      navbarEl = document.getElementsByClassName('navbar')[0],
      markdownEls = htmlCollectionToArray(xmps).concat(htmlCollectionToArray(textareas));

  //////////////////////////////////////////////////////////////////////
  //
  // <head> stuff
  //

  // Use <meta> viewport so that Bootstrap is actually responsive on mobile
  var metaEl = document.createElement('meta');
  metaEl.name = 'viewport';
  metaEl.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0';
  if (document.head.firstChild)
    document.head.insertBefore(metaEl, document.head.firstChild);
  else
    document.head.appendChild(metaEl);

  // Get origin of script
  var origin = '';
  for (var i = 0; i < scriptEls.length; i++) {
    if (scriptEls[i].src.match('strapdown')) {
      origin = scriptEls[i].src;
    }
  }
  var originBase = origin.substr(0, origin.lastIndexOf('/'));

  // Get theme
  var theme = markdownEl.getAttribute('theme') || 'bootstrap';
  theme = theme.toLowerCase();

  // Stylesheets
  var linkEl = document.createElement('link');
  linkEl.href = originBase + '/themes/'+theme+'.min.css';
  linkEl.rel = 'stylesheet';
  document.head.appendChild(linkEl);

  var linkEl = document.createElement('link');
  linkEl.href = originBase + '/strapdown.css';
  linkEl.rel = 'stylesheet';
  document.head.appendChild(linkEl);

  var linkEl = document.createElement('link');
  linkEl.href = originBase + '/themes/bootstrap-responsive.min.css';
  linkEl.rel = 'stylesheet';
  document.head.appendChild(linkEl);

  (function markdownAll(markdownEls) {
    var navbarAdded = false;

    function addNavbar(titleEl) {
      var newNode = document.createElement('div');
      newNode.className = 'navbar navbar-fixed-top';
      newNode.innerHTML = '<div class="navbar-inner"> <div class="container"> <div id="headline" class="brand"> </div> </div> </div>';
      document.body.insertBefore(newNode, document.body.firstChild);
      var title = titleEl.innerHTML;
      var headlineEl = document.getElementById('headline');
      if (headlineEl)
        headlineEl.innerHTML = title;
    }

    function markdownIt(markdownEl, i) {
      //////////////////////////////////////////////////////////////////////
      //
      // <body> stuff
      //

      var markdown = markdownEl.textContent || markdownEl.innerText;
      // Keep existing id if present
      var id = markdownEl.id || ('content' + i);

      var newNode = document.createElement('div');
      newNode.className = 'container';
      newNode.id = id;
      document.body.replaceChild(newNode, markdownEl);

      // Insert navbar if there's none
      if (!navbarEl && titleEl && !navbarAdded) {
        addNavbar(titleEl);
        navbarAdded = true;
      }

      //////////////////////////////////////////////////////////////////////
      //
      // Markdown!
      //

      // Generate Markdown
      var html = marked(markdown);
      newNode.innerHTML = html;
    }

    for (var i = 0; i < markdownEls.length; i++) {
      if (markdownEls[i].className.split(" ").indexOf("strapdown-ignore") < 0) {
        markdownIt(markdownEls[i], i);
      }
    }
  }(markdownEls));

  // Prettify
  var codeEls = document.getElementsByTagName('code');
  for (var i=0, ii=codeEls.length; i<ii; i++) {
    var codeEl = codeEls[i];
    var lang = codeEl.className;
    codeEl.className = 'prettyprint lang-' + lang;
  }
  prettyPrint();

  // Style tables
  var tableEls = document.getElementsByTagName('table');
  for (var i=0, ii=tableEls.length; i<ii; i++) {
    var tableEl = tableEls[i];
    tableEl.className = 'table table-striped table-bordered';
  }

  // All done - show body
  document.body.style.display = '';

})(window, document);
