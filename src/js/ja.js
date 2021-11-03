/**
 *
 * Style for Japanese Text (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-11-03
 *
 */


window['NACSS'] = window['NACSS'] || {};


(function (NS) {

	(function () {
		// @include _kerning.js
		NS.jaKerning      = initialize;
		NS.jaApplyKerning = apply;
	})();

	(function () {
		// @include _segmenter-old.js
		NS.jaSegmenterOld      = initialize;
		NS.jaApplySegmenterOld = apply;
	})();

	(function () {
		// @include _segmenter.js
		NS.jaSegmenter      = initialize;
		NS.jaApplySegmenter = apply;
	})();

	// @include _utility.js
	// @include _common.js

})(window['NACSS']);
