$(document).ready(function(){

  $("#tableUsers").DataTable();
  function populateTable(data){
    console.log("Populating");
    $("#tableUsers").DataTable().clear();
    var length = Object.keys(data).length;
    console.log(length);
    for(var i = 0; i<length; i++){

      if(data[i].role == 'user'){
        role = "Uporabnik";
      }else
        role = "Administrator";
      $('#tableUsers').dataTable().fnAddData( [
        data[i].name,
        data[i].surname,
        data[i].username,
        data[i].email,
        role
      ]);
    }

  }

  function loadUsers() {
    $.ajax({
      url: '/v1/users',
      type: 'GET',
      headers: {
        'Authorization':'Bearer ' + getToken()
      },
      dataType: 'json',
      //async: false,
      success: function(data) {
        console.log(data);
        //jsonUserData = data;
        populateTable(data);
      },
      error: function(response) {
        alert("Prosimo poskusite kasneje!");
        console.log(response);
      }

    });
  }

  loadUsers();


  function ajaxRegister(dataArray){
    $.ajax({
      url: '/v1/users',
      type: 'POST',
      headers: {
        'Authorization':'Bearer ' + getToken()
      },
      data: JSON.stringify(dataArray),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      //async: false,
      success: function(data) {
        //alert("Uporabnik uspešno ustvarjen!");
        $('#successinfo').addClass('alert alert-success').text("Uporabnik uspešno ustvarjen");


        $("#tableUsers").DataTable().clear();
        loadUsers();
        $("#exampleModal").modal('toggle');
        console.log(data);
        //window.location.replace("users-list.html");
      },
      error: function(errorThrown) {
        /**
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
         **/
        console.log(errorThrown);
        var errResponse = errorThrown.responseJSON.errors[0].messages[0];
        $('#napaka').text(errResponse);

        //if(errorThrown == 'Conflict') $('#napaka').text("Ta e-naslov že obstaja");

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
