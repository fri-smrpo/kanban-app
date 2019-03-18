$(document).ready(function(){
  function getProject(project_id){

    var projectData;
    $.ajax({
      url: '/v1/projects/' + project_id,
      type: 'GET',
      headers: {
        'Authorization':'Bearer ' + getToken()
      },
      contentType: 'application/json; charset=utf-8',
      //async: false,
      success: function(data) {
        $('#projectName').text(data.name);
        console.log("Project data");
        console.log(data);
        console.log("End")
        projectData = data;

        var users = data.users;
        var currentUserId = getUserID();
        $('#addNewSprint').prop('disabled', true);
        users.forEach(usr => {
          if(usr._id == currentUserId && usr.role != 'developer')
            $('#addNewSprint').prop('disabled', false);

          console.log(usr.role);
          console.log(usr._id)
        })
      },
      error: function(response) {
        alert("Napaka!");
        console.log(response);
      }

    });

    return projectData;

  }


  function loadSprints(id){
    $.ajax({
      url: '/v1/sprints' + '?projectId=' + id,
      type: 'GET',
      headers: {
        'Authorization':'Bearer ' + getToken()
      },
      contentType: 'application/json; charset=utf-8',
      //async: false,
      success: function(data) {
        console.log("Sprints");
        console.log(data);

        var counter = 1;
        data.forEach(x => {
          $("#tableSprints").append(`<tr><td>` + new Date(x.start) + `</td><td>` + new Date(x.end) + `</td></tr>`);
          counter = counter + 1;
        })
      },
      error: function(response) {
        alert("Napaka!");
        console.log(response);
      }

    });

  }

  function saveSprint(dataArray,id){
      $.ajax({
        url: '/v1/sprints',
        type: 'POST',
        headers: {
          'Authorization':'Bearer ' + getToken()
        },
        data: JSON.stringify(dataArray),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        //async: false,
        success: function(data) {
          $('#exampleModal').modal('toggle');
          loadSprints(id);
          console.log("Uspeh");
          console.log(data);
        },
        error: function(response) {
          alert("Napaka!");
          console.log(response);
        }

      });


  }
  loadSprints(window.location.search.split('=')[1]);
  var d = new Date().toISOString().slice(0,10);
  //getProject(windows.location.search.split('=')[1]);

  getProject(window.location.search.split('=')[1]);
  $('#beginSprint').attr({"min" : d});
  $('#endSprint').attr({"min" : d});

  $('#anchorCreateSprint').click(function(){
    var begin = $('#beginSprint').val();
    var end = $('#endSprint').val();
    var speed = $('#speedNum').val();
    dataArr = {start: new Date(begin),
      end: new Date(end),
      projectId: window.location.search.split('=')[1],
      speed: speed};

    if(new Date(begin).getTime() <= new Date(end).getTime())
      saveSprint(dataArr, window.location.search.split('=')[1]);
    else
      $('#napaka').text("Sprint se ne more končati pred začetkom!");
  });
});
