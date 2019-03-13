function apiProjectCreate(data, success, error){
  $.ajax({
    url: '/v1/projects',
    type: 'POST',
    headers: {
      'Authorization':'Bearer ' + getToken()
    },
    data,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success,
    error
  });
}


function apiProjectList(data, success, error){
  $.ajax({
    url: '/v1/projects',
    type: 'GET',
    headers: {
      'Authorization':'Bearer ' + getToken()
    },
    data,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success,
    error
  });
}
