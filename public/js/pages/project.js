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
          $("#tableSprints").append(`<tr><td>` + moment(new Date(x.start)).format('D. M. YYYY') + `</td><td>` + moment(new Date(x.end)).format('D. M. YYYY') + `</td><td>` + x.speed + `</td></tr>`);
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

    $("#napaka_anchorCreateSprint").text('');
    $('#napaka').text('');

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

          reset();
          $('#exampleModal').modal('toggle');
          loadSprints(id);
          console.log("Uspeh");
          console.log(data);
        },
        error: function(response) {
          // alert("Napaka prekrivanje!");
          console.warn(response);

          if (!dataArray.speed) { // NOT OK but for FRI ....
            $("#napaka_anchorCreateSprint").text('Polje hitrost je obvezno.');
          } else {
            $("#napaka_anchorCreateSprint").text(response.responseJSON.message);
          }
        }
      });

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
        $("#tableStoriesTODO").empty();
        $("#tableStoriesDONE").empty();
        data.forEach(x => {
          if(x.priority.charAt(2) == "n")
            x.priority = "will not have this time";

          x.description = x.description.replace(/(?:\r\n|\r|\n)/g, ', ');
          x.acceptanceTests = x.acceptanceTests.replace(/(?:\r\n|\r|\n)/g, ', ');
          if(x.status == "done")
            $("#tableStoriesDONE").append(`<tr onclick="showInfo('${x.name}','${x.description}','${x.acceptanceTests}','${x.businessValue}','${x.priority}')"><td>` + x.name + `</td><td>` + x.priority + `</td></tr>`);
          else
            $("#tableStoriesTODO").append(`<tr onclick="showInfo('${x.name}','${x.description}','${x.acceptanceTests}','${x.businessValue}','${x.priority}')"><td>` + x.name + `</td><td>` + x.priority + `</td></tr>`);
        })
      },
      error: function(response) {
        alert("Napaka!");
        console.log(response);
      }

    });

  }

  function saveStory(dataArray, id){
    $('#napakaStory').text("");

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
        reset();
        $('#exampleModal2').modal('toggle');
        loadStories(id);
        console.log("Uspeh");
        console.log(data);
      },
      error: function(response) {

        if (response.responseJSON.errors) {
          if (Array.isArray(response.responseJSON.errors)) {
            $('#napakaStory').text(
              response.responseJSON.errors
                .map(x => x.messages[0])
              .join('\n ')
            );
          } else if (response.responseJSON.errors.messages) {
            $('#napakaStory').text(
              response.responseJSON.errors.messages.join('\n ')
            );
          } else {
            $('#napakaStory').text("Napaka, vaš obrazec ni veljaven!");
          }

        } else {
          $('#napakaStory').text("Napaka, vaš obrazec ni veljaven!");
        }


        console.warn(response);
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
    var status = $('#idStatus').val();
    var projectId = window.location.search.split('=')[1];

    dataArr = {name: name,
      description: description,
      acceptanceTests: acceptanceTests,
      businessValue: businessValue,
      priority: priority,
      projectId: projectId,
      status: status};

    console.log(dataArr)
    saveStory(dataArr, projectId);

  });
});


function showInfo(name,description,acceptanceTests,businessValue,priority){
  //empty modal
  $('#exampleModal3').modal('toggle');
  $('#exampleModalLabel3').text(name);
  $('#storyOpis').text(description);
  $('#storyTests').text(acceptanceTests);
  $('#storyBusinessValueAndPriority').text("Poslovna vrednost: " + businessValue + "\n" + "Prioriteta: " + priority);
  console.log("aa");
  console.log(name, description, acceptanceTests, businessValue, priority);
}
