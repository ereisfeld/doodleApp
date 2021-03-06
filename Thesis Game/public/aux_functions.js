function downloadSetIMG(num, curArray, index) {
  storageRef.child("cropped/" + num + ".jpg").getDownloadURL().then(function (url) {
    // This can be downloaded directly:
    curArray[index] = url;

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function (event) {
      var blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();

    // Or inserted into an <img> element:
    //var imgElement = document.querySelector(imgElementName);
    //imgElement.src = url;
  });
}

function didImagesLoad(array, round) {
  for (var i = 0; i < array[round].length; i++) {
    if (array[round][i] == -1) {
      return false
    }
  }
  return true;
}

function makeImagesClickable() {
  var imgElement1 = document.querySelector("#img1");
  var imgElement2 = document.querySelector("#img2");
  var imgElement3 = document.querySelector("#img3");
  var imgElement4 = document.querySelector("#img4");
  var imgElement5 = document.querySelector("#img5");

  submitGuess1 = function () {
    submitGuess(0)
  };
  submitGuess2 = function () {
    submitGuess(1)
  };
  submitGuess3 = function () {
    submitGuess(2)
  };
  submitGuess4 = function () {
    submitGuess(3)
  };
  submitGuess5 = function () {
    submitGuess(4)
  };

  submitGuessFunctions.push(submitGuess1);
  submitGuessFunctions.push(submitGuess2);
  submitGuessFunctions.push(submitGuess3);
  submitGuessFunctions.push(submitGuess4);
  submitGuessFunctions.push(submitGuess5);

  imgElement1.addEventListener("click", submitGuess1);
  imgElement2.addEventListener("click", submitGuess2);
  imgElement3.addEventListener("click", submitGuess3);
  imgElement4.addEventListener("click", submitGuess4);
  imgElement5.addEventListener("click", submitGuess5);
}

function makeImagesNotClickable() {
  var imgElement1 = document.querySelector("#img1");
  var imgElement2 = document.querySelector("#img2");
  var imgElement3 = document.querySelector("#img3");
  var imgElement4 = document.querySelector("#img4");
  var imgElement5 = document.querySelector("#img5");

  imgElement1.removeEventListener("click", submitGuessFunctions[0]);
  imgElement2.removeEventListener("click", submitGuessFunctions[1]);
  imgElement3.removeEventListener("click", submitGuessFunctions[2]);
  imgElement4.removeEventListener("click", submitGuessFunctions[3]);
  imgElement5.removeEventListener("click", submitGuessFunctions[4]);
}

function changeImagesToLoading() {
  var imgElement1 = document.querySelector("#img1");
  var imgElement2 = document.querySelector("#img2");
  var imgElement3 = document.querySelector("#img3");
  var imgElement4 = document.querySelector("#img4");
  var imgElement5 = document.querySelector("#img5");
  imgElement1.src = "data\\loading.jpg"
  imgElement2.src = "data\\loading.jpg"
  imgElement3.src = "data\\loading.jpg"
  imgElement4.src = "data\\loading.jpg"
  imgElement5.src = "data\\loading.jpg"
}

function gotoEndScreen() {
  makeImagesNotClickable()
  const picturesRow = document.querySelector("#imgRow");
  picturesRow.style.display = "none"
  const canvas = document.querySelector("#canvas");
  const canvasHolder = document.getElementsByClassName("canvasHolder")[0];
  const newGame = document.querySelector("#startGame");
  newGame.style.display = "none";
  canvasHolder.style.display = "none";
  submitButton.style.display = "none";
  undoButton.style.display = "none";
  canvas.style.display = "none";
  var msg2 = document.querySelector("#message2");
  msg2.style.display = "block"
  messageText.innerText = "Thanks for playing!"
  msg2.innerText = "You got " + numOfCorrectGuesses.toString() + " guesses right, out of " + totalNumOfGussingRounds;
  if (language == "hebrew") {
    messageText.innerText = "תודה ששיחקת!"
    msg2.innerText = "ניחשת " + numOfCorrectGuesses.toString() + " ניחושים נכון, מתוך " + totalNumOfGussingRounds
    playAgainButton.innerText = "שחק שוב"
  }

  playAgainButton.style.display = "block";
  changeImagesToLoading()
  curGuesses = 0;
  numOfCorrectGuesses = -1;
  needToDownloadPics = 1;
}

function loadGuessInstructions() {
  const picturesRow = document.querySelector("#imgRow");
  picturesRow.style.display = "none"
  const canvas = document.querySelector("#canvas");
  const canvasHolder = document.getElementsByClassName("canvasHolder")[0];
  canvasHolder.style.display = "none";
  submitButton.style.display = "none";
  undoButton.style.display = "none";
  canvas.style.display = "none";
  var msg2 = document.querySelector("#message2");
  var msg3 = document.querySelector("#message3");
  msg2.style.display = "block"
  msg3.style.display = "block";
  messageText.innerHTML = "<center>We've added the " + numOfDrawingRounds + " images you've drawn into the database.</center>"
  msg2.innerHTML = "<center>You are now entering the guessing phase. You will be shown " + imgsPerRound + " images and a sketch. Click on the picture that looks the most like the sketch.</ceter>"
  msg3.innerHTML = "<center>You will need to do so " + totalNumOfGussingRounds.toString() + " times. Good luck!</center>";
  if (language == "hebrew") {
    messageText.innerHTML = "<center>הוספנו את " + numOfDrawingRounds + " התמונות שציירת למאגר הנתונים.</center>"
    msg2.innerHTML = "<center>אתם נכנסים עכשיו לשלב הניחושים. יוצגו לכם " + imgsPerRound + " תמונות וציור. לחצו על התמונה שהכי דומה לציור.</center>"
    msg3.innerHTML = "<center> תצטרכו לעשות זאת " + totalNumOfGussingRounds.toString() + "פעמים. בהצלחה ! </center>"
  }
  startGuessPhase.style.display = "block";
  changeImagesToLoading()

  if (!preSelectGuesses) {
    select5Guesses();
  }
  downloadGuessingImages(totalNumOfGussingRounds);
  setTimeout(function () {
    gameLogic();
  }, 1000);
}

function hideTutorialElements() {
  console.log("hiding tutorial elements")
  var row = document.getElementById("exampleImgRow");
  row.style.display = "none";
  var row2 = document.getElementById("exampleImgRow2");
  row2.style.display = "none";
  /*var colElement = row.getElementsByClassName("excolumn");
  for (var i=0;i<colElement.length; i++){
    colElement[i].style.display = "none";
  }
  var colElement2 = row.getElementsByClassName("excolumnDoodle");
  for (var i=0;i<colElement.length; i++){
    colElement[i].style.display = "none";
  }*/
  var msg2 = document.querySelector("#message2");
  var msg3 = document.querySelector("#message3");
  msg2.style.display = "none";
  msg3.style.display = "none";
  var exampleDoodle = document.querySelector("#doodle1");
  exampleDoodle.style.display = "none";
  var exampleDoodle2 = document.querySelector("#doodle2");
  exampleDoodle2.style.display = "none";
}

function generateUniqueNumbers(min, max, num) {
  var arr = [];
  while (arr.length < num) {
    var rnd = Math.floor(Math.random() * max) + min;
    if (arr.indexOf(rnd) === -1) arr.push(rnd);
  }
  return arr;
}

function getQueryNoSelfDocs(collection) {
  for (var i = 0; i < 5; i++) {
    collection = collection.where(firebase.firestore.FieldPath.documentId(), '>', drawnDocIDs[i]).where(firebase.firestore.FieldPath.documentId(), '<', drawnDocIDs[i]);
  }
  return collection;
}

function getRandomdocs(seed, depth) {
  //gets 5 random doc array with random seed higher than 'seed', and put them in guessesDataArray.
  let guessCollection = db.collection("guesses");
  let samplesCollection = db.collection("samples");
  var numberOfPicsGotten = guessesDataArray.length;
  console.log("starting to fetch. num of pics so far: ", numberOfPicsGotten)
  var maxIndex = -1;
  randomQuery = samplesCollection.where("random", ">=", seed).limit(totalNumOfGussingRounds - numberOfPicsGotten).get().then(function (snapshot) {
      numberOfPicsGotten = numberOfPicsGotten + snapshot.size;
      console.log(numberOfPicsGotten + " < num of pics gotten");
      maxIndex = Math.max(...snapshot.docs.map(doc => doc.data()["random"]))
      console.log("max index: ", maxIndex);
      snapshot.forEach(doc => {
        guessesDataArray.push(doc);
      })
      if (numberOfPicsGotten < totalNumOfGussingRounds) {
        console.log("wrapping around, getting " + (totalNumOfGussingRounds - numberOfPicsGotten).toString() + " more docs");
        lastQuery = samplesCollection.where("random", ">=", 0).limit(totalNumOfGussingRounds - numberOfPicsGotten).get().then(function (snapshot) {
          maxIndex = Math.max(...snapshot.docs.map(doc => doc.data()["random"]))
          console.log("max index: ", maxIndex);
          snapshot.forEach(doc => {
            guessesDataArray.push(doc);
          })
          console.log("number of guesses fetched: " + guessesDataArray.length.toString());
          console.log(guessesDataArray);
        })
      } else {
        console.log(guessesDataArray);
      }
      console.log("before filter: ", guessesDataArray.length)
      guessesDataArray = guessesDataArray.filter(function (doc) { //filter docs that were drawn by the user
        return !drawnDocIDs.includes(doc.id)
      })
      console.log("after filter: ", guessesDataArray.length)

      if (guessesDataArray.length < totalNumOfGussingRounds) //try to fetch again after filtering
      {
        if (depth < 3) {
          getRandomdocs(maxIndex + 1, depth + 1)
        } else {
          console.log("max retries reached - not fetching anymore. rounds gotten: ", guessesDataArray.length);
        }
      }
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}

function select5Guesses() {
  //select 5 round docs, 3 randomly and 2 with low amount of guesses.
  //save docData of those guesses, and download the 5 pictures, keep downloaded urls in a list.
  urlArrayGuesses = [];
  guessesDataArray = []; //before downloading, reset old
  var randomIndex = Math.random() * maxRandomValue; //get 5 documents with random vals higher than this random number
  console.log("random seed: " + randomIndex.toString());
  getRandomdocs(randomIndex, 0)
  console.log("guess rounds:")
  console.log(guessesDataArray)
}

function downloadGuessingImages(rounds) {
  for (var i = 0; i < rounds; i++) {
    var curUrls = [guessesDataArray[i].data()["images"][0]] //this is the correct guess
    for (var a = 0; a < imgsPerRound; a++) {
      curUrls.push(-1);
    }
    for (var j = 1; j <= imgsPerRound; j++) {
      downloadSetIMG(guessesDataArray[i].data()["images"][j], curUrls, j);
    }
    urlArrayGuesses.push(curUrls);
  }

}

function downloadDrawingImages(rounds) {
  for (var i = 0; i < rounds; i++) {
    var picIndexes = generateUniqueNumbers(0, 50, imgsPerRound);
    var curUrls = [Math.floor(Math.random() * imgsPerRound)];
    for (var a = 0; a < imgsPerRound; a++) {
      curUrls.push(-1);
    }
    for (var j = 0; j < imgsPerRound; j++) {
      downloadSetIMG(picIndexes[j], curUrls, j + 1);
    }
    urlArray.push(curUrls);
    picIdArray.push(picIndexes);
  }
}

function resizeImage(element) {
  var aspectRatio = originalImagesSizeHeight / originalImagesSizeWidth
  var wantedWidth = (document.documentElement.clientWidth / imgsPerRound - 35)
  var expectedHeight = wantedWidth * aspectRatio
  if (expectedHeight > document.documentElement.clientHeight - canvas.height - 70) {
    element.style.height = (document.documentElement.clientHeight - canvas.height - 70) / document.documentElement.clientHeight * 100 + "vh";
  } else {
    element.style.width = (document.documentElement.clientWidth / imgsPerRound - 35) / document.documentElement.clientWidth * 100 + "vw";
  }
}

function showGuessingImages(round) {
  var row = document.querySelector("#imgRow");
  var colElement = row.getElementsByClassName("column");
  var i = 0;
  var lstOfElements = []
  for (i; i < imgsPerRound; i++) {
    colElement[i].style.display = "block";
    var imgElement = document.querySelector("#img" + (i + 1).toString());
    imgElement.style.border = "none"
    imgElement.src = urlArrayGuesses[round][i + 1];
    resizeImage(colElement[i])
    lstOfElements.push(imgElement);
  }
  for (i; i < colElement.length; i++) {
    colElement[i].style.display = "none";
  }
  correctGuess = urlArrayGuesses[round][0];
}

function ShowDrawingImages(round) {
  var row = document.querySelector("#imgRow");
  var colElement = row.getElementsByClassName("column");
  var i = 0;
  var lstOfElements = []
  for (i; i < imgsPerRound; i++) {
    colElement[i].style.display = "block";
    var imgElement = document.querySelector("#img" + (i + 1).toString());
    imgElement.style.border = "none"
    imgElement.src = urlArray[round][i + 1];
    resizeImage(colElement[i])
    lstOfElements.push(imgElement);
  }
  for (i; i < colElement.length; i++) {
    colElement[i].style.display = "none";
  }
  lstOfElements[urlArray[round][0]].style.border = "thick solid red";

}