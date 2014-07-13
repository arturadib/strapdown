;(function($, window, document) {
  "use strict";

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
      navbarTocEl  = $(newNavbarEl[1]),
      tocContent   = ''
      ;

  console.log(document.getElementsByTagName('xmp')[0], document.getElementsByTagName('textarea')[0]);

  navbarTocEl.append($('<ul/>', {
    'class': 'nav navbar-nav',
    'html': makeToc(contentEl)
  }));
  $(navbarEl).parent().replaceWith(newNavbarEl);
  
  $('body')
    .attr('data-spy','scroll')
    .attr('data-target','.toc');

  contentEl.addClass('col-sm-10 col-sm-offset-2');


  function makeToc (content) {
    var levelClassPrefix = 'level-',
        headerLevels = 'h1,h2,h3',
        tocItemTpl = [       // poor man's String.format
          '<li><a href="#',
          '',                // 1 - hash
          '">',
          '',                // 3 - title
          '</a>'
        ],
        titleMap = {},
        tocString = '',
        prevLevel
        ;

    contentEl.find(headerLevels).each(function indexHeaders (index, elem) {
      var header = analyzeHeader(elem);

      // Building the tag hierarchy
      if (!prevLevel) {
        // Initialization, <ul> tag not needed
      } else if (header.level > prevLevel) {
        tocString += '<ul>';
      } else if (header.level < prevLevel) {
        tocString += '</ul></li>';
      } else {
        tocString += '</li>';
      }

      // add <li>
      tocString += buildTocItem(header.hash, header.title, header.level -1);
      elem.id = header.hash;
      prevLevel = header.level;
    });

    if (window.strapdownToc && window.strapdownToc.includeBackToTopLink) {
      var label = window.strapdownToc.backToTopLinkLabel || 'Back to top';
      tocString += '<li>' +
          '<a href="#" id="backTop"' +
          ' onlick="jQuery(\'html,body\').animate({scrollTop:0},0);" >' +
          label + '</a></li>';
    }

    return tocString;


    function analyzeHeader (elem) {
      var header = {},
          childHash = ''
          ;

      header.level = elem.tagName[1];  // extract the number from h1,h2, etc.
      header.jq = $(elem);
      header.title = header.jq.text();  // innerHTML would keep inner tags.

      // If a child element already has a hash, just use that
      var firstHashBearerChild = header.jq.children('[id],[name]')[0];
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


    function buildTocItem (hash, title) {
      tocItemTpl[1] = hash || 'hashError';
      tocItemTpl[3] = title || 'titleError';
      return tocItemTpl.join('');
    }
  }

})(window.jQuery, window, document);
