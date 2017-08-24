;(function ($) {

    'use strict';

    if (typeof $.als === 'undefined') {
  		throw "Oops! It looks like you are missing globals.js. You can download it from https://github.allstate.com/UIEngineering/UIToolkitBoilerplate/tree/master/assets/scripts/globals.js";
  		return;
  	}

    var closableMessage = function ($this) {
        var closableMessage = $this;
        closableMessage.removeFromDom = function() {
            closableMessage.slideUp("fast", function() {
                closableMessage.remove();
            });
        }
        closableMessage.find('.message__icon-close').on('click touchstart', function() {
            closableMessage.removeFromDom();
        });

        return closableMessage;
    };

    $.fn.closeWarningMessage = function () {
        return this.each(function () {
            new closableMessage($(this));
        });
    };

})(jQuery);
