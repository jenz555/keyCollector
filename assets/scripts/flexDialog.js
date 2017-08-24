
(function($) {

  var instance = null;

  $.flexDialog = function(el, options) {
  
    // if there is an open instance, close it
    $.flexDialog.close();
	
    this.options = $.extend({}, $.flexDialog.defaults, options);
    
	if (el.is('a')) {

      //Select element by id from href
      this.$elm = $(el.attr('href'));
        if (this.$elm.length !== 1) return null;
        this.open();
      
    } else {
      this.$elm = el;
      $('body').append(this.$elm);
      this.open();
    }
  };

  $.flexDialog.prototype = {
    constructor: $.flexDialog,

    open: function() {
	
		if(this.options.isModal){
			this.openModal();
		}
		else
		{
			this.openNonModal();
		}
	
	  this.addESCMonitor();
 
    },

	openModal: function(){
	
      this.addOverlay();
	  $('body').addClass('noScroll');
	  // force a delay to allow css3 transition
	  var tmp = this;
	  setTimeout(function() {tmp.$elm.addClass("dialogModal--active")}, 1);  

	},
	
	openNonModal: function(){
	
	  // force a delay to allow css3 transition
	  var tmp = this;
	  setTimeout(function() {tmp.$elm.addClass("dialogNonModal--active")}, 1);

	},
	
    close: function() {
	
	  if(this.options.isModal){
			this.closeModal();
		}
		else{
			this.closeNonModal();
		}
	
	  this.removeESCMonitor();
	  
    },
	
	closeModal: function() {
      
	  this.removeOverlay();
	  $('body').removeClass('noScroll');
      this.$elm.removeClass("dialogModal--active");

    },
	
	closeNonModal: function() {
      
	  this.$elm.removeClass("dialogNonModal--active");
	  
    },

    addOverlay: function() {
      
	  this.overlay = $("<div id='overlay' class='clickableOverlay clickableOverlay--active'></div>");
      $('body').append(this.overlay);
	  this.overlay.click($.flexDialog.close);

    },

    removeOverlay: function() {
	
		this.overlay.remove(); 
		
    },
	
	addESCMonitor: function(){
	
		$(document).on('keydown.flexDialog', function(event) {
          if (event.which == 27) $.flexDialog.close();
        });
	
	},
	
	removeESCMonitor: function(){
	
		$(document).off('keydown.flexDialog');
	
	}
	
  };

  $.flexDialog.close = function(event) {
    if (!instance) return;
    if (event) event.preventDefault();
    instance.close();
    var tmpinstance = instance.$elm;
    instance = null;
    return tmpinstance;
  };

  $.flexDialog.defaults = {
    isModal: true
  };

  $.fn.flexDialog = function(options){
    if (this.length === 1) {
      instance = new $.flexDialog(this, options);
    }
    return this;
  };
  
})(jQuery);