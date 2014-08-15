/* global jQuery */
(function( $ ) {
  'use strict';

  var _ = {
    getAvailableHash: function (hash, titleMap) {
      // Todo improve hashing: avoid multiplying the _'s and
      // get to the next free hash faster.
      // Also do a first pass to process the user-specified ids
      if (titleMap[hash]) {
        return _.getAvailableHash(hash + '_', titleMap);
      } else {
        titleMap[hash] = true;
        return hash;
      }
    },

    analyzeHeader: function  (elem, titleMap) {
      var header = {},
          jqElem = $(elem),
          firstHashBearerChild = jqElem.children('[id],[name]')[0]
          ;

      header.jq = jqElem;
      header.level = elem.tagName[1];  // extract the number from h1,h2, etc.
      header.title = header.jq.text();  // innerHTML would keep inner tags.

      // If a child element already has a hash, just use that
      if (firstHashBearerChild) {
        header.hash = firstHashBearerChild.id || firstHashBearerChild.name;
      }

      if (! header.hash) {
        // Compute a new hash
        var tmpHash = header.title.replace(/[^A-Za-z0-9_-]/g, '');
        header.hash = _.getAvailableHash(tmpHash, titleMap);
      } else {
        titleMap[header.hash] = true;
      }

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

    makeToc: function  (contentEl) {

      var headerLevels = 'h1,h2,h3',
          titleMap = {},
          tocString = '',
          prevLevel
          ;

      contentEl.find(headerLevels).each(function indexHeaders (index, elem) {
        var header = _.analyzeHeader(elem, titleMap);

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
        elem.id = header.hash;
        prevLevel = header.level;
      });

      tocString += _.generateClosingTags(prevLevel, 1);

      if (_.tocData && _.tocData.includeBackToTopLink) {
        var label = _.tocData.backToTopLinkLabel || 'Back to top';
        tocString += '<li><a href="#" id="backTop" onlick="' +
                     'jQuery(\'html,body\').animate({scrollTop:0},0);' +
                     '" >' + label + '</a></li>';
      }

      return tocString;
    }
  };

  $.fn.strapdownToc = function (options) {
    var contentEl    = this, // $('#content')
        navbarEl     = $(options.navbar),
        // navbarEl     = options.navbar, // $('#headline'),
        pageTitle    = navbarEl.text(),
        spiedEl = $('body'),
        newNavbarEl  = $('' +
          '<div class="navbar-header">' +
          ' <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">' +
          '   Table of Contents' +
          ' </button>' +
          ' <span class="navbar-brand" id="headline">'+ pageTitle + '</span>' +
          '</div>' +
          '<div class="toc collapse navbar-collapse"></div>'),
        navbarTocEl  = newNavbarEl.eq(1) // TODO try to split the declaration, then merge with newNavbarEl = newNavbarEl.add(navbarTocEl)
        ;


    navbarTocEl.append($('<ul/>', {
      'class': 'nav navbar-nav',
      'html': _.makeToc(contentEl)
    }));

    $(navbarEl).parent().replaceWith(newNavbarEl);

    // The spiedEl.scrollspy() form doesn't seem to work, so I'm adding the attributes instead
    // (the pure js form works but doesn't put the first link as active. You have to scroll first.)
    // $('body').scrollspy({ target: '.toc', offset: 70 });
    spiedEl.attr('data-target', '.toc');
    spiedEl.attr('data-spy', 'scroll');
    spiedEl.attr('data-offset', '70' /* Height of the navbar + standard offset */);

    contentEl.addClass('col-sm-10 col-sm-offset-2');

    return this;
  };

  // For testing purposes
  $.fn.strapdownToc._internals = _;

}( jQuery ));