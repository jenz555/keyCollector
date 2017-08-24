// -------------------------------
// jQuery Boilerplate Template
// -------------------------------
// Description: Use this template to set up custom jquery plugins for your project
//
// -------------------------------
// USAGE EXAMPLE
// -------------------------------
//
// HTML markup:
// <a class="alert" href="#">Show Alert</a>
//
// Call showAlert on all elements with ".alert" class:
// $('.alert').showAlert({ alert: 'This is an alert message...' });
//
// Plugin Code:
// ;(function ( $ ) {
//
//  'use strict';
//
//  $.als = $.als || {};
//  $.als.plugins = $.als.plugins || {};
//
//  $.als.plugins.showAlert = function ($el, opts) {
//
//    var defaults = {
//      alert: 'This is a default alert message...'
//    };
//
//    var config = $.extend(defaults, opts);
//
//    $el.on('click', function (e) {
//      e.preventDefault();
//      alert(opts.alert);
//    });
//  };
//
//  $.fn.showAlert = function (opts) {
//    return this.each(function () {
//      var alert = new $.als.plugins.showAlert($(this), opts);
//    });
//  }
//
// }( jQuery ));

;(function ( $ ) {

  'use strict';

  $.als = $.als || {};
  $.als.plugins = $.als.plugins || {};

  $.als.plugins.myPlugin = function ($el, opts) {

    var defaults = {
      key1: 'value1',
      key2: 'value2',
      // More defaults...
    };

    var config = $.extend(defaults, opts);

    // Plugin code...
  };

  $.fn.myPlugin = function (opts) {
    return this.each(function () {
      var myPlugin = new $.als.plugins.myPlugin($(this), opts);
    });
  }

}( jQuery ));
