// Get origin of script
var scriptEls = document.getElementsByTagName('script');
var origin = '';
for (var i = 0; i < scriptEls.length; i++) {
  if (scriptEls[i].src.match('strapdown')) {
    origin = scriptEls[i].src;
  }
}
var originBase = origin.substr(0, origin.lastIndexOf('/'));

// Shim for IE < 9
document.head = document.getElementsByTagName('head')[0];

// Use viewport so that Bootstrap is actually responsive on mobile Safari
var metaEl = document.createElement('meta');
metaEl.name = 'viewport';
metaEl.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0';
if (document.head.firstChild)
  document.head.insertBefore(metaEl, document.head.firstChild);
else
  document.head.appendChild(metaEl);

// Stylesheets
var linkEl = document.createElement('link');
linkEl.href = originBase + '/themes/united.min.css';
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

// Save markdown text, title, etc
var markdownEl = document.getElementsByTagName('xmp')[0] || document.getElementsByTagName('textarea')[0];
var markdown = markdownEl.textContent || markdownEl.innerText;
var titleEl = document.getElementsByTagName('title')[0];
var title = titleEl.innerHTML;

// Insert navbar if there's none
var newNode = document.createElement('div');
newNode.className = 'navbar navbar-fixed-top';
if (document.getElementsByClassName('navbar').length === 0) {
  newNode.innerHTML = '<div class="navbar-inner"> <div class="container"> <div id="headline" class="brand"> </div> </div> </div>';
  document.body.insertBefore(newNode, document.body.firstChild);
}

// Replace markdown element with HTML container
newNode = document.createElement('div');
newNode.className = 'container';
newNode.id = 'content';
document.body.replaceChild(newNode, markdownEl);

var headlineEl = document.getElementById('headline');
if (headlineEl)
  headlineEl.innerHTML = title;

// // Generate Markdown
var html = marked(markdown);
document.getElementById('content').innerHTML = html;

// Prettify
var codeEls = document.getElementsByTagName('code');
for (var i=0, ii=codeEls.length; i<ii; i++) {
  var codeEl = codeEls[i];
  var lang = codeEl.className;
  codeEl.className = 'prettyprint lang-' + lang;
}
prettyPrint();
