/* global QUnit, jQuery */
(function($, QUnit) {
'use strict';

QUnit.test( 'Initialization', function( assert ) {
	assert.ok( $.fn.strapdown, 'Strapdown available');
	assert.ok( $.fn.strapdown._internals, 'Strapdown internals available');
	assert.ok( $.fn.strapdown.toc, 'StrapdownToc available');
	assert.ok( $.fn.strapdown.toc._internals, 'StrapdownToc internals available');
});

QUnit.test( 'Public API', function( assert ) {
	// var target = ('<xmp></xmp>');
	// target.strapdown();
	assert.ok( true, 'TMP');
});



QUnit.test( 'Internals - extractAttributeOptions', function( assert ) {
	var target, actualOutput, expectedOutput;

	target = $('<xmp></xmp>');
	expectedOutput = {};
	actualOutput = $.fn.strapdown._internals.extractAttributeOptions(target);
	assert.deepEqual(actualOutput, expectedOutput, 'With no attributes');

	target = $('<xmp toc class="something"></xmp>');
	expectedOutput = {toc: {}};
	actualOutput = $.fn.strapdown._internals.extractAttributeOptions(target);
	assert.deepEqual(actualOutput, expectedOutput, 'With some unused attributes and an unspecified used one.');

	target = $('<xmp toc toc-top-link></xmp>');
	expectedOutput = {toc: {topLink: 'Back to top'}};
	actualOutput = $.fn.strapdown._internals.extractAttributeOptions(target);
	assert.deepEqual(actualOutput, expectedOutput);

	target = $('<xmp toc-top-link></xmp>');
	expectedOutput = {toc: {topLink: 'Back to top'}};
	actualOutput = $.fn.strapdown._internals.extractAttributeOptions(target);
	assert.deepEqual(actualOutput, expectedOutput);


	target = $('<xmp toc-top-link="something"></xmp>');
	expectedOutput = {toc: {topLink: 'something'}};
	actualOutput = $.fn.strapdown._internals.extractAttributeOptions(target);
	assert.deepEqual(actualOutput, expectedOutput);
});

QUnit.test( 'Internals - normalizeOptions', function( assert ) {
	var actualOutput, expectedOutput;

	expectedOutput = {toc: false};
	actualOutput = $.fn.strapdown._internals.normalizeOptions({toc: {topLink: 'no this'}}, {toc: false});
	assert.deepEqual(actualOutput, expectedOutput);

	expectedOutput = {toc: {topLink: 'this instead', insertionPoint:'#headline'}};
	actualOutput = $.fn.strapdown._internals.normalizeOptions({toc: {topLink: 'no this'}}, {toc: {topLink: 'this instead'}});
	assert.deepEqual(actualOutput, expectedOutput);
});

}(jQuery, QUnit));