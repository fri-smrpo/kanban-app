function apiProjectCreate(data, success, error){
  $.ajax({
    url: '/v1/projects',
    type: 'POST',
    data,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success,
    error
  });
}
