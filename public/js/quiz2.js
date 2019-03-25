var answers = [];

function submitAnswers(e) {
    e.preventDefault();
    var total = $(".question").length;
    var score = 0;

// Validation
for(i = 1; i<= total; i++){
    if(document.forms["quizForm"]['q'+i].value == null || document.forms["quizForm"]['q'+i].value == ''){
        alert ("You miss Quetion "+ i);
        return false;
    }
}

 //check Anwers
 for(i = 1; i <= total; i++){
     if(document.forms["quizForm"]['q'+i].value == answers[i - 1]){
         score ++;
     }
 }
// display result
var results = document.getElementById("results");
results.innerHTML = "<h3> You scored <span>"+score+"</span> out of <span>"+total+"</span></h3>"
$(document).scrollTop(0); 
alert("you scored "+score+" out of " +total);
return false;
}

$.ajax("/api"+location.pathname.replace("quiz","answers"), {
    method: "GET"
}).then(function(data) {
    answers = data;
});

$("#quizForm").on("submit", submitAnswers);

$("#returnButton").on("click", function(e) {
    location.replace("/user/1");
});