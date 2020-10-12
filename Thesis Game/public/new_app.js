var db = firebase.firestore();
var storageRef = firebase.storage().ref();

const newGameButton = document.querySelector("#startGame");
const authButtons = document.querySelector("#authButtons")
const messageText = document.querySelector("#message");
const submitButton = document.querySelector("#doneDrawing");
const undoButton = document.querySelector("#undoStroke");
const nextExampleButton = document.querySelector("#nextExample");
const playAgainButton = document.querySelector("#playAgain");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const startGuessPhaseButton = document.querySelector("#startGuessPhase");

const numOfDrawingRounds = 5;
var curDrawnImages = 0;
const totalNumOfGussingRounds = 5;
var curGuesses = 0;
var numOfCorrectGuesses = -1;
var guessMode = 0;
const maxRandomValue = 100000;
var prevGuessMessage = "";
var needToDownloadPics = 1;
var totalImagesDrawn = 1;

var originalImagesSizeHeight = 576; //this is for ALOI
var originalImagesSizeWidth = 768;

var drawData = {};
let urlArray = [];
let picIdArray = [];
let guessesDataArray = [];
var urlArrayGuesses = [];
var submitGuessFunctions = [];
var drawnDocIDs = [];

var correctGuess = -1;
var clickIsPossible = 0;
const preSelectGuesses = 1;

function initDrawMode() {
  console.log("original height ", originalImagesSizeHeight)
  hideTutorialElements();
  guessMode = 0;
  curDrawnImages = 0;
  const picturesRow = document.querySelector("#imgRow");
  document.querySelector("#exampleImgRow2").style.display = "none";
  picturesRow.style.display = "block"
  const canvasHolder = document.getElementsByClassName("canvasHolder")[0];
  const newGame = document.querySelector("#startGame");
  newGame.style.display = "none";
  canvasHolder.style.display = "inline-block";
  submitButton.style.display = "block";
  undoButton.style.display = "block";
  if(!touchScreen){
    console.log("no touchscreen detected")
    submitButton.style.width = "100px";
    submitButton.style.fontSize = "14px";
    undoButton.style.width = "100px";
    undoButton.style.fontSize = "14px";
  }
  canvas.style.display = "flex";
  playAgainButton.style.display = "none";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (needToDownloadPics) {
    urlArray = [];
    picIdArray = [];
    downloadDrawingImages(numOfDrawingRounds);
    setTimeout(function () {
      gameLogic();
      if (preSelectGuesses) {
        console.log("preloading guessing images")
        select5Guesses();
      }
    }, 2000);
    return;
  }
  if (preSelectGuesses) {
    console.log("preloading guessing images")
    select5Guesses();
  }
  gameLogic();
}

function initGuessMode() {
  var msg2 = document.querySelector("#message2");
  var msg3 = document.querySelector("#message3");
  msg2.style.display = "none"
  msg3.style.display = "none";
  submitButton.style.display = "none";
  undoButton.style.display = "none";
  startGuessPhaseButton.style.display = "none";
  const canvasHolder = document.getElementsByClassName("canvasHolder")[0];
  canvasHolder.style.display = "inline-block";
  canvas.style.display = "flex";
  const picturesRow = document.querySelector("#imgRow");
  picturesRow.style.display = "block"
  guessMode = 1;
  submitGuessFunctions = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  correctGuess = -1;
  messageText.innerText = "Select the correct picture " + curGuesses.toString() + "\\" + totalNumOfGussingRounds.toString();
  makeImagesClickable();
  clickIsPossible = 1;
  prevGuessMessage = "";
  numOfCorrectGuesses = 0;
}

function setUpDrawing(drawingNum) {
  canDraw = 1;
  messageText.innerHTML = "Draw the picture with the red frame <font color=\"14A76C\">minimally</font color>. Drawn " + drawingNum + " out of " + numOfDrawingRounds;
  if (language == "hebrew") {
    messageText.innerHTML = "צייר את התמונה במסגרת האדומה <font color=\"14A76C\">בצורה מינילית</font color>." +
      "צוירו " + drawingNum + " מתוך " + numOfDrawingRounds

  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!didImagesLoad(urlArray, drawingNum)) {
    messageText.innerText = "Loading images, please wait";
    setTimeout(function () {
      setUpDrawing(drawingNum);
    }, 1000);
    return;
  }
  ShowDrawingImages(drawingNum);
  drawData = {};
}

