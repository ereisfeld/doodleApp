function downloadSetIMG(num,curArray,index){
    storageRef.child("aloi/"+num+"/"+num+"_i250.png").getDownloadURL().then(function(url) {
        // This can be downloaded directly:
        curArray[index]=url;

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        
        // Or inserted into an <img> element:
        //var imgElement = document.querySelector(imgElementName);
        //imgElement.src = url;
      });
  }

  function didImagesLoad(array,round){
    for(var i=0; i<array[round].length; i++){
      if(array[round][i] == -1)
      {
        return false
      }
    }
    return true;
  }

  function makeImagesClickable(){
    var imgElement1 = document.querySelector("#img1");
    var imgElement2 = document.querySelector("#img2");
    var imgElement3 = document.querySelector("#img3");
    var imgElement4 = document.querySelector("#img4");
    var imgElement5 = document.querySelector("#img5");

    submitGuess1 = function(){submitGuess(0)};
    submitGuess2 = function(){submitGuess(1)};
    submitGuess3 = function(){submitGuess(2)};
    submitGuess4 = function(){submitGuess(3)};
    submitGuess5 = function(){submitGuess(4)};

    submitGuessFunctions.push(submitGuess1);
    submitGuessFunctions.push(submitGuess2);
    submitGuessFunctions.push(submitGuess3);
    submitGuessFunctions.push(submitGuess4);
    submitGuessFunctions.push(submitGuess5);

    imgElement1.addEventListener("click",submitGuess1);
    imgElement2.addEventListener("click",submitGuess2);
    imgElement3.addEventListener("click",submitGuess3);
    imgElement4.addEventListener("click",submitGuess4);
    imgElement5.addEventListener("click",submitGuess5);
  }

  function makeImagesNotClickable(){
    var imgElement1 = document.querySelector("#img1");
    var imgElement2 = document.querySelector("#img2");
    var imgElement3 = document.querySelector("#img3");
    var imgElement4 = document.querySelector("#img4");
    var imgElement5 = document.querySelector("#img5");

    imgElement1.removeEventListener("click",submitGuessFunctions[0]);
    imgElement2.removeEventListener("click",submitGuessFunctions[1]);
    imgElement3.removeEventListener("click",submitGuessFunctions[2]);
    imgElement4.removeEventListener("click",submitGuessFunctions[3]);
    imgElement5.removeEventListener("click",submitGuessFunctions[4]);
  }

