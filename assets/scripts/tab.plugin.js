; (function ($) {

    'use strict';

    if (typeof $.als === 'undefined') {
        throw "Oops! It looks like you are missing globals.js. You can download it from https://github.allstate.com/UIEngineering/UIToolkitBoilerplate/tree/master/assets/scripts/globals.js";
        return;
    }

    if (typeof $.als.plugins.toggle === 'undefined') {
        throw "Oops! It looks like you are missing toggle-core.plugin.js. You can download it from https://github.allstate.com/UIEngineering/UIToolkitBoilerplate/tree/master/assets/scripts/toggle-core.plugin.js";
        return;
    }

    $.als.plugins.tab = function (element, options) {

        // set some tab-only properties
        var ATTS = {
            MODESINGLE: 'single',
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            UP: 38
        };

        options.mode = ATTS.MODESINGLE;

        // instantiate a toggle-core object
        var tab = new $.als.plugins.toggle($(element), options);

        tab.$triggersParent = tab.$triggers.eq(0).parent();

        // Add ARIA attributes to the tab control
        tab.addAttrs = function () {

            tab.$triggersParent.attr({"role": "tablist"});
            tab.$triggers.attr({"role": "tab", "tabindex": "-1"});
            tab.$targets.attr({"role": "tabpanel", "tabindex": "0"});

            tab.$triggers.filter('[aria-selected="true"]').attr({"tabindex": "0"});

        };

        // Add tab-specific click handler
        tab.addTabClickHandlers = function () {

            var i;

            for (i = 0; i < tab.$triggers.length; i++) {

                $(tab.$triggers.eq(i)).on("click", function (event) {
                    event.preventDefault();
                    var target = $(event.currentTarget).data('trigger');
                    tab.toggleARIA(target);
                });

            }
        };

        // Add keypress events to the tab control (up, down, left, right arrow keys)
        tab.addKeyHandlers = function () {

            for (var i = 0; i < tab.$triggers.length; i++) {

                $(tab.$triggers.eq(i)).on("keydown", function (event) {

                    var target;

                    switch (event.keyCode) {

                        case ATTS.DOWN: case ATTS.RIGHT:

                            event.preventDefault();

                            if($(event.currentTarget).next().length !=0){
                                target = $(event.currentTarget).next().data('trigger');
                            }
                            else{
                                target = tab.$triggers.eq(0).data('trigger');
                            }

                            tab.toggle(target);
                            tab.toggleARIA(target);

                            break;

                        case ATTS.UP: case ATTS.LEFT:

                            event.preventDefault();

                            if($(event.currentTarget).prev().length !=0){
                                target = $(event.currentTarget).prev().data('trigger');
                            }
                            else{
                                target = tab.$triggers.eq(tab.$triggers.length - 1).data('trigger');
                            }

                            tab.toggle(target);
                            tab.toggleARIA(target);

                            break;

                    }

                 });

            }

        };

        // Execute the default toggle and also toggle ARIA attributes
        tab.toggleARIA = function (target) {

            tab.$triggers.attr({"tabindex": "-1"});
            tab.$triggers.filter('[data-trigger="' + target + '"]').attr({"tabindex": "0"}).focus();

        };

        // hook up our tab events
        tab.addAttrs();
        tab.addTabClickHandlers();
        tab.addKeyHandlers();

    }

    $.fn.als_tab = function (options) {
        return this.each(function () {
            if (undefined == $(this).data('data-tab')) {
                var tab = new $.als.plugins.tab(this, options);
                $(this).data('data-tab', tab);
            }
        });
    }


})(jQuery);
