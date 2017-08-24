var NRD = NRD || {};

(function (APP) {

    $(function () {
        APP.checkLists.init();
    });

    APP.checkLists = {
        init: function () {
            this.myCheckList = new APP.CheckList();
        }
    };

    APP.CheckList = (function () {

        // Setup Indicator
        var CheckList = function () {
            this.SELECTORS = {
                TRIGGER: '.js-checkList',
                SCREENREADER_ALERT: '.js-alertDialog'
            };

            this.CRITERIA = {
                CHECKLIST_LENGTH: '.js-checkListLength',
                CHECKLIST_LOWERCASE: '.js-checkListLowercase',
                CHECKLIST_NUMBER: '.js-checkListNumber',
                CHECKLIST_SPECIAL_CHARACTERS: '.js-checkListSpecialCharacters'
            };

            this.STATES = {
                HIDDEN_STATE: 'isPageHidden',
                VALID_STATE: 'isValid',
                INVALID_STATE: 'isInvalid',
                CHECKLIST_VALID_STATE: 'checkList__item--isValid'
            };

            this.init();
        };

        var proto = CheckList.prototype;

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
            this.$triggers = $(this.SELECTORS.TRIGGER);
            this.$screenreaderAlert = $(this.SELECTORS.SCREENREADER_ALERT);

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
            this.checkPasswordCriteria();

            return this;
        };

        proto.onBlur = function (event) {
            this.$screenreaderAlert.removeClass(this.STATES.HIDDEN_STATE);

            if (this.$screenreaderAlert.hasClass(this.STATES.INVALID_STATE)) {
                this.$screenreaderAlert.text('password invalid');
            } else {
                this.$screenreaderAlert.text('password valid');
            }
        };

        proto.checkPasswordCriteria = function () {
            var score = 0;
            var listValue = this.$triggers.val();

            this.$screenreaderAlert.addClass(this.STATES.HIDDEN_STATE);

            if (listValue.length >= 6 && listValue.length <= 14) {
                $(this.CRITERIA.CHECKLIST_LENGTH).addClass(this.STATES.CHECKLIST_VALID_STATE);
                score++;
            } else {
                $(this.CRITERIA.CHECKLIST_LENGTH).removeClass(this.STATES.CHECKLIST_VALID_STATE);
            }

            //at least 1 lower letter in password
            if (listValue.match(/[a-z]/)) {
                $(this.CRITERIA.CHECKLIST_LOWERCASE).addClass(this.STATES.CHECKLIST_VALID_STATE);
                score++;
            } else {
                $(this.CRITERIA.CHECKLIST_LOWERCASE).removeClass(this.STATES.CHECKLIST_VALID_STATE);
            }

            //at least 1 digit in password 
            if (listValue.match(/\d/)) {
                $(this.CRITERIA.CHECKLIST_NUMBER).addClass(this.STATES.CHECKLIST_VALID_STATE);
                score++;
            } else {
                $(this.CRITERIA.CHECKLIST_NUMBER).removeClass(this.STATES.CHECKLIST_VALID_STATE);
            }

            // check to make sure doesn't contain space, <, or >
            if (!listValue.match(/[<,>,\s]/) && listValue.length > 0) {
                $(this.CRITERIA.CHECKLIST_SPECIAL_CHARACTERS).addClass(this.STATES.CHECKLIST_VALID_STATE);
                score++;
            } else {
                $(this.CRITERIA.CHECKLIST_SPECIAL_CHARACTERS).removeClass(this.STATES.CHECKLIST_VALID_STATE);
            }

            // check password strength to determine validation
            if (score == 4) {
                this.$triggers.attr({
                    'aria-invalid': 'false'
                });

                this.$screenreaderAlert.removeClass(this.STATES.INVALID_STATE);
            } else {
                this.$triggers.attr({
                    'aria-invalid': 'true'
                });

                this.$screenreaderAlert.addClass(this.STATES.INVALID_STATE);
            }
        };

        return CheckList;

    }());

}(NRD));