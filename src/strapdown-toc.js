;(function($, window, document) {
  if (!window.originBase) {
    var scriptEls = document.getElementsByTagName('script');
    var origin = '';
    for (var i = 0; i < scriptEls.length; i++) {
      if (scriptEls[i].src.match('jquery\\.tocify')) {
        origin = scriptEls[i].src;
      }
    }
    var originBase = origin.substr(0, origin.lastIndexOf('/'));
  }

  var linkEl = document.createElement('link');
    linkEl.href = window.originBase + '/themes/jquery.tocify.css';
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);


  var toc = $("#toc");
  toc.tocify({
    selectors: "h1,h2,h3" // title levels used
  }).data("toc-tocify"); 
  // It's highly probable that the content and the table are already in a container. Remove this one.
  $("#content").removeClass("container"); 
  toc.show();
})(window.jQuery, window, document);
