(function ($) {

  'use strict';

  $.fn.header = function () {
    return this.each(function () {

      var $this = $(this);

      $('.header__mobileUtil', $this).unbind('click').on('click', function (e) {
        e.stopPropagation();
        $this.toggleClass('hamburger__navicon--isActive');
        $('.togglePanel', $this).slideToggle('nav--show');
      });

      $(document).keyup(function (e) {
        if (e.keyCode == 27) {
          $('.togglePanel').slideUp().removeClass('nav--show');
          $('.header__mobileUtil').removeClass('hamburger__navicon--isActive');
        }
      });

      $(document).on('click', function () {
        if ($('.togglePanel').is(':visible')) {
          $('.togglePanel').slideUp().removeClass('nav--show');
          $('.header__mobileUtil').removeClass('hamburger__navicon--isActive');
        }
      });

    });
  }

  $('.global-header').header();

}(jQuery));