function changeImagesToLoading(){
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

  function gotoEndScreen(){
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
    msg2.innerText = "You got "+numOfCorrectGuesses.toString()+ " guesses right, out of "+totalNumOfGussingRounds;
    playAgainButton.style.display = "block";
    changeImagesToLoading()
    curGuesses = 0;
    numOfCorrectGuesses = -1;
    needToDownloadPics = 1;
  }

  function loadGuessInstructions(){
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
    messageText.innerText = "We've added the 5 images you've drawn into the database."
    msg2.innerText = "You are now entering the guessing phase. You will be shown 5 images and a sketch. Click on the picture that looks the most like the sketch."
    msg3.innerText = "You will need to do so "+totalNumOfGussingRounds.toString()+" times. Good luck!";
    startGuessPhase.style.display = "block";
    changeImagesToLoading()
    
    if(!preSelectGuesses){
      select5Guesses();
    }
    downloadGuessingImages(totalNumOfGussingRounds);
    setTimeout(function(){
      gameLogic();
    },1000);
  }

  function hideTutorialElements(){
    console.log("hiding tutorial elements")
    var row = document.getElementById("exampleImgRow");
    row.style.display = "none";
    var colElement = row.getElementsByClassName("excolumn");
    for (var i=0;i<colElement.length; i++){
      colElement[i].style.display = "none";
    }
      var msg2 = document.querySelector("#message2");
      var msg3 = document.querySelector("#message3");
      msg2.style.display = "none";
      msg3.style.display = "none";
      var exampleDoodle = document.querySelector("#doodle1");
      exampleDoodle.style.display = "none";
      var exampleDoodle2 = document.querySelector("#doodle2");
      exampleDoodle2.style.display = "none";
  }

  function generate5UniqueNumbers(min,max){
    var arr = [];
    while(arr.length < 5){
      var rnd = Math.floor(Math.random() * max) + min;
      if(arr.indexOf(rnd) === -1) arr.push(rnd);
  }
  return arr;
}

function getQueryNoSelfDocs(collection){
  for (var i=0; i<5; i++){
    collection = collection.where(firebase.firestore.FieldPath.documentId(), '>',drawnDocIDs[i]).where(firebase.firestore.FieldPath.documentId(), '<',drawnDocIDs[i]);
  }
  return collection;
}

function select5Guesses(){
  //select 5 round docs, 3 randomly and 2 with low amount of guesses.
  //save docData of those guesses, and download the 5 pictures, keep downloaded urls in a list.
  urlArrayGuesses = [];
  guessesDataArray = []; //before downloading, reset old
  let guessCollection = db.collection("guesses");
  let samplesCollection = db.collection("samples");
  var numberOfPicsGotten = -1;
  queryRef = guessCollection.where("total","<=",2).limit(2).get().then(function(snapshot){
    numberOfPicsGotten = snapshot.size;
    console.log(numberOfPicsGotten+" < num of pics gotten");
    snapshot.forEach(doc => {
      samplesCollection.doc(doc.id.toString()).get().then(function(doc){
        if(doc.exists){
          console.log("pushing doc data1")
        guessesDataArray.push(doc)
        }
        else{
          console.log("doc doesn't exist")
        }
      })
    });
    var randomIndex = Math.random()*maxRandomValue; //get 5 documents with random vals higher than this random number
    console.log("random seed: "+randomIndex.toString());
    randomQuery = samplesCollection.where("random",">=",randomIndex).limit(5-numberOfPicsGotten).get().then(function(snapshot){
      numberOfPicsGotten=numberOfPicsGotten+snapshot.size;
      console.log(numberOfPicsGotten+" < num of pics gotten");
      snapshot.forEach(doc=> {
        console.log("pushing doc data2");
        guessesDataArray.push(doc);
      })
      if(numberOfPicsGotten<totalNumOfGussingRounds){
        console.log("wrapping around, getting "+(totalNumOfGussingRounds-numberOfPicsGotten).toString()+" more docs");
        lastQuery = samplesCollection.where("random",">=",0).limit(5-numberOfPicsGotten).get().then(function(snapshot){
          snapshot.forEach(doc=> {
            console.log("pushing doc data3");
            guessesDataArray.push(doc);
          })
          console.log("number of guesses fetched: "+guessesDataArray.length.toString());
          console.log(guessesDataArray);

        })
      }
      else{
        console.log(guessesDataArray);
      }
    })
  }).catch(function(error) {
    console.log("Error getting documents: ", error);
}); 
}

function downloadGuessingImages(rounds){
  for(var i=0; i<rounds; i++){
    var curUrls = [guessesDataArray[i].data()["images"][0],-1,-1,-1,-1,-1] //this is the correct guess
    for(var j=1; j<=5; j++){
      downloadSetIMG(guessesDataArray[i].data()["images"][j],curUrls,j);
    }
    urlArrayGuesses.push(curUrls);
  }
  
}

function downloadDrawingImages(rounds){
  for(var i=0;i<rounds;i++){
    var picIndexes = generate5UniqueNumbers(1,1000);
    var curUrls = [Math.floor(Math.random()*5),-1,-1,-1,-1,-1];
    for(var j=0; j<5; j++){
      downloadSetIMG(picIndexes[j],curUrls,j+1);
    }
    urlArray.push(curUrls);
    picIdArray.push(picIndexes);
  }
}

function showGuessingImages(round){
  var row = document.querySelector("#imgRow");
  var colElement = row.getElementsByClassName("column");
  for (var i=0;i<colElement.length; i++){
    colElement[i].style.display = "block";
  }
  var imgElement1 = document.querySelector("#img1");
  imgElement1.style.border = "none";
  imgElement1.src = urlArrayGuesses[round][1];

  var imgElement2 = document.querySelector("#img2");
  imgElement2.style.border = "none";
  imgElement2.src = urlArrayGuesses[round][2];

  var imgElement3 = document.querySelector("#img3");
  imgElement3.style.border = "none";
  imgElement3.src = urlArrayGuesses[round][3];

  var imgElement4 = document.querySelector("#img4");
  imgElement4.style.border = "none";
  imgElement4.src = urlArrayGuesses[round][4];

  var imgElement5 = document.querySelector("#img5");
  imgElement5.style.border = "none";
  imgElement5.src = urlArrayGuesses[round][5];

  correctGuess = urlArrayGuesses[round][0];
}

function ShowDrawingImages(round){
    var row = document.querySelector("#imgRow");
    var colElement = row.getElementsByClassName("column");
    for (var i=0;i<colElement.length; i++){
      colElement[i].style.display = "block";
    }
      var imgElement1 = document.querySelector("#img1");
      imgElement1.style.border = "none";
      imgElement1.src = urlArray[round][1];
  
      var imgElement2 = document.querySelector("#img2");
      imgElement2.style.border = "none";
      imgElement2.src = urlArray[round][2];
  
      var imgElement3 = document.querySelector("#img3");
      imgElement3.style.border = "none";
      imgElement3.src = urlArray[round][3];
  
      var imgElement4 = document.querySelector("#img4");
      imgElement4.style.border = "none";
      imgElement4.src = urlArray[round][4];
  
      var imgElement5 = document.querySelector("#img5");
      imgElement5.style.border = "none";
      imgElement5.src = urlArray[round][5];
  
      var lstOfElements = [imgElement1,imgElement2,imgElement3,imgElement4,imgElement5];
      lstOfElements[urlArray[round][0]].style.border = "thick solid red";


}