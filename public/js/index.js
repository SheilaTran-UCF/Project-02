$(".box").on("click", function(e) {
  location.replace("/quiz/"+$(this).attr("id"));
});