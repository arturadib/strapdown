/* global jQuery */
(function ($) {
  'use strict';

  // Hide body until we're done fiddling with the DOM
  $('body').hide();

  $.strapdown();

  $('body').show();
}(jQuery));