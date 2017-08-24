;(function ($) {

  'use strict';

  if (typeof $.als === 'undefined') {
		throw "Oops! It looks like you are missing globals.js. You can download it from https://github.allstate.com/UIEngineering/UIToolkitBoilerplate/tree/master/assets/scripts/globals.js";
		return;
	}

  $.als.utilities.renderTemplate = function (template, replacements) {
    var regexp, prop;

    for (prop in replacements) {
      if (replacements.hasOwnProperty(prop)) {
        regexp = new RegExp(prop, 'gi');
        template = template.replace(regexp, replacements[prop]);
      }
    }

    return template;
  };

	/*
	 * Gets element left and top offset.
	 *
	 * Takes one parameter - $.als.utilities.offset($(element))
	 * returns type - object.
	*/
	$.als.utilities.offset = function ($el) {
		return {
			left: $el.offset().left,
			top: $el.offset().top
		}
	};

	/*
	 * Determins if all or part of an element is off the screen.
	 *
	 * Takes one parameter - $.als.utilities.screenOverlap($(element))
	 * Returns type - boolean.
	*/
	$.als.utilities.screenOverlap = function ($el) {

	    var
			// Element offset
			offset  	       = $.als.utilities.offset($el),

			// Window dimensions
			winHeight          = $(window).height(),
			winWidth           = $(window).width(),

      // Scroll top
      scrolltop          = $(window).scrollTop(),

			// Element dimensions
			elWidth            = $el.outerWidth(),
			elHeight           = $el.outerHeight(),

			// offset
      elTopOffset        = offset.top,
			elRightOffset      = offset.left + elWidth,
			elBottomOffset     = offset.top + elHeight,

			// Determine if position is overflowing screen
			right              = elRightOffset > winWidth,
			bottom             = elBottomOffset - scrolltop > winHeight,
      top                = elTopOffset < scrolltop
		;

		return {
      'top': top,
			'right': right,
			'bottom': bottom
		};
	};

})(jQuery);
