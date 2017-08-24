;(function ($) {

  $.fn.accordion = function (opts) {

    // SETTINGS
    var config = $.extend({
      type: 'checkbox',
      activeItem: 1
    }, opts);

    return this.each(() => {

      var $accordion = $(this);
      var type = config.type;
      var accordionIndex =  `accordion__${Math.round(Math.random() * 10000)}`;
      var activeItem = config.activeItem;

      var setInput = () => {
        var $accordionHeader = $('.c-accordion__header', $accordion);

        $accordionHeader.each(function (i) {
          var $this = $(this);
          var isActive = (activeItem - 1) == i;
          var inputId = `${accordionIndex}__input-${i}`;

          $this.attr({
            'for': inputId,
            'aria-expanded': isActive
          });
          $(`<input id="${inputId}"
                    class="c-accordion__input"
                    type="${type}"
                    name="${accordionIndex}"
                    ${isActive ? 'checked' : ''} />`).insertBefore($this);
        });
      };

      var setSiblingAriaExpanded = ($currEl) => {
        $('.c-accordion__header', $accordion).not($currEl).each(function () {
          var $this = $(this);

          $this.attr('aria-expanded', function (index, attr) {
            return attr == 'false' ? 'true' : 'false';
          });
        });
      };

      var handleAccordionHeaderClick = () => {
        var $this = $(this);
        var isChecked = $(this).prev('.c-accordion__input').is(':checked');
        var nextIndex = $accordion.find('.c-accordion__header').index(this);

        if (isChecked && type === 'radio') return;

        if (type === 'radio') {
          setTimeout(function () {
            setSiblingAriaExpanded($this);
          }, 10);
        }

        $this.attr('aria-expanded', function (index, attr) {
          return attr == 'false' ? 'true' : 'false';
        });
      };

      var bindEvents = () => {
        var $accordionHeader = $('.c-accordion__header', $accordion);

        $accordionHeader.on('click', handleAccordionHeaderClick);

        $accordion.on('keydown', function (e) {

          var $target = $(e.target);
          var isAccordionHeader = $target.hasClass('c-accordion__header');

          // Enter key
          if (e.keyCode === 13 && isAccordionHeader) {
            $target.click();
          }
        });
      };

      var setTabIndexes = function () {
        var tabindex = $('[tabindex]').not('.c-accordion__header').length;

        $('.c-accordion__header').each(function (i) {
          $(this).attr('tabindex', ++tabindex);
        });
      }

      return (function () {
        setInput();
        setTabIndexes();
        bindEvents();
      }());
    });
  };

}(jQuery));
