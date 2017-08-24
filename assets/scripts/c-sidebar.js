;var sidebar = (function () {

  'use strict';

  var menuTriggers = document.querySelectorAll('.sg-contextual-nav-header');
  var navToggle = document.querySelectorAll('.nav-toggle');
  var menuItem = document.querySelectorAll('.menuItem');
  var sidebar = document.querySelector('#sidebar');
  var headerLogo = document.querySelector('#header-logo');

  function isolateScroll (e) {

    var delta = e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail,
        bottomOverflow = this.scrollTop + $(this).outerHeight() - this.scrollHeight >= 0,
        topOverflow = this.scrollTop <= 0;

    if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
      e.preventDefault();
    }
  }

  function init () {

    for (var i = 0; i < menuTriggers.length; i++) {
      menuTriggers[i].addEventListener('click', toggleAccordion);
    }

    for (var i = 0; i < navToggle.length; i++) {
      navToggle[i].addEventListener('click', toggleSidebarVisibility);
    }

    for (var i = 0; i < menuItem.length; i++) {
      menuItem[i].addEventListener('click', setActiveMenuItem);
    }

    document.addEventListener('click', hideSidebar);

    window.addEventListener('load', getActiveMenuItem);

    sidebar.addEventListener('mousewheel', isolateScroll);
    sidebar.addEventListener('DOMMouseScroll', isolateScroll);

    headerLogo.addEventListener('click', unsetMenu);
  }

  function setSidebarScollPosition () {
    var hasActiveItem = $('.menuItem.isActive').length;
    if (hasActiveItem) {
      $('#sidebar').scrollTop($('.menuItem.isActive').offset().top - $('header').height());
    }
  }

  function unsetMenu () {
    sessionStorage.removeItem('menuState');
  }

  function setActiveMenuItem (e) {

    var section = e.target.getAttribute('data-section'),
        id = e.target.id;

    var data = {
      activeMenuSection: section,
      activeMenuItem: id
    };

    sessionStorage.setItem('menuState', JSON.stringify(data));
  }

  function getActiveMenuItem () {
    var splitUrl = window.location.toString().split('/');
    var page = splitUrl[splitUrl.length -1].replace(/-|.html/g,' ').trim();
    var menuItems = document.querySelectorAll('.menuItem');

    for (var i = 0; i < menuItems.length; i++) {
      var innerText = menuItems[i].innerText.toString().toLowerCase();
      if (innerText == page) {
        menuItems[i].classList.add('isActive');
      }
    }

    setSidebarScollPosition();
  }

  function hideSidebar () {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('isOpen');
  }

  function toggleSidebarVisibility (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var sidebar = document.getElementById('sidebar');
    sidebar.classList[ sidebar.classList.toString().match('isOpen') ? 'remove' :'add' ]('isOpen');
  }

  function toggleAccordion (e) {
    var parent = this.parentNode,
        isActive = parent.classList.toString().match('isActive');
    parent.classList[isActive ? 'remove' : 'add']('isActive');
  }

  return {
    init: init
  };

}());
