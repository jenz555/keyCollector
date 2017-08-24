var themeSelector = (function () {

  'use strict';

  function init () {

    var dropdown = document.getElementById('theme-selector-dropdown');
    var options = dropdown.getElementsByTagName('li');

    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', setSelectedMenuItem);
    }

    setThemeCSS();
    setThemeHighlight();
  }

  function setDefaultTheme () {
    sessionStorage.setItem('theme', JSON.stringify({
      theme: 'consumer',
      activeItem: 'theme-1'
    }));
    document.getElementById('theme-1').classList.add('isActive');
    setThemeHighlight();
  }

  function setSelectedMenuItem (e) {

    e.preventDefault();

    var siblings = Array.prototype.filter.call(e.target.parentNode.children, function (child) {
      return child !== e.target;
    });

    for (var i = 0; i < siblings.length; i++) {
      siblings[i].classList.remove('isActive');
    }

    e.target.classList.add('isActive');

    setThemeInSession(e.target);

  }

  function setThemeInSession (target) {

    var theme = sessionStorage.getItem('theme');
    if (theme && JSON.parse(theme).activeItem === target.id) {
      return false;
    }

    sessionStorage.setItem('theme', JSON.stringify({
      theme: target.innerText.toLowerCase(),
      activeItem: target.id
    }));

    setThemeCSS();
    setThemeHighlight();
  }


  function setThemeCSS () {

    var sessionData = JSON.parse(sessionStorage.getItem('theme'));
    var themeSelector = document.getElementsByClassName("theme-selector")[0];
    var stylesheet = document.getElementById('allstate-brand-stylesheet');

    if (sessionData === null) {
      setDefaultTheme();
    }

    if (sessionData !== null && sessionData.theme === 'white label') {
      stylesheet.disabled = true;
    } else {
      stylesheet.disabled = false;
    }

    document.getElementById(sessionData.activeItem).classList.add('isActive');
  }


  function setThemeHighlight() {
    var consumerThemeId = "theme-1";
    var themeSelector = document.getElementsByClassName("theme-selector")[0];
    var themeInSession = JSON.parse(sessionStorage.getItem("theme"));
    var themeIdInSession = "";

    // check if a theme id selected in the session
    // and set in the themeIdInSession variable
    if (themeInSession != null) {
      themeIdInSession = themeInSession.activeItem;

      // if the theme id in the session is the consumer theme
      // them add the theme highlight if it does not already exist
      // else remove it
      if (
          (!themeSelector.classList.contains("theme-selector--non-whitelabel"))
          && (themeIdInSession === consumerThemeId)
          ) {
        themeSelector.classList.add("theme-selector--non-whitelabel");
      } else {
        themeSelector.classList.remove("theme-selector--non-whitelabel");
      }
    }
  }


  return {
    init: init
  };

}());
