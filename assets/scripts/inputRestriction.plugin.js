;(function ($) {

  'use strict';

  var proto;

  $.als.plugins.RestrictUserInputValue = function ($input) {

    // Reference to nput
    this.$input = $input,

    // Restriction type
    this.REG_EXP = this.$input.data('input-allow');

    this.KEYCODE_EXCEPTIONS = [8, 9, 32, 37, 38, 39, 40, 46];

    this.ASCII_CODES = {
      '188': '44', // comma
      '109': '45', // subtract
      '190': '46', // period
      '191': '47', // forward slash
      '220': '92', // back slash
      '222': '39', // single quote
      '221': '93', // close braket
      '219': '91', // open bracket
      '173': '45', // dash
      '187': '61', // equal sign
      '186': '59', // semi-colon
      '189': '45'  // subtract
    };

    this.SHIFT_KEY_CODES = {
      "96": "~",
      "49": "!",
      "50": "@",
      "51": "#",
      "52": "$",
      "53": "%",
      "54": "^",
      "55": "&",
      "56": "*",
      "57": "(",
      "48": ")",
      "45": "_",
      "61": "+",
      "91": "{",
      "93": "}",
      "92": "|",
      "59": ":",
      "39": "\"",
      "44": "<",
      "46": ">",
      "47": "?"
    };

    // Initialize
    this.init(['bindEvents']);
  };

  proto = $.als.plugins.RestrictUserInputValue.prototype;

  // Bind jQuery events
  proto.bindEvents = function () {
    var self = this;

    this.$input.on('keydown', function (e) {
      self.handleKeypressEvent(self, e);
    });

    return this;
  };

  // validate input
  proto.handleKeypressEvent = function (self, e) {

    var keycode = window.event ? e.keyCode : e.which;

    // If keycode is an exception, allow it.
    if (self.KEYCODE_EXCEPTIONS.indexOf(keycode) > -1) {
      return;
    }

    // If key pressed is not a letter or number
    if (self.ASCII_CODES.hasOwnProperty(keycode)) {
      keycode = self.ASCII_CODES[keycode];
    }

    // If key pressed is a letter convert keycode to the actual value.
    if (!e.shiftKey && (keycode >= 65 && keycode <= 90)) {
      keycode = String.fromCharCode(keycode + 32);
    }

    // If key on numeric keypad is pressed
    else if (!e.shiftKey && (keycode >= 96 && keycode <= 105)) {
      keycode = String.fromCharCode(keycode - 48);
    }

    // If shift key is pressed, map the keycode to the corresponding
    // key/Value pair in the SHIFT_KEY_CODES object.
    else if (e.shiftKey && self.SHIFT_KEY_CODES.hasOwnProperty(keycode)) {
      keycode = self.SHIFT_KEY_CODES[keycode];
    }

    // If none of the above
    else {
      keycode = String.fromCharCode(keycode);
    }

    // Validate keycode value agains regular expression
    if (!keycode.match(new RegExp(self.REG_EXP))) {
      e.preventDefault();
    }

    return this;
  };

  // Initializer
  proto.init = function (events) {

    var self = this;

    events.forEach(function (event) {
      self[event]();
    });

    return this;
  };

  $.fn.restrictUserInputValue = function () {
    return this.each(function () {
      new $.als.plugins.RestrictUserInputValue($(this));
    });
  };

}(jQuery));
