/* global jQuery */
(function ($) {
  'use strict';

  // Hide body until we're done fiddling with the DOM
  $('body').hide();
  $(document).strapdown();
  $('body').show();

  // @TODO: properly shows the body once everything is done, but then the scrollspy isn't properly initialized
  // $(window).load(function () {
  //   $('body').show();
  // });
}(jQuery));