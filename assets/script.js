
// Declare global vars
var userName;
var userScore = 0;
var userScoreArray = [];
var timeElapsed;
const wrapperDiv = $("#wrapper");
const questionDiv = $("#question-div");
const answerDiv = $("#answer-div");
const answerRow = $(".answer-row");
const submitBtn = $("#submit-button");
var totalTime = 300;
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
}

const question6 = { 
    question: "(6) A very useful tool for debugging and developing in JavaScript is:",
    answers: ["for loops", "objects", "console.log", "objects"]
}

const question6 = {
    question: "(7) In JavaScript, if you perform the operation {'Hello World' + 2} and log it to the console, what the result be?",
    answers: ["12; The number of letters plus 2", "13; The number of letters plus space plus 2", "Hello World2"],
    correctAnswer: "Hello World2",
}

const questionsArray = [question1, question2, question3, question4];

// Need a function to create the question...
function createQuestion(questionNumber) {
    var h2Div = $("<h2>").text(questionNumber.question);
    h2Div.attr("style", "text-align: center");
    questionDiv.append(h2Div);
}

function createAnswers(questionNumber) {
    for(var i=0; i<questionNumber.answers.length; i++) {
        var labels = ["Ⓐ","Ⓑ","Ⓒ","Ⓓ"];
        var h2Label = $("<h2>").addClass("col-sm-1 answer-label");
        h2Label.text(labels[i]);

        var rowDiv = $("<div>").addClass("row");
        var answerButton = $("<button>").addClass("col-sm-10 btn btn-secondary answer");
        answerButton.attr("id", "answer-" + [i])
        var h3TextDiv = $("<h3>").text(questionNumber.answers[i]);

        answerDiv.append(rowDiv);
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
function startTimer() {
    interval = setInterval(function() {
        renderTimer();
        timeElapsed++;
        if (currentQuestion === questionsArray.length) {
            clearInterval(interval);
        } else if (timeElapsed === 300) {
            alert("Times up!")
        }
    }, 1000);
}

// Begins quiz
function beginQuiz() {
    $("#start-quiz-button").remove();
    $("#username-input").remove();
    $("#introduction").remove();
    submitBtn.attr("style", "display: block;") 
    createQuestion(questionsArray[0]);
    createAnswers(questionsArray[0]);
    startTimer();
}

var answerBtnArray = [];
// Need a function to save the user answer
function getUserAnswer() {
    console.log(this.textContent);
    userAnswer = this.textContent;
    // The following is supposed to help the user see what answer they are submitting. doesn't work though
    var answerBtnArray = $(".answer");
    if (answerBtnArray[0].class == "col-sm-10 btn btn-success answer" || 
            answerBtnArray[1].class == "col-sm-10 btn btn-success answer" || 
                answerBtnArray[2].class == "col-sm-10 btn btn-success answer" ||
                    answerBtnArray[3].class == "col-sm-10 btn btn-success answer") {

        answerBtnArray[0,1,2,3].removeClass();
        answerBtnArray[0,1,2,3].addClass("col-sm-10 btn btn-info answer");
        $(this).attr("class", "col-sm-10 btn btn-success answer");
    } else {
        $(this).attr("class", "col-sm-10 btn btn-success answer");
    }

}

// Functions to check if the user is correct
function checkUserCorrect() {
    if (userAnswer === questionsArray[currentQuestion].correctAnswer) {
        questionsArray[currentQuestion].userIsCorrect = true;
        userScore++;
    } else {
        questionsArray[currentQuestion].userIsCorrect = false;
    }
    console.log(questionsArray[currentQuestion].userIsCorrect);
}

// Answer button event listeners
function getAnswerClicks() {
    $(".answer").on("click", getUserAnswer);
}

// Need a function to store username 
function getUserNameAndStartQuiz() {
    userName = $("#username-input").val();
    $("#user-name-display").text(userName); 
    localStorage.setItem("username", userName);
    // starts the quiz
    beginQuiz();
    getAnswerClicks();
}

// Display username and score
function highScore() {
    var scoreDisplayDiv = $("<h2>").text(userScore);
    questionDiv.append(scoreDisplayDiv);
}

// Global event listeners
$("#username-input").on("change", getUserNameAndStartQuiz);
$("#start-quiz-button").on("click", getUserNameAndStartQuiz);

// Calls the next quiz as well as call many other important functions.
var currentQuestion = 0;
function continueQuiz() {
    if (currentQuestion < (questionsArray.length - 1)) {
        questionDiv.empty();
        answerDiv.empty();
        
        checkUserCorrect();
        currentQuestion++;
        createQuestion(questionsArray[currentQuestion]);
        createAnswers(questionsArray[currentQuestion]);
        getAnswerClicks();
    } else {
        checkUserCorrect();
        alert("You done");
        questionDiv.empty();
        answerDiv.empty();
        $("#timer").attr("style", "display: none;")
        $("#user-score").empty();
        submitBtn.attr("style", "display: none;");
        // Create retry button, increase userAttempts
        retryBtn = $("<button>").addClass("btn btn-outline-primary btn-sm");
        retryBtn.text("Retry");
        retryBtn.attr("id", "retry-button");
        retryBtn.attr("style", "margin: 1rem auto 0 auto;")
        $("#submit-retry-button-div").append(retryBtn);

        highScore();
    }
}

// 

$("#submit-button").on("click", continueQuiz);

// Need a function to save score