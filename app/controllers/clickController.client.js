'use strict';

(function () {

  var addButton = document.querySelector('.btn-add'),
      apiUrl = appUrl + '/api/:id/clicks',
      clickNbr = document.querySelector('#click-nbr'),
      loginForm = document.querySelector('#login-form'),
      resetButton = document.querySelector('.btn-reset'),
      signupForm = document.querySelector('#signup-form');


  function updateClickCount(data) {
    var json = JSON.parse(data);

    clickNbr.innerHTML = json.clicks;
  };

  if (clickNbr) {
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));
  }

  if (addButton) {
    addButton.addEventListener('click', function() {
      ajaxFunctions.ajaxRequest('POST', apiUrl, function() {
        ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });
    }, false);
  }

  if (resetButton) {
    resetButton.addEventListener('click', function() {
      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function() {
        ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });
    }, false);
  }
  
})();
