$(function() {
  // Prepare HTML body
  $('<div class="navbar navbar-fixed-top"> <div class="navbar-inner"> <div class="container"> <div class="brand"> </div> </div> </div> </div>')
    .appendTo('body');
  $('.brand').text($('title').text());
  $('<div id="content" class="container">').appendTo('body');

  // Generate Markdown
  var converter = new Showdown.converter();
  var text = $('body > pre').text();
  var html = converter.makeHtml(text);
  $('#content').html( html );

  // Prettify
  $('#content code').each(function() {
    var $this = $(this);
    var lang = this.className;
    $this.addClass('prettyprint');
    $this.addClass('lang-' + lang);
  });
  prettyPrint();
});
