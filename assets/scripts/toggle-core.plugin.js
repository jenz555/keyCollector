; (function ($) {

    'use strict';

    if (typeof $.als === 'undefined') {
  		throw "Oops! It looks like you are missing globals.js. You can download it from https://github.allstate.com/UIEngineering/UIToolkitBoilerplate/tree/master/assets/scripts/globals.js";
  		return;
  	}

    $.als.plugins.toggle = function (element, options) {

        var toggle = this;

        toggle.ATTS = {
            TRIGGER: '[data-trigger]',
            TARGET: '[data-target]',
            MODESINGLE: 'single',
            MODEMULTI: 'multi'
        };

        toggle.defaults = {
            mode: null
        };

        var $element = $(element);

        var toggleAttrs;

        // collections to hold triggers and targets
        toggle.$triggers = null;
        toggle.$targets = null;

        toggle.init = function () {

            toggle.settings = $.extend({}, toggle.defaults, options);

            if(toggle.settings.mode == null) toggle.settings.mode = toggle.ATTS.MODESINGLE;

            toggle.$triggers = $element.find(toggle.ATTS.TRIGGER);
            toggle.$targets = $element.find(toggle.ATTS.TARGET);

            switch(toggle.settings.mode){

                case toggle.ATTS.MODESINGLE:

                    if(toggle.$triggers.filter('[aria-selected="true"]').length==0)
                    {
                        toggle.$triggers.eq(0).attr({"aria-selected": "true"});
                    }
                    
                    if(toggle.$targets.filter('[aria-hidden="false"]').length==0)
                    {
                        toggle.$targets.eq(0).attr({"aria-hidden": "false"});
                    }

                    break;

                case toggle.ATTS.MODEMULTI:

                    // if ARIA attributes have not been set in HTML assume them to be the closed / hidden variants
                    var triggersnoARIA = toggle.$triggers.not('[aria-selected]');
                    var targetsnoARIA = toggle.$targets.not('[aria-hidden]');

                    var i;

                    for (i = 0; i < triggersnoARIA.length; i++) {

                        triggersnoARIA.eq(i).attr({"aria-selected": "false"})
                    }

                    for (i = 0; i < targetsnoARIA.length; i++) {

                        targetsnoARIA.eq(i).attr({"aria-hidden": "true"})
                    }

                    break;

            }

            // vars to store the currently and previously selected targets
            toggleAttrs = {currentTarget: toggle.$triggers.filter('[aria-selected="true"]').data("trigger"), 
                           previousTarget: toggle.$triggers.filter('[aria-selected="true"]').data("trigger")};

            toggle.addClickHandlers();

        };

        // Hook up click events for toggles
        toggle.addClickHandlers = function () {

            var i;

            for (i = 0; i < toggle.$triggers.length; i++) {

                $(toggle.$triggers.eq(i)).on("click", function (event) {
                    event.preventDefault();
                    var target = $(event.currentTarget).data('trigger');
                    toggle.toggle(target);
                });

            }
        };

        // toggle event
        toggle.toggle = function (target) {

            switch(toggle.settings.mode){

                case toggle.ATTS.MODESINGLE:

                    toggle.$triggers.attr({"aria-selected": "false"});
                    toggle.$targets.attr({"aria-hidden": "true"});

                    toggle.$triggers.filter('[data-trigger="' + target + '"]').attr({"aria-selected": "true"});
                    toggle.$targets.filter('[data-target="' + target + '"]').attr({"aria-hidden": "false"});

                    // emit events
                    if (target != toggleAttrs.currentTarget){

                        toggleAttrs.previousTarget = toggleAttrs.currentTarget;
                        toggleAttrs.currentTarget = target;

                        $(element).triggerHandler("close", toggleAttrs);
                        $(element).triggerHandler("close_" + toggleAttrs.previousTarget, toggleAttrs);

                        $(element).triggerHandler("open", toggleAttrs);
                        $(element).triggerHandler("open_" + toggleAttrs.currentTarget, toggleAttrs);

                    }

                    $(element).triggerHandler("clicked", toggleAttrs);
                    $(element).triggerHandler("clicked_" + toggleAttrs.currentTarget, toggleAttrs);

                    break;

                case toggle.ATTS.MODEMULTI:

                    toggle.toggleAttr(toggle.$triggers.filter('[data-trigger="' + target + '"]'), 'aria-selected');
                    toggle.toggleAttr(toggle.$targets.filter('[data-target="' + target + '"]'), 'aria-hidden');

                    var ARIAhidden = toggle.$targets.filter('[data-target="' + target + '"]').attr("aria-hidden");

                    // emit events
                    if(typeof toggleAttrs.currentTarget === "undefined") toggleAttrs.currentTarget = target;

                    toggleAttrs.previousTarget = toggleAttrs.currentTarget;
                    toggleAttrs.currentTarget = target

                    $(element).triggerHandler("clicked", toggleAttrs);
                    $(element).triggerHandler("clicked_" + target, toggleAttrs);

                    switch(ARIAhidden){

                        case "true":

                            $(element).triggerHandler("close", toggleAttrs);
                            $(element).triggerHandler("close_" + toggleAttrs.previousTarget, toggleAttrs);

                            break;

                        case "false":
                            
                            $(element).triggerHandler("open", toggleAttrs);
                            $(element).triggerHandler("open_" + toggleAttrs.currentTarget, toggleAttrs);

                            break;

                    }

                    break;

            }
            
        };

        toggle.toggleAttr = function(target, attr)
        {
            switch(attr){

                case "aria-selected":
                    target.attr(attr, target.attr(attr) == 'true' ? 'false' : 'true');
                    break;

                case "aria-hidden":
                    target.attr(attr, target.attr(attr) == 'false' ? 'true' : 'false');
                    break;

                default:
                    target.attr(attr, target.attr(attr) == 'true' ? 'false' : 'true');
                    break;
            }
            
        }


        toggle.init();

    }

    
    $.fn.als_toggle = function (options) {
        return this.each(function () {
            if (undefined == $(this).data('data-toggle')) {
                var toggle = new $.als.plugins.toggle(this, options);
                $(this).data('data-toggle', toggle);
            }
        });
    }
    

})(jQuery);


