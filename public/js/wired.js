$(document).ready(function () {
    console.log("ready");

    $(document).on("click", "#deleteNote", function() {
        var thisId = $(this).attr("data-id");
       $.ajax({
          method: "DELETE",
          url: "/deletenote/" + thisId
        })
        .then(function(data) {
          // Log the response
          console.log(data);
          window.location.reload();
         
        }); 
      
    });
    
});