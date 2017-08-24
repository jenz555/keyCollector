var NRD = NRD || {};

(function (APP) {

    $(function () {
        APP.trays.init();
    });

    APP.trays = {
        init: function () {
            this.tray = new APP.Tray($('.js-tray'));
        }
    };

    APP.Tray = (function () {

        // Setup Indicator
        var Tray = function ($element) {
            this.SELECTORS = {
                TRIGGERS: '.js-trayTrigger',
                TARGET: '.js-trayTarget'
            };

            this.STATES = {
                ACTIVE_STATE: 'tray--isActive'
            };

            this.$element = $element;

            if (!$element.length) {
                return;
            }

            this.init();
        };

        var proto = Tray.prototype;

        // Initialize Indicator
        proto.init = function () {

            this.setupHandlers()
                .createChildren()
                .enable();

            return this;
        };

        proto.setupHandlers = function () {
            this.onFocusHandler = this.onFocus.bind(this);
            this.onBlurHandler = this.onBlur.bind(this);

            return this;
        };

        proto.createChildren = function () {
            this.$triggers = this.$element.find(this.SELECTORS.TRIGGERS);
            this.$target = this.$element.find(this.SELECTORS.TARGET);

            return this;
        };

        proto.enable = function () {
            if (this.isEnabled === true) {
                return;
            }

            this.isEnabled = true;
            this.$triggers.on('focus', this.onFocusHandler);
            this.$triggers.on('blur', this.onBlurHandler);
            this.$triggers.on('keyup', this.onFocusHandler);

            return this;
        };

        proto.onFocus = function (event) {
            var target = $(event.currentTarget);
            target.nextAll(this.SELECTORS.TARGET).addClass(this.STATES.ACTIVE_STATE);
        };

        proto.onBlur = function (event) {
            var target = $(event.currentTarget);

            this.$target.removeClass(this.STATES.ACTIVE_STATE);
            target.nextAll(this.SELECTORS.TARGET).removeClass(this.STATES.ACTIVE_STATE);
        };

        return Tray;

    }());

}(NRD));