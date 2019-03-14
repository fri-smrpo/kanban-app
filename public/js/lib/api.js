function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function apiProjectCreate(data, success, error){
  $.ajax({
    url: '/v1/projects',
    type: 'POST',
    headers: {
      'Authorization':'Bearer ' + getToken()
    },
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success,
    error
  });
}


function apiProjectList(success, error){
  $.ajax({
    url: '/v1/projects',
    type: 'GET',
    headers: {
      'Authorization':'Bearer ' + getToken()
    },

    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success,
    error
  });
}
function apiSprintCreate(data, success, error){
  $.ajax({
    url: '/v1/sprints',
    type: 'POST',
    headers: {
      'Authorization':'Bearer ' + getToken()
    },
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success,
    error
  });
}

function apiSprintList(success, error){
  $.ajax({
    url: '/v1/sprints',
    type: 'GET',
    headers: {
      'Authorization':'Bearer ' + getToken()
    },
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success,
    error
  });
}

