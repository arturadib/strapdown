;(function($, window, document) {
  'use strict';

  console.log('toc');

  function makeToc (contentEl) {

    function getAvailableHash (hash, titleMap) {
      // Todo improve hashing: avoid multiplying the _'s and
      // get to the next free hash faster.
      // Also do a first pass to process the user-specified ids
      if (titleMap[hash]) {
        return getAvailableHash(hash + '_', titleMap);
      } else {
        titleMap[hash] = true;
        return hash;
      }
    }

    function analyzeHeader (elem, titleMap) {
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
        header.hash = getAvailableHash(tmpHash, titleMap);
      } else {
        titleMap[header.hash] = true;
      }

      return header;
    }

    function buildTocItem (hash, title) {
      // The <li> is to be closed when all his children have been added.
      return '<li><a href="#' + hash + '">' + title + '</a>';
    }

    function generateClosingTags(previousLevel, currentLevel) {
      var difference = previousLevel - currentLevel,
          closingTags = ''
          ;

      while (difference--) {
        closingTags += '</ul>';
      }
      closingTags += '</li>';
      return closingTags;
    }

    var headerLevels = 'h1,h2,h3',
        titleMap = {},
        tocString = '',
        prevLevel
        ;

    contentEl.find(headerLevels).each(function indexHeaders (index, elem) {
      var header = analyzeHeader(elem, titleMap);

      // Building the tag hierarchy
      if (!prevLevel) {
        // Initialization, <ul> tag not needed
      } else if (header.level > prevLevel) {
        tocString += '<ul>';
      } else if (header.level < prevLevel) {
        tocString += generateClosingTags(prevLevel, header.level);
      } else {
        tocString += '</li>';
      }

      // add <li>
      tocString += buildTocItem(header.hash, header.title, header.level -1);
      elem.id = header.hash;
      prevLevel = header.level;
    });

    tocString += generateClosingTags(prevLevel, 1);

    if (window.strapdownToc && window.strapdownToc.includeBackToTopLink) {
      var label = window.strapdownToc.backToTopLinkLabel || 'Back to top';
      tocString += '<li><a href="#" id="backTop" onlick="' +
                   'jQuery(\'html,body\').animate({scrollTop:0},0);' +
                   '" >' + label + '</a></li>';
    }

    return tocString;
  }

  console.log('run');

  debugger; // jshint ignore:line

  var contentEl    = $('#content'),
      navbarEl     = $('#headline'),
      pageTitle    = navbarEl.text(),
      newNavbarEl  = $('' +
        '<div class="navbar-header">' +
        ' <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">' +
        '   Table of Contents' +
        ' </button>' +
        ' <span class="navbar-brand" id="headline">'+ pageTitle + '</span>' +
        '</div>' +
        '<div class="toc collapse navbar-collapse"></div>'),
      navbarTocEl  = $(newNavbarEl[1])
      ;

  navbarTocEl.append($('<ul/>', {
    'class': 'nav navbar-nav',
    'html': makeToc(contentEl)
  }));

  $(navbarEl).parent().replaceWith(newNavbarEl);

  $('body').scrollspy({ target: '.toc' });

  contentEl.addClass('col-sm-10 col-sm-offset-2');

  console.log('run done');

})(window.jQuery, window, document);
