/**
 *
 * Japanese Text
 *
 * @author Takuto Yanagida
 * @version 2021-11-11
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
		// @include _segmenter.js
		NS.jaSegmenter      = initialize;
		NS.jaApplySegmenter = apply;
	})();

	// @include _style-class.js
	// @include _common.js

})(window['NACSS']);
