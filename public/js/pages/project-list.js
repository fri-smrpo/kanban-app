$(document).ready(function(){

  window.value = [];
  function populateList(data) {

    console.log("Populating");
    $("#dropdownUporabniki").empty();
    var length = Object.keys(data).length;
    console.log(length);


    for (var i = 0; i < length; i++) {
      window.value.push([data[i].id, data[i].username, data[i].name, data[i].surname]);
      $('#dropdownUporabniki').append($(`<option role='${data[i].id}' />`).val(data[i].username).text(data[i].username + ' (' + data[i].name + ' ' + data[i].surname + ')'));
    }
  }

  function loadPeople() {
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
        populateList(data);
      },
      error: function(response) {
        alert("Prosimo poskusite kasneje!");
        console.log(response);
      }

    });
  }

  loadPeople();
});