function setUpGuess(guessNum) {
  //set source of the 5 images to the urls of the current guess, and setup onClick behaivor, urls were already downloaded in initGuess
  clickIsPossible = 1;
  messageText.innerHTML = "Click the correct picture. Guess " + curGuesses + " out of " + totalNumOfGussingRounds + ". " + prevGuessMessage;
  if (language == "hebrew") {
    messageText.innerHTML = " לחץ על התמונה הנכונה. ניחוש " + curGuesses + " מתוך " + totalNumOfGussingRounds + " - " +
      prevGuessMessage
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!didImagesLoad(urlArrayGuesses, guessNum)) {
    messageText.innerText = "Loading images, please wait";
    setTimeout(function () {
      setUpGuess(guessNum);
    }, 1000);
    return;
  }
  showGuessingImages(guessNum);
  drawArray(dict2drawing(guessesDataArray[guessNum].data()["Drawing"]))
}

function submitDrawing() {
  if (currentDrawing.length == 0) return;
  canDraw = 0;
  let round = curDrawnImages;
  drawData["Drawing"] = drawing2dict(currentDrawing);
  drawData["timeStamp"] = firebase.firestore.FieldValue.serverTimestamp();
  drawData["random"] = Math.random() * maxRandomValue;
  drawData["mail"] = userMail
  drawData["touchscreen"] = touchScreen;
  console.log("writing doc with seed: ", drawData["random"])
  drawData["images"] = {
    0: urlArray[round][0]
  } //,1:picIdArray[round][0],2:picIdArray[round][1],3:picIdArray[round][2],4:picIdArray[round][3],5:picIdArray[round][4]};
  for (var i = 1; i <= imgsPerRound; i++) {
    drawData["images"][i.toString()] = picIdArray[round][i - 1];
  }
  drawData["imageSubmissionOrder"] = totalImagesDrawn
  drawData["exampleScore"] = numberOfExamplesRight;

  try {
    var sampleDoc = db.collection("samples").doc();
    sampleDoc.set(drawData);
    console.log("sampleDoc ID: " + sampleDoc.id.toString())
    db.collection("guesses").doc(sampleDoc.id.toString()).set({
      right: 0,
      wrong: 0,
      total: 0
    }).then(function () {
      console.log("wrote guesses doc");
      drawnDocIDs.push(sampleDoc.id);
    }); //make guesses doc
  } catch (e) {
    console.log(e.toString());
  }
  currentDrawing = []
  curDrawnImages++;
  totalImagesDrawn++;
  submitButton.style.backgroundColor = "#808080";

  if (curDrawnImages == numOfDrawingRounds) {
    console.log("submitted final drawing, initializing guess mode");
    loadGuessInstructions();
    return;
  }
  changeImagesToLoading()
  gameLogic();
}

function submitGuess(picNumber) {
  if (clickIsPossible) {
    guessDocId = guessesDataArray[curGuesses].id;
    const increment = firebase.firestore.FieldValue.increment(1);
    var errorFunc = function (error) {
      console.log("error updating doc with id: " + guessDocId.toString() + " error: " + error);
    }
    if (picNumber == correctGuess) {
      prevGuessMessage = "Previous guess was <font color=\"14A76C\">correct!</font color> ";
      if (language == "hebrew") {
        prevGuessMessage = "הניחוש הקודם היה <font color=\"#14A76C\">נכון</font>!";
      }
      db.collection("guesses").doc(guessDocId).update({
        right: increment,
        total: increment
      }).catch(errorFunc)
      numOfCorrectGuesses++;
    } else {
      prevGuessMessage = "Previous guess was <font color=\"FF652F\">incorrect!</font color> ";
      if (language == "hebrew") {
        prevGuessMessage = "הניחוש הקודם היה <font color=\"#FF652F\">לא נכון</font>!";
      }
      db.collection("guesses").doc(guessDocId).update({
        wrong: increment,
        total: increment
      }).catch(errorFunc)
    }
    //db.collection("guesses").doc(guessDocId).update({total : increment}).catch(errorFunc)
    clickIsPossible = 0;
    curGuesses++;
    changeImagesToLoading()
    gameLogic();
  }
}

function gameLogic() {
  if (curDrawnImages < numOfDrawingRounds) {
    setUpDrawing(curDrawnImages);
  } else if (guessMode && curGuesses < totalNumOfGussingRounds) {
    setUpGuess(curGuesses);
  } else if (curGuesses == totalNumOfGussingRounds) {
    gotoEndScreen();
  }
}



newGameButton.addEventListener("click", function () {
  initDrawMode()
});
submitButton.addEventListener("click", function () {
  submitDrawing()
});
undoButton.addEventListener("click", function () {
  undoStroke()
});
nextExampleButton.addEventListener("click", function () {
  nextExampleButtonClick()
})
playAgainButton.addEventListener("click", function () {
  initDrawMode()
});
startGuessPhaseButton.addEventListener("click", function () {
  initGuessMode();
  gameLogic();
})