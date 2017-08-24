(function () {

  'use strict';

  var themeSelectorDiv = document.createElement('div');
  themeSelectorDiv.id = 'theme-selector';
  themeSelectorDiv.classList.add('vr--x2');
  document.body.insertBefore(themeSelectorDiv, document.body.childNodes[0]);

  var themesList = [
    '<ul class="hList hList--piped txt--size-12" style="background: #eff2f3; padding:8px">',
      '<li><a class="anchor theme-item" data-theme="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-489/app.css" href="#" style="color: #1666af; font-family: \'Allstate Sans Regular\', Arial, Helvectica, sans-serif;">Consumer</a></li>',
      '<li><a class="anchor theme-item" data-theme="" href="#" style="color: #1666af; font-family: \'Allstate Sans Regular\', Arial, Helvectica, sans-serif;">White Label</a></li>',
    '</ul>'
  ].join('');

  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  var themeStylesheet = document.getElementById('theme-stylesheet');

  if (themeStylesheet) head.removeChild(themeStylesheet);

  link.id = 'theme-stylesheet';
  link.rel = 'stylesheet';
  link.href = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-489/app.css';
  head.appendChild(link);

  document.getElementById('theme-selector').innerHTML = themesList;

  var themeItem = document.querySelectorAll('.theme-item');

  for (var i = 0; i <= themeItem.length; i++) {
    themeItem[i].addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('theme-stylesheet').href = e.target.getAttribute('data-theme');
    });
  }

}());
