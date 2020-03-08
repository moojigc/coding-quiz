
// Declare global vars
var userName;
var userNameArray = [];
var userScore = 0;
var userScoreArray = [];
const wrapperDiv = $("#wrapper");
const questionDiv = $("#question-div");
const answerDiv = $("#answer-div");
const answerRow = $(".answer-row");
const submitBtn = $("#submit-button");
var totalTime = 60;
var timeElapsed = 0;
var userAnswer;
var quizAttempts = 0;

// All the questions

const question1 = {
    question: "(1) Which of the following is a semantic tag introduced in HTML5?",
    answers: ["<article>","<h1>","<div>","<p>"], 
    correctAnswer: "<article>",
    userIsCorrect: false,
};

const question2 = {
    question: "(2) Which HTML attribute would you use to categorize multiple elements to simplify CSS styling?",
    answers: ["class=","id=","name=","style="],
    correctAnswer: "class=",
    userIsCorrect: false,
};

const question3 = {
    question: "(3) Which of the following is a CSS framework?",
    answers: ["jQuery", "Bootstrap", "HTML DOM", "GitHub"],
    correctAnswer: "Bootstrap",
    userIsCorrect: false,
}

const question4 = {
    question: "(4) What is the jQuery selector?",
    answers: ["%", "#", "$", "."],
    correctAnswer: "$",
    userIsCorrect: false,
}

const question5 = {
    question: "(5) In a given array, var Arr = ['cats', 'dogs,' 'hamsters'], what is the value of 'Arr[2]'?",
    answers: ["2", "cats", "dogs", "hamsters"],
    correctAnswer: "hamsters",
    userIsCorrect: false,
}

const question6 = { 
    question: "(6) A very useful tool for debugging and developing in JavaScript is:",
    answers: ["for loops", "objects", "console.log", "if statement"],
    correctAnswer: "console.log",
    userIsCorrect: false,
}

const question7 = {
    question: "(7) In JavaScript, if you perform the operation {'Hello World' + 2} and log it to the console, what the result be?",
    answers: ["12; The number of letters plus 2", "13; The number of letters plus space plus 2", "Hello World2"],
    correctAnswer: "Hello World2",
    userIsCorrect: false,
}

const questionsArray = [question1, question2, question3, question4, question5, question6, question7];

// Need a function to create the question...
function createQuestion(questionNumber) {
    var h2Div = $("<h2>").text(questionNumber.question);
    h2Div.attr("style", "text-align: center");
    questionDiv.append(h2Div);
}

function createAnswers(questionNumber) {
    for(var i=0; i<questionNumber.answers.length; i++) {
        var labels = ["Ⓓ", "Ⓒ", "Ⓑ", "Ⓐ",];
        var h2Label = $("<h2>").addClass("col-sm-1 answer-label");
        h2Label.text(labels[i]);

        var rowDiv = $("<div>").addClass("row");
        var answerButton = $("<button>").addClass("col-sm-10 btn btn-outline-secondary answer");
        var h3TextDiv = $("<h3>").text(questionNumber.answers[i]);

        answerDiv.prepend(rowDiv);
        rowDiv.append(h2Label);
        rowDiv.append(answerButton);
        answerButton.append(h3TextDiv);
    }
};


// Need a function to start a timer & end quiz if timer runs out
function renderTimer() {
    var secondsLeft = totalTime - timeElapsed;
    var secondsLeftFormatted = (totalTime - timeElapsed) % 60;
    var minutesLeft = Math.floor(secondsLeft/60);
    
    if (secondsLeftFormatted < 10) {
        $("#timer").text("Time Left: " + minutesLeft + ":0" + secondsLeftFormatted);
    } else {
        $("#timer").text("Time Left: " + minutesLeft + ":" + secondsLeftFormatted);
    };
}

var interval;
function startTimer() {
    interval = setInterval(function() {
        renderTimer();
        timeElapsed++;
    }, 1000);
    if (currentQuestion > questionsArray.length) {
        clearInterval(interval);
    } else if (timeElapsed == 60) {
        alert("Times up!")
        clearInterval(interval);
    }
}

// Begins quiz
function beginQuiz() {
    $("#info-display").attr("style", "display: block;");
    submitBtn.attr("style", "display: block;");
    createQuestion(questionsArray[currentQuestion]);
    createAnswers(questionsArray[currentQuestion]);
    startTimer();
}

var answerBtnArray = [];
// Need a function to save the user answer
function getUserAnswer() {
    userAnswer = $(this).text(); 

    // The following is supposed to help the user see what answer they are submitting.
    $(".answer").attr("class", "col-sm-10 btn btn-outline-secondary answer");
    $(this).removeClass();
    $(this).addClass("col-sm-10 btn btn-success answer");

}

