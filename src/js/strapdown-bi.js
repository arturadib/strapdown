/* global jQuery */
(function ($) {
	'use strict';

  	// Batteries Included edition: bootstraps strapdown for easy use.

	// Hide body until we're done fiddling with the DOM
	$('body').hide();

	// Launch the whole thing
	var generatedContent = $(document).strapdown({
		importCss: true,
		navbar: {},
		toc: {
			scrollspy: true,    // Enabling scrollspy also add the navbar classes to the toc.
			scrollspyOffset: 70 // Height of the navbar + standard offset
		}
	});

	if ($('.toc').html()) { // If there is a toc, move the content to the side.
		generatedContent.addClass('col-sm-10 col-sm-offset-2');
	}


	$(window).load(function () {
		$('body').show(); // We're done, we can show it.
	});

}(jQuery));