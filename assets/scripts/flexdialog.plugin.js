;
(function() {

  'use strict';

  if (typeof $.als === 'undefined') {
    throw "Oops! It looks like you are missing globals.js. You can download it from https://github.allstate.com/UIEngineering/UIToolkitBoilerplate/tree/master/assets/scripts/globals.js";
    return;
  }

  // Flex Dialog Plugin
  // ----------------------------------------------------------------
  $.als.plugins.flexDialog = function(element, config) {

    var dialog = this,

      // Get instance of target dialog
      target = $('#' + config.target),

      // Is dialog a non modal?
      isNonModalDialog = target.hasClass('dialogNonModal'),

      // Set plugin dfaults
      defaults = {
        overlay: isNonModalDialog ? false : true,
        blockOverlayClick: false,
        closeBtn: true,
        activeClass: isNonModalDialog ? 'dialogNonModal--active' : 'dialogModal--active',
        overlayClass: ''
      },

      // Classes object
      CLASSES = {},

      // Elements object
      ELEMENTS = {
        $body: $('body')
      },

      // Errors object
      ERRORS = {
        UNDEFINED_TARGET: 'target is required but was not specified',
        UNDEFINED_CALLBACK: 'callback is not defined',
        ASYNC_NO_URL: 'a data source URL is required for asyncronous requests',
        NON_JSON_DATA: 'asyncronous call made with non JSON data type'
      };

    // Adds an overlay to block user interaction and focus attention on the modal.
    dialog.addOverlay = function() {
      ELEMENTS.$overlay = $('<div id="overlay" class="clickableOverlay clickableOverlay--active ' + dialog.config.overlayClass + '" />');

      $('.clickableOverlay').remove();

      if (ELEMENTS.$overlay) {
        ELEMENTS.$body.append(ELEMENTS.$overlay);
        ELEMENTS.$overlay.hide().fadeIn();
      }

      if (!dialog.config.blockOverlayClick) {
        ELEMENTS.$overlay.on('click', dialog.hideDialog);
      }

      return this;
    };

    // Bind event handlers
    dialog.bindEventHanders = function() {
      ELEMENTS.$el.on('click', dialog.showDialog);
      ELEMENTS.$close_btn.on('click', dialog.hideDialog);
      $(document).on('keyup', dialog.handleEscapeKeyPress);
      return this;
    };

    // Debug configuration errors
    dialog.debug = function() {
      if (config.async && !config.async.url) {
        throw 'configuration error: ' + ERRORS.ASYNC_NO_URL;
      }
      if (config.async && config.async.data && typeof config.async.data !== 'object') {
        throw 'configuration error: ' + ERRORS.NON_JSON_DATA;
      }
      if (typeof config.target === 'undefined') {
        throw 'configuration error: ' + ERRORS.UNDEFINED_TARGET;
      }
      if (typeof config.callback !== 'undefined' && config.callback === '') {
        throw 'configuration error: ' + ERRORS.UNDEFINED_CALLBACK;
      }
      return this;
    };

    // handle keyup event
    dialog.handleEscapeKeyPress = function(e) {
      var isEscapeKey = e.keyCode === 27;
      if (isEscapeKey && $('.' + CLASSES.DIALOG_ACTIVE).length) {
        dialog.hideDialog(e);
      }
    };

    // Hides the dialog
    dialog.hideDialog = function(e) {

      e.preventDefault();

      if (ELEMENTS.$overlay) {
        ELEMENTS.$overlay.fadeOut(function() {
          $(this).remove();
          ELEMENTS.$body.removeClass('noScroll');
        });
      } else {
        ELEMENTS.$body.removeClass('noScroll');
      }

      if (dialog.config.onHide) {
        setTimeout(function() {
          dialog.config.onHide()
        }, 500);
      }

      ELEMENTS.$target.removeClass(CLASSES.DIALOG_ACTIVE);

      return this;
    };

    // Initializer
    dialog.init = function() {

      // Debug
      dialog.debug();

      // Set configuration
      dialog.config = $.extend({}, defaults, config);

      dialog
        .setClasses()
        .setElements()
        .bindEventHanders()
        .setDialogUI();

      // Load dialog content via AJAx
      if (dialog.config.async) {
        dialog.loadAsyncContent();
      }
    }

    // Loads dialog content via AJAX
    dialog.loadAsyncContent = function() {

      var url = dialog.config.async.url,
        data = dialog.config.async.data ? dialog.config.async.data : {};

      $.ajax({
          url: url,
          type: 'GET',
          data: data,
          dataType: 'html'
        })
        .success(function(res) {
          ELEMENTS.$target.find('.dialog__body').remove();
          $(res).insertBefore(ELEMENTS.$target.find('.dialog__footer'));
          dialog.setDialogUI();
        })
        .fail(function(res) {
          throw res.statusText;
        });
    };

    // Sets the CLASSES object
    dialog.setClasses = function() {
      CLASSES.DIALOG_ACTIVE = dialog.config.activeClass;
      return this;
    };

    // Set the dialog UI with necessary classes
    dialog.setDialogUI = function() {
      if (!dialog.config.closeBtn) {
        $('.dialog__close', ELEMENTS.$target).addClass('isHidden');
      }
      if (dialog.config.modifiers) {
        $(ELEMENTS.$target).addClass(dialog.config.modifiers);
      }
      return this;
    };

    // Sets the ELEMENTS object
    dialog.setElements = function() {
      ELEMENTS.$el = $(element);
      ELEMENTS.$target = target;
      ELEMENTS.$close_btn = $('.btn__hideDialog', ELEMENTS.$target);
      return this;
    }

    // Shows the dialog
    dialog.showDialog = function() {
      if (dialog.config.overlay) {
        dialog.addOverlay();
      }
      if (dialog.config.onShow) {
        setTimeout(function() {
          dialog.config.onShow()
        }, 500);
      }
      ELEMENTS.$target.addClass(CLASSES.DIALOG_ACTIVE);
      ELEMENTS.$body.addClass('noScroll');
      return this;
    };

    dialog.init();

    return dialog;

  };

  $.fn.als_flexDialog = function(config) {
    return this.each(function() {
      if (undefined == $(this).data('data-flexdialog')) {
        var flexdialog = new $.als.plugins.flexDialog(this, config);
      }
    });
  }

})(jQuery);
