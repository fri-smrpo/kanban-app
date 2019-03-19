$(document).ready(function(){

  //---------Preverjanje Check-box----------------
  $('input[type="checkbox"]').click(function(){
    if($(this).prop("checked") == true){
      if($(this).attr('id') === "inlineCheckbox1") {
        console.log("Zaključeno - zakljukano");
      }
      else {
        console.log("V delu - zakljukano");
      }
    }
    else if($(this).prop("checked") == false){
      if($(this).attr('id') === "inlineCheckbox1") {
        console.log("Zaključeno - odkljukano");
      }
      else {
        console.log("V delu - odkljukano");
      }
    }
  });
 //----------------------------------------------

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
        $('#addNewStory').prop('disabled', true);
        users.forEach(usr => {
          if(usr.role != 'developer') {
            if (usr.user == currentUserId) {
              $('#addNewSprint').prop('disabled', false);
              $('#addNewStory').prop('disabled', false);
            }
          }


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
        $("#tableSprints").empty();
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
          alert("Napaka prekrivanje!");
          console.log(response);
        }

      });

      reset();

  }

  function loadStories(id){
    $.ajax({
      url: '/v1/stories' + '?projectId=' + id,
      type: 'GET',
      headers: {
        'Authorization':'Bearer ' + getToken()
      },
      contentType: 'application/json; charset=utf-8',
      //async: false,
      success: function(data) {
        console.log("Stories");
        console.log(data);
        $("#tableStories").empty();
        data.forEach(x => {
          $("#tableStories").append(`<tr><td>` + x.name + `</td><td>` + x.priority + `</td></tr>`);
        })
      },
      error: function(response) {
        alert("Napaka!");
        console.log(response);
      }

    });

  }

  function saveStory(dataArray, id){
    $.ajax({
      url: '/v1/stories',
      type: 'POST',
      headers: {
        'Authorization':'Bearer ' + getToken()
      },
      data: JSON.stringify(dataArray),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      //async: false,
      success: function(data) {
        $('#exampleModal2').modal('toggle');
        loadStories(id);
        console.log("Uspeh");
        console.log(data);
      },
      error: function(response) {
        $('#napakaStory').text("Napaka, to ime že obstaja!");
        console.log(response);
      }

    });

    reset();

  }
  loadSprints(window.location.search.split('=')[1]);
  loadStories(window.location.search.split('=')[1]);
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

  $('#anchorCreateStory').click(function() {

    var name = $('#idStoryName').val();
    var description = $('#idStoryDescription').val();
    var acceptanceTests = $('#idStoryTests').val();
    var businessValue = $('#idStoryBusinessValue').val();
    var priority = $('#idStoryPriority').val();
    var projectId = window.location.search.split('=')[1];

    dataArr = {name: name,
      description: description,
      acceptanceTests: acceptanceTests,
      businessValue: businessValue,
      priority: priority,
      projectId: projectId};

    console.log(dataArr)
    saveStory(dataArr, projectId);

  });
});
