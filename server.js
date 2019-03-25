require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");

var db = require("./models");
var seeds = require("./seeder/questions.json");

var passport = require("./config/passport");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: true };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

function grabSeeds(index=0) {
    var quiz = seeds[index];
    db.Quiz.findOrCreate({
      name: quiz.quizName,
      where: {
        name: quiz.quizName
      }
    }).then(function(res) {
      var id = res[0].dataValues.id;
      var newQuestion = {
        question: quiz.question,
        answerOne: quiz.answerOne,
        answerTwo: quiz.answerTwo,
        answerThree: quiz.answerThree,
        answerFour: quiz.answerFour,
        correctAnswer: quiz.correctAnswer,
        momResponse: quiz.momResponse,
        snarkyResponse: quiz.snarkyResponse,
        QuizId: id
      };
      db.Question.create(newQuestion);
      if (index < seeds.length-1) {
        grabSeeds(index+1);
      }
    }).catch(function(err) {
      console.log(err);
    });
}
// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  // If data is erased, recreate questions
  if (syncOptions.force) {
    grabSeeds();
  }
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
