var toastFactory = (function ($) {

  'use strict';

  var options;

  var defaults = {
    duration: 5000,
    position: null,
    type: 'normal',
    message: ''
  };

  const CLASSES = {
    TOAST: 'c-toast',
    TOASTER: 'c-toaster',
    TOAST_CLOSE: 'c-toast__close',
    TOAST_CONTENT: 'c-toast__content',
  };

  // Bind click event to toast close button
  var bindCloseHandlerToNewToast = function () {
    const $newPieceOfToast = $(`.${CLASSES.TOASTER}`).children(':last');

    $newPieceOfToast.hide().slideToggle();

    $(`.${CLASSES.TOAST_CLOSE}`, $newPieceOfToast).on('click', function () {
      destroyToast($(this).parents(`.${CLASSES.TOAST}`));
    });

    setTimeout(function () {
      destroyToast($newPieceOfToast);
    }, options.duration);
  }

  // Create toast dock and toasts
  var makeToast = function (opts) {

    options = $.extend(defaults, opts);

    CLASSES.TOAST_ANIMATIONS = opts.position === 'top' ? 'animated bounceInDown' : 'animated bounceInUp';
    CLASSES.TOAST__TYPE = opts.type !== null ? `c-toast--${opts.type}` : '';

    const toasterClass = options.position ? `${CLASSES.TOASTER}__${options.position}` : '';

    const toasterIsSet = $(`.${CLASSES.TOASTER}`).length > 0;

    const $toaster = toasterIsSet
                        ? $(`.${CLASSES.TOASTER}`)
                        : $(`<div class="${CLASSES.TOASTER} ${toasterClass}">`);

    const toastTemplate = `
      <div class="${CLASSES.TOAST} ${CLASSES.TOAST_ANIMATIONS} ${CLASSES.TOAST__TYPE}">
        <div class="${CLASSES.TOAST_CONTENT}">
          ${options.message || ''}
        </div>
        <button class="${CLASSES.TOAST_CLOSE}">+</button>
      </div>
    `;

    const $toast = $(toastTemplate);

    $toast.appendTo($toaster);

    if (!toasterIsSet) {
      $toaster.appendTo('body');
    }

    bindCloseHandlerToNewToast();
  };

  // Destroys instance of a toast
  var destroyToast = function ($el) {
    $el.addClass('animated bounceOutRight');
    setTimeout(function () {
      $el.slideToggle(300, function () {
        $(this).remove();
        if (!$(`.${CLASSES.TOASTER}`).children().length) {
          $(`.${CLASSES.TOASTER}`).remove();
        }
      });
    }, 700);
  };

  return {
    makeToast: makeToast
  }

}(jQuery));
