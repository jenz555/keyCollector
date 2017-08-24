
'use strict';

var initCodeSamples = (function () {
  document.addEventListener('DOMContentLoaded', function () {
    var codeSamples = document.querySelectorAll('[data-code-sample]');
    for (var i = 0; i < codeSamples.length; i++) {
      var target = codeSamples[i],
          fileName = target.getAttribute('data-code-sample'),
          extension = fileName.split('.')[1],
          callback = target.getAttribute('data-callback');
      createCodeSample(fileName + (!extension ? '.html' : ''), target, callback);
    }
  });
}());

function createCodeSample (file, target, callback) {

  var snippetTheme;
  var request = new XMLHttpRequest();

  if (file.match('.js')) {
    snippetTheme = 'language-js';
  } else if (file.match('.css')) {
    snippetTheme = 'language-css';
  } else {
    snippetTheme = 'language-html';
  }

  request.open('GET', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-489/' + file, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {

      var resp = request.responseText;
      var codesample = document.createElement ('div');

      var jsSnippet = (callback && typeof callback !== 'undefined' ? '<div class="vr--x2"><pre class="language-js"><code>' + callback + '</code></pre></div>' : '');
      var renderedHtml = (snippetTheme !== 'language-html' ? '' : resp);

      codesample.className = 'code-sample vr--x2';
      codesample.innerHTML =  '<pre class="code-snippet ' + snippetTheme + '"><code>' + resp.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') + '</code></pre>' + jsSnippet + renderedHtml;

      target.parentNode.replaceChild(codesample, target);

      if (callback && typeof callback !== 'undefined') {
        var callbackWrapper = new Function(callback)();
      }

      Prism.highlightAll(false);

    } else {
      console.log('something went wrong while processing the request for ' + file);
    }
  };

  request.onerror = function() {
    console.log('Could not connect.');
  };

  request.send();
}
