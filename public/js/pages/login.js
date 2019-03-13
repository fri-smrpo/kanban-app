$(document).ready(function(){

  function ajaxLogin(dataArray){
    $.ajax({
      url: '/v1/auth/login',
      type: 'POST',
      data: JSON.stringify(dataArray),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      //async: false,
      success: function(data) {
        setToken(data.token.accessToken)
        setUserRole(data.user.role);
        setName(data.user.name, data.user.surname);
        window.location.replace("index.html");
      },
      error: function(response) {
        alert('Napaka!');
        console.log(response);
      }

    });

  }
  $("#anchorLogin").click(function(){

    var inputEmail = $("#inputEmail");
    var inputPwd = $("#inputPasswd");

    console.log("-");
    console.log(inputEmail);
    console.log("--");
    console.log(inputPwd);
    console.log("-");

    if(inputEmail.val() == "" && inputPwd.val() == "")
      alert("Prosimo vnesite podatke!");
    else if(inputEmail.val() == "")
      alert("Prosimo vnesite e-poštni naslov!");
    else if(inputPwd.val() == "")
      alert("Prosimo vnesite geslo!");
    else{
      var dataArray = {email: inputEmail.val(), password: inputPwd.val()};
      ajaxLogin(dataArray);
    }
  });





});
