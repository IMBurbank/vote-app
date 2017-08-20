'use strict';

(function () {
  var apiUrl = appUrl + '/api/:id',
      displayName = document.querySelector('#display-name'),
      profileId = document.querySelector('#profile-id'),
      profileRepos = document.querySelector('#profile-repos'),
      profileUsername = document.querySelector('#profile-username');


  function updateHtmlElement(data, element, userProperty) {
    element.innerHTML = data[userProperty];
  }


  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
    var json = JSON.parse(data);

    if (displayName) updateHtmlElement(json[json.loginAuth], displayName, 'displayName');
    if (profileId) updateHtmlElement(json[json.loginAuth], profileId, 'id');
    if (profileUsername) updateHtmlElement(json[json.loginAuth], profileUsername, 'username');
    if (profileRepos) updateHtmlElement(json[json.loginAuth], profileRepos, 'publicRepos');
  }));

})();
