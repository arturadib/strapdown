/* global jQuery */
(function ($) {
  'use strict';

  // Hide body until we're done fiddling with the DOM
  $('body').hide();

  $(document).strapdown();

  $(window).load(function () {
    $('body').show();
  });
}(jQuery));