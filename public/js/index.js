$(document).ready(function(){

  var token = getToken();

  if(token === null)
    window.location.replace("login.html");
  var role = getUserRole();

  if(role == "admin")
    $('#adminPrivilegij').show();

  $('#name_surname').html(getName());



});
