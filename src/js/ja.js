/**
 *
 * Japanese Text
 *
 * @author Takuto Yanagida
 * @version 2021-12-07
 *
 */


'use strict';

window['NACSS'] = window['NACSS'] || {};


(function (NS) {

	{
		// @include _kerning.js
		NS.jaKerning      = initialize;
		NS.jaApplyKerning = apply;
	}

	{
		// @include _segmenter.js
		NS.jaSegmenter      = initialize;
		NS.jaApplySegmenter = apply;
	}

	// @include _common.js
	// @include _style-class.js

})(window['NACSS']);
