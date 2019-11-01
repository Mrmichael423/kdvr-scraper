$.getJSON("/articles", function(data) {
  event.preventDefault();
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      `<p>Title: ${data[i].title}<br>Link: <a href="${data[i].link}">${data[i].link}</a></p> <button data-id=${data[i]._id} class="note">Note</button>`
    );
  }
});

$("#articles").on("click", ".note", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);
    $("#notes").append("<h2>" + data.title + "</h2>");
    $("#notes").append("<input id='titleinput' name='title' >");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append(
      "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
    );
    if (data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    }
  });
});
$("#notes").on("click", "#savenote", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);
    $("#notes").empty();
  });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
