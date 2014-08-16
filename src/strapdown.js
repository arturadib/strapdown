/* global jQuery, marked, prettyPrint */
(function( $ ) {
  'use strict';

  var acceptedAttributes  = {
    'toc' : 'toc',
    'toc-top-link' : 'tocTopLink'
  };

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

    importCss: function () {
      // @TODO proper theme management
      $(document.head).append($('<link/>', {href: _.getStrapdownOrigin() + '/strapdown.css', rel: 'stylesheet'}));
    },

    updateHead: function (options) {
      // Use <meta> viewport so that Bootstrap is actually responsive on mobile
      $(document.head).prepend($('<meta name="viewport" content="width=device-width, initial-scale=1">')); // why was it 'max/min width = 1'?
      _.importCss();
    },

    updateNavbar: function () {
      var titleEl = document.getElementsByTagName('title')[0],
          navbarEl = $('.navbar').get(0);
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

    updateBody: function (contentEl) {
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
    },

    extractAttributeOptions: function (mdEl) {
      var htmlOptions = {};

      $.each(mdEl.get(0).attributes, function (idx, el) {
        if (el.name.indexOf('toc') === 0) {
          if (! htmlOptions.toc) {
            htmlOptions.toc = {};
          }
          switch (el.name) {
            case 'toc-top-link':
              htmlOptions.toc.topLink = el.value ? el.value : 'Back to top';
              break;
          }
        }
      });
      return htmlOptions;
    },

    normalizeOptions: function (attributeOptions, jsOptions) {
      var settings =  $.extend({}, $.fn.strapdown.defaults, attributeOptions, jsOptions);

      if (settings.toc) {
        settings.toc.insertionPoint = settings.toc.insertionPoint || '#headline';
      }

      return settings;
    }

  };

  $.fn.strapdown = function (options) {
    var target;

    if (this.get(0) === document || this.get(0) === document.body) {
      target = $('xmp,textarea').eq(0);
      _.updateHead();
      _.updateNavbar();
    } else {
      target = this;
    }

    var settings = _.normalizeOptions(_.extractAttributeOptions(target), options);
    var updatedDom = _.updateBody(target);

    if (settings.toc) {
      settings.toc.insertionPoint = $(settings.toc.insertionPoint);
      $.fn.strapdown.toc(updatedDom.find('#content'), settings.toc);
    }

    return updatedDom;
  };

  $.fn.strapdown.importCss = _.importCss;

  $.fn.strapdown.defaults = {
    toc: false
    // toc: {
    //   navbar: '#headline', // name? appendTo? only put the selector?
    //   selector: '.toc'
    // },
  };



  // @ifdef DEBUG
  // For testing purposes
  $.fn.strapdown._internals = _;
  // @endif

}( jQuery ));

