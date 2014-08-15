/* global jQuery, marked, prettyPrint */
(function( $ ) {
  'use strict';

  var _ = {
    getStrapdownOrigin: function () {
      var scriptEls = document.getElementsByTagName('script'),
          sdOrigin = ''
          ;

      for (var i = 0; i < scriptEls.length; i++) {
        if (scriptEls[i].src.match('strapdown')) {
          sdOrigin = scriptEls[i].src;
          return sdOrigin.substr(0, sdOrigin.lastIndexOf('/'));
        }
      }

      throw 'Unable to get the strapdown origin';
    },

    updateHead: function (options) {
      var titleEl = document.getElementsByTagName('title')[0],
          navbarEl = $('.navbar').get(0),
          $head = $(document.head)
          ;

      // Use <meta> viewport so that Bootstrap is actually responsive on mobile
      $head.prepend($('<meta name="viewport" content="width=device-width, initial-scale=1">')); // why was it 'max/min width = 1'?

      // @TODO proper theme management
      $head.append($('<link/>', {href: _.getStrapdownOrigin() + '/strapdown.css', rel: 'stylesheet'}));


         // Insert navbar if there's none
      if (!navbarEl && titleEl) {
        var newNode = document.createElement('div');
        newNode.className = 'navbar navbar-inverse navbar-fixed-top';
        newNode.innerHTML = '<div class="container"> <div class="navbar-header">' +
                              '<div id="headline" class="navbar-brand">' + titleEl.innerHTML +'</div> ' +
                            '</div> </div>';

        document.body.insertBefore(newNode, document.body.firstChild);
      }

    },

    updateDom: function (contentEl) {
      if (!marked) {
        throw 'Marked not found. Unable to proceed further.';
      }

      var markdown = contentEl.text(),
          newContentEl = $('<div class="container"><div id="content"></div></div>')
          ;

      contentEl.replaceWith(newContentEl);

      // Generate Markdown
      var html = marked(markdown);
      document.getElementById('content').innerHTML = html;

      // Prettify
      if (prettyPrint) {
        $('code').each(function () {
          this.className = 'prettyprint lang-' + this.className;
        });
        prettyPrint();
      }

      // Style tables
      $('table').each(function () {
        this.className = 'table table-striped table-bordered';
      });

      // Make the images responsive
      $('img').each(function () {
        this.className = 'img-responsive';
      });

      return newContentEl;
    }

  };

  $.fn.strapdown = function (options) {
    var settings = $.extend($.strapdown.defaults, options );

    // var updatedContent = _.updateDom(this);

    // if (settings.toc) {
    //   var el  = $('#content');
    //   if (el.length > 0) {
    //     console.log(el);
    //     el.eq(0).strapdownToc(settings.toc);
    //   }
    // }

    // return updatedContent;
    return _.updateDom(this).find('#content').strapdownToc(settings.toc);
  };

  $.strapdown = function (options) {
    var $markdownEl = $('xmp,textarea').eq(0);

    // TODO update options instead: default < html < options param
    // Table of contents
    if ($markdownEl.attr('toc')) {
      // Extra features: back to top
      var tocTopLink = $markdownEl.attr('toc-top-link');
      if (tocTopLink) {
        window.strapdownToc = {
          includeBackToTopLink: true
        };

        if (tocTopLink !== '1' && tocTopLink !== 'true') {
          window.strapdownToc.backToTopLinkLabel = tocTopLink;
        }
      }
    }

    _.updateHead(options);

    $markdownEl.strapdown(options);

    return this;
  };

  $.strapdown.defaults = {
    header: {
      title: 'Strapdown'
    },
    toc: {
      navbar: '#headline', // name? appendTo? only put the selector?
      selector: '.toc'
    },
  };

  // For testing purposes
  $.strapdown._internals = _;

}( jQuery ));

