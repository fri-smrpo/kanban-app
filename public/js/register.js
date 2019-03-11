$(document).ready(function(){

  function ajaxRegister(dataArray){
    $.ajax({
      url: '/v1/auth/register',
      type: 'POST',
      data: JSON.stringify(dataArray),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      //async: false,
      success: function(data) {
        alert(data);
        $(this).attr('href', "index.html");
      },
      error: function(response) {
        alert("Napaka!");
        console.log(response);
      }

    });

  }

  $("#anchorRegister").click(function(){

    var inputFirst = $("#inputFirst");
    var inputLast = $("#inputLast");

    var inputEmail = $("#inputEmail");
    var inputUsername = $("#inputUsername");

    var inputPwd1 = $("#inputPasswd1");
    var inputPwd2 = $("#inputPasswd2");

    if(inputFirst.val() == "")
      alert("Vnesite ime!");
    else if(inputLast.val() == "")
      alert("Vnesite priimek!");
    else if(inputEmail.val() == "")
      alert("Vnesite e-poštni naslov!");
    else if(inputUsername.val() == "")
      alert("Vnesite uporaniško ime!");
    else if(inputPwd1.val() == "")
      alert("Vnesite geslo!");
    else if(inputPwd2.val() == "")
      alert("Potrdite geslo!");
    else if(inputPwd1.val() != inputPwd2.val())
      alert("Gesli se ne ujemata!");
    else if(inputPwd1.val().length < 6)
      alert("Geslo naj bo dolgo vsaj 6 znakov!");
    else if(!$("#radioUporabnik").is(":checked") && !$("#radioAdministrator").is(":checked"))
      alert("Izberite tip uporabnika!");
    else{

      var dataArr;
      if($("#radioUporabnik").is(":checked"))
        dataArr = {email: inputEmail.val(),
          password: inputPwd2.val(),
          username: inputUsername.val(),
          name: inputFirst.val(),
          surname: inputLast.val()};
      else
        dataArr = {email: inputEmail.val(),
          password: inputPwd2.val(),
          username: inputUsername.val(),
          name: inputFirst.val(),
          surname: inputLast.val(),
          role: 'admin'};
      ajaxRegister(dataArr);

    }




  });
});
