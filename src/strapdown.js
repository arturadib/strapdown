// Save markdown text, title, etc
var markdownEl = document.getElementById('markdown');
var markdown = markdownEl.textContent || markdownEl.innerText;
var titleEl = document.getElementsByTagName('title')[0];
var title = titleEl.innerHTML;

// Replace HTML #markdown element with output container, etc
var newNode = document.createElement('div');
newNode.innerHTML = '<div id="content" class="container" />';
if (document.getElementsByClassName('navbar').length === 0)
  newNode.innerHTML += '<div class="navbar navbar-fixed-top"> <div class="navbar-inner"> <div class="container"> <div id="headline" class="brand"> </div> </div> </div> </div>';
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
