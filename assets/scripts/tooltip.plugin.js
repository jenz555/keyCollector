;(function ($) {

    'use strict';

    if (typeof $.als === 'undefined') {
  		throw "Oops! It looks like you are missing globals.js. You can download it from https://github.allstate.com/UIEngineering/UIToolkitBoilerplate/tree/master/assets/scripts/globals.js";
  		return;
  	}

    // Tooltip plugin.
    // ----------------------------------------------------------------
    $.als.plugins.tooltip = function (element, config) {

        var tooltip = this, hasOverlap, timeout;

        // Object to store class namse.
        var CLASSES = {
            TOOLTIP_HIDDEN: 'tooltip__content--hidden',
            TOASTER_ACTIVE: 'tooltip__content--toaster--isActive',
            TOOLTIP_RIGHT: 'tooltip__content--rightAligned',
            TOOLTIP_TOP: 'tooltip__content--topAligned',
            TOOLTIP_BOTTOM: 'tooltip__content--bottomAligned'
        };

        // Object to store element references.
        var ELEMENTS = {
            ALL_TOOLTIPS: $('.tooltip__content', '.tooltip'),
            TOOLTIP: $('.tooltip__content', element),
            CARET: $('.tooltip__content:after', element)
        };

        // Object to store arrays of methods to be used by tooltip.initialize().
        var METHODS = {
            SHOW: [
              'hideAll',
      				'toggleTooltipVisibility',
              'setModifiers',
      				'setPosition',
      				'positionTooltipCaret',
      				'toggleAriaHiddenAttr',
              'handleOnShowCallback'
            ],
            HIDE: [
      				'toggleTooltipVisibility',
      				'toggleAriaHiddenAttr',
      				'reset',
              'handleOnHideCallback'
            ]
        };

        // Empty array to store modifier classes. Eventually converted into
        // a string and appended to the .tooltip element.
        var MODIFIERS = [];

        // defaults
        var defaults = {
            modifierClass: null,
            delay: 0,
            onclick: false,
            toaster: ELEMENTS.TOOLTIP.hasClass('tooltip__content--toaster') ? true : false
        };

        // Extends default options with those set by the "data-tooltip" attribute
        var config = $.extend({}, defaults, config);

        // Binds event handlers to element
        tooltip.bindEventHandlers = function () {

            var isTouchDevice = 'ontouchstart' in document.documentElement, evts;

            if (config.onclick || config.toaster || isTouchDevice) {
                evts = 'click';

                // Close tooltip when clicking away from element.
                $(document).on('click touchstart', function () {
                  tooltip.hideAll();
                });
            }
            else {
                evts = 'mouseenter mouseleave';

                // Prevents awkward flickering when clicking on element.
                $(element).on('click', function () { return false; });

                // Bind events to .tooltip element
                ELEMENTS.TOOLTIP.on('mouseenter mouseleave', tooltip.handleTooltipHoverEvents);
            }

            // Bind events to .tooltip element
            $(element).on(evts, element, function (e) {

                // If mouseleave, delay the hiding of tooltip for 300 milliseconds.
                // This gives the user enough time to hover over the .tooltip element,
                // subsequently, calling clearTimeout() to cancel the the timer that
                // hides the tooltip after the specified duration.
                if (e.type === 'mouseleave') {
                    timeout = setTimeout(function () {
                        tooltip.initTooltip(e);
                    }, config.delay);
                }
                else {
                    tooltip.initTooltip(e);
                }
            });

            return this;
        },

        tooltip.handleOnShowCallback = function () {
          if (config.onShow) config.onShow();
          return this;
        };

        tooltip.handleOnHideCallback = function () {
          if (config.onHide) config.onHide();
          return this;
        };

        // Calls clearTimeout() to cancel previously set timer.
        // Prevents tooltip from being hidden on mouseover.
    		tooltip.handleTooltipHoverEvents = function (e) {
    		    if (e.type === 'mouseleave') {
    		        tooltip.initTooltip(e);
    		    }
    		    else {
    		        clearTimeout(timeout);
    		    }
    		    e.stopPropagation();
    		},

        // For tooltips triggered on click, hide tooltips when clicking outside of element.
    		tooltip.hideAll = function () {

    		    ELEMENTS.ALL_TOOLTIPS.addClass(CLASSES.TOOLTIP_HIDDEN);

    		    tooltip.reset();

    		    return this;
    		},

            // Initialize
            // Loops through an array of methods and fires them off sequentially.
    		tooltip.initialize = function (methods) {

    		    methods.map(function (method) {
    		        return tooltip[method]();
    		    });

    		    return this;
    		}

          // Initialize the toolitp
          tooltip.initTooltip = function (e) {

              var isVisible = !$(ELEMENTS.TOOLTIP).hasClass(CLASSES.TOOLTIP_HIDDEN);

              tooltip.initialize(isVisible ? METHODS.HIDE : METHODS.SHOW);

              e.stopPropagation();

              return this;
          };

          // Positions tooltip caret.
          // Since jquery cannot style a pseudo class, a style tag is temporarilly appended
          // to the document head with style that position the caret.
          tooltip.positionTooltipCaret = function () {

              var elWidth = $(element).width(),
  				cssRule = hasOverlap.right ? 'right' : 'left',
  				css = '<style id="caretPseudo">.tooltip__content:after { ' + cssRule + ': ' + (elWidth / 2 - 10) + 'px; }</style>';

              if (ELEMENTS.PSEUDOCARET) {
                  ELEMENTS.PSEUDOCARET.remove();
              }

              $('head').append(css);

              ELEMENTS.PSEUDOCARET = $('#caretPseudo');

              return this;
          };

          // Resets the tooltip
          tooltip.reset = function () {

              if (ELEMENTS.PSEUDOCARET) {
                  ELEMENTS.PSEUDOCARET.remove();
              }

              MODIFIERS.map(function (modifier) {
                  $(ELEMENTS.TOOLTIP).removeClass(modifier);
              });

              MODIFIERS = [];

              return this;
          };

          // Sets .tooltip modifier classes from the MODIFIERS array.
          // The array is converted to a string and appended to the .tooltip element.
          tooltip.setModifiers = function () {

              if (config.toaster) {
                  MODIFIERS.push(CLASSES.TOASTER_ACTIVE);
              }

              if (config.modifierClass) {
                MODIFIERS.push(config.modifierClass);
              }

              $(ELEMENTS.TOOLTIP).toggleClass(MODIFIERS.join(' '));

              return this;
          };


          // Positions the tooltip so it does not run off the page.
          tooltip.setPosition = function () {

              hasOverlap = $.als.utilities.screenOverlap($(ELEMENTS.TOOLTIP));

              if (hasOverlap.top) {
                MODIFIERS.push(CLASSES.TOOLTIP_BOTTOM);
              }

              // If tooltip overflows right only
              if (hasOverlap.right) {
                MODIFIERS.push(CLASSES.TOOLTIP_RIGHT);
              }

              // If tooltip overflows bottom only
              if (hasOverlap.bottom) {
                MODIFIERS.splice(MODIFIERS.indexOf(CLASSES.TOOLTIP_BOTTOM), 1);
              }

              tooltip.setModifiers();

              return this;
          };

          // Toogle tooltip arria-hidden attribute
          tooltip.toggleAriaHiddenAttr = function () {
              ELEMENTS.TOOLTIP.attr('aria-hidden', function () {
                  return $(this).attr('aria-hidden') === 'true' ? 'false' : 'true';
              });
          },

        // Toggles tooltip visibility
    		tooltip.toggleTooltipVisibility = function () {

    		    ELEMENTS.TOOLTIP.toggleClass(CLASSES.TOOLTIP_HIDDEN);

    		    return this;
    		};

        // Initialize the tooltip
        tooltip.initialize(['bindEventHandlers']);

        return tooltip;
    }

    // Tooltip Plugin
    $.fn.tooltip = function (config) {
        return this.each(function () {
            var tooltip = new $.als.plugins.tooltip(this, config);
        });
    };

})(jQuery);
