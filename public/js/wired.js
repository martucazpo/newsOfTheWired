$(document).ready(function () {
  console.log("ready");

  $(document).on("click", "#deleteNote", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/deletenote/" + thisId
      })
      .then(function (data) {
        // Log the response
        console.log(data);
        window.location.reload();

      });

  });

 /* $(document).on("click", "#editNote", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/editNote/" + thisId
    }).then(function (data) {
      console.log(data);
      console.log("edited comment");

    });
  });*/

});