// Functions to check if the user is correct
function checkUserCorrect() {
    if (userAnswer === questionsArray[currentQuestion].correctAnswer) {
        questionsArray[currentQuestion].userIsCorrect = true;
        userScore++;
        var correctAnsAlert = $("<h2>").addClass("shadow-none p-3 mb-5 bg-light rounded border-top wrong-right")
        correctAnsAlert.attr("style", "margin-top: 2rem;");
        correctAnsAlert.text("Correct! Nice job!");
        answerDiv.append(correctAnsAlert);

    } else {
        questionsArray[currentQuestion].userIsCorrect = false;
        timeElapsed = timeElapsed + 10;
        var wrongAnsAlert = $("<h2>").addClass("shadow-none p-3 mb-5 bg-light rounded border-top wrong-right")
        wrongAnsAlert.attr("style", "margin-top: 2rem;");
        wrongAnsAlert.text("Wrong answer!");
        answerDiv.append(wrongAnsAlert);
    }
    console.log(questionsArray[currentQuestion].userIsCorrect);
}

// Without putting the eventListener in a func, $(this) keyword does not work properly
function getAnswerClicks() {
    $(".answer").on("click", getUserAnswer);
}

// Stores username, prints to HTML, saves to localStorage. 
function getUserNameAndStartQuiz() {
    userName = "User: " + $("#username-input").val();
    $("#user-name-display").text(userName); 
    userNameArray.push(userName);
    // Starts the quiz, calls $(".answer") eventListener, appends userScore
    beginQuiz();
    getAnswerClicks();
    $("#user-score").append(userScore);
}

// Display username and score
function highScore() {
    var scoreDisplayDiv = $("<h2>").text(userScore);
    questionDiv.append(scoreDisplayDiv);
}

// Save all user scores
var individualUserScoreArray = [];
function saveUserScores() {
    // Scores current score in array
    userScoreArray.push(userScore);
    // Formats current score into readable string
    individualUserScore = userNameArray[quizAttempts] + ": " + userScoreArray[quizAttempts];
    // Saves readable string into array to allow for multiple attempts
    individualUserScoreArray.push(individualUserScore);
    // Saves readable string into localStorage
    localStorage.setItem("UserScores", JSON.stringify(individualUserScoreArray));
    // Prints the scores to the high scores modal
    for(var i=0; i<quizAttempts; i++) { 
        var savedHighScores = JSON.parse(localStorage.getItem("UseScores"));
        var highScoresDisplay = $("<p>").text(savedHighScores[i]);
        $("#highscores-display").append(highScoresDisplay);
    }
}

// Calls the next quiz as well as call many other important functions. Honestly should clean this up but it works lol.
var currentQuestion = 0;
function continueQuiz() {
    // If statement to check if all the questions have been answered or not.
    if (currentQuestion < (questionsArray.length - 1)) {
        // Empty both divs...
        questionDiv.empty();
        answerDiv.empty();
        
        // Checks if user is correct, then increments question#, prints next question, and gets userAnswer.
        checkUserCorrect();
        currentQuestion++;
        createQuestion(questionsArray[currentQuestion]);
        createAnswers(questionsArray[currentQuestion]);
        getAnswerClicks();
    
    // Brings the user to the end screen where they see their score.
    } else {
        // Remove previous wrongAns or correctAns alert
        $(".wrong-right").remove();
        checkUserCorrect();
        // Leaves the wrongAns or correctAns alert onscreen long enough for user to read
        setTimeout(function() {
            // Clear up the jumbotron
            answerDiv.empty();
            questionDiv.empty();
            $("#timer").empty();
            $("#user-score").empty();
            // 
            questionDiv.html("<h2>" + userName + ": " + "got " + userScore + "/7 correct." + "</h2>");
            
            submitBtn.attr("style", "display: none;");
            $("#retry-button").attr("style", "display: block;")
            $("#highscores-button").attr("style", "display: block;")
            
            // Saves user scores to local storage
            saveUserScores();
    
            $("#retry-button").on("click", retryQuiz);
        }, 3000)
    }
}

// Retry quiz
function retryQuiz() {
    $("#start-quiz-button").attr("style", "display: block;");
    $("#username-input").attr("style", "display: block;");
    $("#introduction").attr("style", "display: block;");
    quizAttempts++;
    currentQuestion = 0;
    userScore = 0;
    $("#retry-button").attr("style", "display: none;");
    $("#highscores-button").attr("style", "display: none;");
}

// Global event listeners
$("#submit-button").on("click", continueQuiz);
$("#username-input").on("change", getUserNameAndStartQuiz);
$("#start-quiz-button").on("click", getUserNameAndStartQuiz);