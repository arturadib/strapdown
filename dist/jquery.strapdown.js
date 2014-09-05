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

      console.warn('Unable to get the strapdown origin. File inclusion will probably fail.');
      return '';
    },

    importCss: function () {
      // @TODO proper theme management
      $(document.head).append($('<link/>', {href: _.getStrapdownOrigin() + '/strapdown.css', rel: 'stylesheet'}));
    },

    updateHead: function () {
      // Use <meta> viewport so that Bootstrap is actually responsive on mobile
      $(document.head).prepend($('<meta name="viewport" content="width=device-width, initial-scale=1">')); // why was it 'max/min width = 1'?
      _.importCss();
    },

    createNavbar: function (settings) {
      if (!settings.navbar) {return;}
      var navbarCollapseBtn = ' <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">' +
                              '   Table of Contents' +
                              ' </button>',
          tocInsertionPoint = '<div class="toc collapse navbar-collapse"></div>',
          navbarTitle       = '<div id="headline" class="navbar-brand">' + settings.navbar.title +'</div>'
          ;

      var newNode = document.createElement('div');
      newNode.className = 'navbar navbar-inverse navbar-fixed-top';
      newNode.innerHTML = '<div class="container"> <div class="navbar-header">' +
                          (settings.toc ? navbarCollapseBtn + navbarTitle + tocInsertionPoint : navbarTitle) +
                          '</div> </div>';

      if (settings.toc) {
        settings.toc.dest = '.toc';
      }

      document.body.insertBefore(newNode, document.body.firstChild);
    },

    updateBody: function (contentEl, settings) {
      var markdown = contentEl.text(),
          newContentEl = (settings.dest ? $(settings.dest) : null)
          ;

      if (! newContentEl || ! newContentEl.length) {
        newContentEl = $('<div id="content"></div>');
        contentEl.replaceWith($('<div></div>', {
          'class': 'container',
          'html': newContentEl
        }));
      }

      // Generate Markdown
      newContentEl.html(marked(markdown));

      // Prettify
      if (prettyPrint) {
        newContentEl.find('code').each(function () {
          this.className = 'prettyprint lang-' + this.className;
        });
        prettyPrint();
      }

      // Style tables
      newContentEl.find('table').each(function () {
        this.className = 'table table-striped table-bordered';
      });

      // Make the images responsive
      newContentEl.find('img').each(function () {
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
            case 'toc-disabled':
              htmlOptions.toc.disabled = true;
              break;
          }
        }
      });

      return htmlOptions;
    },

    normalizeOptions: function (attributeOptions, jsOptions) {
      var settings =  $.extend(
        true, /* deep merge */
        {}, /* target */
        $.fn.strapdown.defaults, attributeOptions, jsOptions);

      if (settings.navbar) {
        settings.navbar.title = settings.navbar.title || ($('title').length ? $('title').get(0).innerHTML : 'Strapdown');
      }

      return settings;
    },

    mainProcess: function (caller, options) {
      if (!marked) {
        console.warn('Marked not found. Unable to proceed further.');
        return;
      }

      var target;

      if (caller.get(0) === document || caller.get(0) === document.body) {
        target = $('xmp,textarea').eq(0);
      } else {
        target = caller;
      }

      var settings = _.normalizeOptions(_.extractAttributeOptions(target), options);
      var updatedDom = _.updateBody(target, settings);

      if (settings.importCss) {
        _.updateHead();
      }

      if (settings.navbar) {
        _.createNavbar(settings);
      }

      if (settings.toc && !settings.toc.disabled) {
        $.fn.strapdown.toc(updatedDom, settings);
      }

      return updatedDom;
    }

  };

  $.fn.strapdown = function (methodOrOptions, optionsIfMethod) {
    if (methodOrOptions === 'toc') {
      return $.fn.strapdown.toc(this, optionsIfMethod);
    } else {
      return _.mainProcess(this, methodOrOptions);
    }
  };

  $.fn.strapdown.importCss = _.importCss;

  $.fn.strapdown.defaults = {
    importCss: false,
    navbar: false,
    toc: false
  };

}( jQuery ));

;
/* global jQuery */
(function( $ ) {
  'use strict';

  var _ = {
    analyzeHeader: function  (elem) {
      var header = {},
          jqElem = $(elem)
          ;

      header.jq = jqElem;
      header.level = elem.tagName[1];  // extract the number from h1,h2, etc.
      header.title = header.jq.text(); // innerHTML would keep inner tags.
      header.hash = elem.id;           // generated by marked

      return header;
    },

    buildTocItem: function  (hash, title) {
      // The <li> is to be closed when all his children have been added.
      return '<li><a href="#' + hash + '">' + title + '</a>';
    },

    generateClosingTags: function (previousLevel, currentLevel) {
      var difference = previousLevel - currentLevel,
          closingTags = ''
          ;

      while (difference--) {
        closingTags += '</ul>';
      }
      closingTags += '</li>';
      return closingTags;
    },

    makeToc: function  (contentEl, settings) {
      var headerLevels = 'h1,h2,h3',
          tocString = '',
          prevLevel
          ;

      contentEl.find(headerLevels).each(function (index, elem) {
        var header = _.analyzeHeader(elem);

        // Building the tag hierarchy
        if (!prevLevel) {
          // Initialization, <ul> tag not needed
        } else if (header.level > prevLevel) {
          tocString += '<ul>';
        } else if (header.level < prevLevel) {
          tocString += _.generateClosingTags(prevLevel, header.level);
        } else {
          tocString += '</li>';
        }

        // add <li>
        tocString += _.buildTocItem(header.hash, header.title, header.level -1);
        prevLevel = header.level;
      });

      tocString += _.generateClosingTags(prevLevel, 1);

      if (settings.toc.topLink) {
        var label = settings.toc.topLink;
        tocString += '<li><a href="#" id="backTop" onlick="' +
                     'jQuery(\'html,body\').animate({scrollTop:0},0);' +
                     '" >' + label + '</a></li>';
      }

      return tocString;
    }
  };

  $.fn.strapdown.toc = function (contentEl, settings) {
    var navbarTocEl = $(settings.toc.dest);

    if (settings && settings.toc && !settings.toc.disabled) {

      if (!contentEl.length) {
        console.warn('No content available to generate the table of content from. Aborting.');
        return this;
      } else if (! navbarTocEl.length ) {
        console.warn('Unable to find the insertion point for the table of content. Aborting.');
        return this;
      } else {
        navbarTocEl.append($('<ul/>', {
          'class': settings.toc.scrollspy ? 'nav navbar-nav' : '',
          'html': _.makeToc(contentEl, settings)
        }));

        if (settings.toc.scrollspy) {
          if ($.fn.scrollspy) {
            setTimeout(function () {
              $('body').scrollspy({
                target: settings.toc.dest,
                offset: settings.toc.scrollspyOffset
              });
            }, 500);
          } else {
            console.warn('boostrap scrollspy is not available.');
          }
        }
      }
    }

    return this;
  };

}( jQuery ));