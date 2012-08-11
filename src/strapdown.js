// Save text
var markdownEl = document.getElementById('markdown');
var markdown = markdownEl.textContent || markdownEl.innerText;

// Prepare HTML body
document.body.innerHTML = '<div class="navbar navbar-fixed-top"> <div class="navbar-inner"> <div class="container"> <div id="headline" class="brand"> </div> </div> </div> </div>   <div id="content" class="container" />';

var titleEl = document.getElementsByTagName('title')[0];
var title = titleEl.innerHTML;

document.getElementById('headline').innerHTML = title;

// Generate Markdown
var converter = new Showdown.converter();
var html = converter.makeHtml(markdown);
document.getElementById('content').innerHTML = html;

// Prettify
var codeEls = document.getElementsByTagName('code');
for (var i=0, ii=codeEls.length; i<ii; i++) {
  var codeEl = codeEls[i];
  var lang = codeEl.className;
  codeEl.className = 'prettyprint lang-' + lang;
}
prettyPrint();
