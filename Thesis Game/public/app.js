  var db = firebase.firestore();
  // Get a reference to the database service
  const searchButton = document.querySelector("#lookForGame");
  const authButtons = document.querySelector("#authButtons")
  const messageText = document.querySelector("#message");
  const collectionRef = db.collection("waitingForGame");
  var docRef = collectionRef.doc("imLooking");
  var gamesCollectionRef = db.collection("ongoingGames");
  const submitButton = document.querySelector("#doneDrawing");
  const undoButton = document.querySelector("#undoStroke");
  const nextExampleButton = document.querySelector("#nextExample");
  var storageRef = firebase.storage().ref();
  var xint = -1;
  var submitPressed = -1;
  var myKey = -1;
  var otherKey = -1;
  var gameStarted = 0;
  var playerNum = -1;
  var gameRoomName = -1;
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  var gameDoc = -1;
  var listenForGameToEnd = -1;
  var clickIsPossible = 0;
  var timelimit=15; //change to 15 after debugging
  var saveSamples = 1;

  function downloadSetIMG(num,imgElementName){
    storageRef.child("aloi/"+num+"/"+num+"_i250.png").getDownloadURL().then(function(url) {
        // This can be downloaded directly:

        console.log("getting pic num ",num);

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        
        // Or inserted into an <img> element:
        var imgElement = document.querySelector(imgElementName);
        imgElement.src = url;
      });
  }

  function findGame(){
    myKey = firebase.firestore.Timestamp.fromDate(new Date()).nanoseconds;
    var entryToUpdate = {};
    entryToUpdate[myKey.toString()] = -1;
    docRef.update(entryToUpdate)
    .then(function(){
      console.log("Document successfully updated!");
      searchButton.style.display = 'none';
      messageText.innerText = "searching for a game";
      var unsubscribeFromLooking = docRef.onSnapshot(function(doc){
          if(gameStarted) return;
          console.log("firing doc update listener");
          var waitingRoomData = doc.data();
          var intKeys =  Array.from(Object.keys(waitingRoomData)).sort();
          if(intKeys.length <= 1){
              return;
          }
          var smallestKey = intKeys[0];
          var secondSmallestKey = intKeys[1];
          if(myKey == smallestKey){ //if I'm the owner of the smallest key, and there's another key available. Create a room
              console.log("my key ",myKey);
            gameRoomName = myKey+secondSmallestKey;
            otherKey = secondSmallestKey;
              gameDoc = gamesCollectionRef.doc(gameRoomName);
              gameStarted = 1;
              gameDoc.set({player1 : smallestKey, player2:secondSmallestKey,gameStarted:false,player1Drawing:-1,player2Drawing:-1}) //create game
              entryToUpdate[myKey.toString()] = secondSmallestKey.toString();
              docRef.update(entryToUpdate).then(function(){
                  console.log("creating game");
                  messageText.innerText = "found game (player1)";
                  playerNum = 1;
                  unsubscribeFromLooking();
                  gameLogic();
                  //listen for updates in game room now. Run game logic
              })
          }
          else{ //if I'm not the smallest key, check if smallest key is paired with me
              if(waitingRoomData[smallestKey] == myKey){ //this means we are paired
                  console.log("matched with host, my key: ",myKey);
                  gameRoomName = smallestKey + myKey;
                  otherKey = smallestKey;
                  gameDoc = gamesCollectionRef.doc(gameRoomName);
                  gameDoc.update({gameStarted: true}).then(function(){
                      console.log("starting game with id ",gameRoomName);
                      messageText.innerText = "found game (player2)";
                      gamestarted = 1;
                      playerNum = 2;
                      unsubscribeFromLooking();
                      gameLogic();
                      //listen for updates in game room. Run game logic
                  }).catch(function(error) {
                      console.log("Error updating document: ", error);
                  });
                  var keysToRemove = {};
                  keysToRemove[myKey] = firebase.firestore.FieldValue.delete();
                  keysToRemove[smallestKey] = firebase.firestore.FieldValue.delete();
                  docRef.update(keysToRemove).then(function(){
                      console.log("removed matched people from imLooking");
                  })
              }
          }
          })
    })
  }

  function startNewGameIfBothPlayersReady(doc,unSubFromFindingRematch){
    data = doc.data();
    console.log("checking if both players want a rematch")
    if(data["player1"] == "rematch" && data["player2"] == "rematch"){
        if(myKey <= otherKey){
            console.log("my key is smaller: ",myKey)
            console.log("other key: ",otherKey);
            unSubFromFindingRematch();
            var OldGameDoc = gameDoc;
            gameRoomName = gameRoomName + "2";
            gameDoc = gamesCollectionRef.doc(gameRoomName);
            gameDoc.set({player1 : myKey, player2:otherKey,gameStarted:false,player1Drawing:-1,player2Drawing:-1}).then(function(){
                console.log("created new game with id ",gameRoomName);
                OldGameDoc.update({gameStarted : "rematch"}).then(function(){
                    var listenForOtherPlayerToConnect = gameDoc.onSnapshot(function(doc){ //listen for other player to connect
                        if(doc.exists && doc.data()["gameStarted"] == true){
                            listenForOtherPlayerToConnect();
                            gameLogic();
                        }
                    })
                })
            });
        }
        else{
            console.log("check if other player request a rematch and created a room ",data["gameStarted"]);
            console.log("my key is larger: ",myKey)
            console.log("other key: ",otherKey);
            if( data["gameStarted"] == "rematch"){
                console.log("starting new game");
                gameRoomName = gameRoomName + "2";
                gameDoc = gamesCollectionRef.doc(gameRoomName);
                unSubFromFindingRematch();
                gameDoc.update({gameStarted:true}).then(function(){
                    gameLogic();
                })
            }
        }
    }
  }
  
  function generate5UniqueNumbers(min,max){
      var arr = [];
      while(arr.length < 5){
        var rnd = Math.floor(Math.random() * max) + min;
        if(arr.indexOf(rnd) === -1) arr.push(rnd);
    }
    return arr;
  }

  function load5Images(){
      var row = document.querySelector("#imgRow");
      var colElement = row.getElementsByClassName("column");
      for (var i=0;i<colElement.length; i++){
        colElement[i].style.display = "block";
      }
      const picIndexes = generate5UniqueNumbers(1,1000);

      var imgElement1 = document.querySelector("#img1");
     downloadSetIMG(picIndexes[0],"#img1")

      var imgElement2 = document.querySelector("#img2");
      downloadSetIMG(picIndexes[1],"#img2")

      var imgElement3 = document.querySelector("#img3");
      downloadSetIMG(picIndexes[2],"#img3")

      var imgElement4 = document.querySelector("#img4");
      downloadSetIMG(picIndexes[3],"#img4")

      var imgElement5 = document.querySelector("#img5");
      downloadSetIMG(picIndexes[4],"#img5")

      var lstOfElements = [imgElement1,imgElement2,imgElement3,imgElement4,imgElement5];
      var imgToDrawIndx = Math.floor(Math.random()*5);
      lstOfElements[imgToDrawIndx].style.border = "thick solid red";

      selfImgData = {}
      selfImgData["player"+playerNum+"Images"] = {0:imgToDrawIndx,1:picIndexes[0],2:picIndexes[1],3:picIndexes[2],4:picIndexes[3],5:picIndexes[4]};
      gameDoc.update(selfImgData)
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

  function executeWithDelay(n,toExecute,endCall){
    setTimeout( function() {
        if(n==0) {
            endCall();
        }
        if(n>=1){
            toExecute(n);
            executeWithDelay(n-1,toExecute,endCall);
        }
    },1000)
  }

  function countDownPainting(){
    submitPressed = 0;
    console.log("displaying draw countdown")
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    var timePassed=0;
    var printCountDown = function(i){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Look at the pictures", canvas.width/2, canvas.height/2);
    ctx.fillText("start drawing in "+i.toString(),canvas.width/2,canvas.height/2 + 50)
    ctx.fillText("you will only get "+timelimit.toString()+"s to draw!",canvas.width/2,canvas.height/2 + 100);
    }
    var finishCountDown = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        canDraw = 1;
        xint = setInterval(function(){
            if(submitPressed){clearInterval(xint)}; //if during countdown, submit button was pressed. stop counting
            timePassed++;
            messageText.innerHTML="Time left:"+(timelimit-timePassed).toString();
            if(timePassed == timelimit){
                clearInterval(xint);
                canDraw = 0;
                messageText.innerHTML="Time's up! Click submit to submit your drawing";
            }
        },1000);
    }
    executeWithDelay(5,printCountDown,finishCountDown); //change this to 10 once done debugging
  } 

  function switchToDrawMode(){
    hideTutorialElements();
    messageText.innerText = "Draw the framed picture"
    const picturesRow = document.querySelector("#imgRow");
    picturesRow.style.display = "block"
    const canvas = document.querySelector("#canvas");
    const canvasHolder = document.getElementsByClassName("canvasHolder")[0];
    canvasHolder.style.display = "inline-block";
    submitButton.style.display = "block";
    undoButton.style.display = "block";
    canvas.style.display = "flex";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function submitDrawing(){
      canDraw = 0;
      submitPressed = 1;
      clearInterval(xint);
      submitButton.style.display = "none";
      undoButton.style.display = "none";
      messageText.innerText = "Waiting for other player to finish drawing";
      entryToUpdate = {}
      entryToUpdate["player"+playerNum.toString()+"Drawing"] = drawing2dict(currentDrawing);
      console.log("submitting drawing ",entryToUpdate)
      try{
      gameDoc.update(entryToUpdate);
      }
      catch(e){
        messageText.innerText = e.toString();
      }
      currentDrawing = []
  }

  function gameLogic(){
      canDraw = 0; //this will change to 1 after countdown
      switchToDrawMode();
      load5Images();
      listenForGameToEnd = gameDoc.onSnapshot(function(doc){didBothPlayersSubmitDrawing(doc)});
      setTimeout( function() { 
        //add set event for when submit button is clicked
        countDownPainting();
        console.log("done waiting");
        
      }, 1000);

  }

  function clickPlayAgain(){
    messageText.innerText = "Waiting for other player to accept your rematch request.";
    playAgainButton.style.display = "none";
    var entryToUpdate = {}
    entryToUpdate["player"+playerNum] = "rematch"
    gameDoc.update(entryToUpdate).then(function(){
        var listenForNewGame = gameDoc.onSnapshot(function(doc){
            console.log("player"+playerNum+" wants a rematch")
            startNewGameIfBothPlayersReady(doc,listenForNewGame);
        })
    })
}

  
  function saveSample(gameData){
    var dictToWrite = {}
    dictToWrite["images"] = gameData["player"+(3-playerNum).toString()+"Images"];
    dictToWrite["drawing"] = gameData["player"+(3-playerNum).toString()+"Drawing"];
    var samplesCollection = db.collection("samples").doc(gameRoomName.toString()+playerNum.toString()).set(dictToWrite).then(function(){
        console.log("saved sample");
    });
  }

  function submitGuess(picNumber,correctGuess,gameData){
    if(clickIsPossible){
    if(picNumber == correctGuess){
        messageText.innerText = "Correct!";
        if(saveSamples){
            saveSample(gameData)
        }
    }
    else{
        messageText.innerText = "Incorrent!";
    }
    listenForGameToEnd();
    clickIsPossible = 0;
    playAgainButton.style.display = "block";
    }
  }

  function loadOtherPlayerDrawing(doc){
    gameData = doc.data();
    otherPlayerDrawings = gameData["player"+(3-playerNum).toString()+"Images"];
    var imgElement1 = document.querySelector("#img1");
    downloadSetIMG(otherPlayerDrawings["1"],"#img1");
    imgElement1.style.border = "none";

    var imgElement2 = document.querySelector("#img2");
    downloadSetIMG(otherPlayerDrawings["2"],"#img2");
    imgElement2.style.border = "none";

    var imgElement3 = document.querySelector("#img3");
    downloadSetIMG(otherPlayerDrawings["3"],"#img3");
    imgElement3.style.border = "none";

    var imgElement4 = document.querySelector("#img4");
    downloadSetIMG(otherPlayerDrawings["4"],"#img4");
    imgElement4.style.border = "none";

    var imgElement5 = document.querySelector("#img5");
    downloadSetIMG(otherPlayerDrawings["5"],"#img5");
    imgElement5.style.border = "none";


    lstnr1= imgElement1.addEventListener("click",function(){submitGuess(0,otherPlayerDrawings['0'],gameData)});
    lstnr2= imgElement2.addEventListener("click",function(){submitGuess(1,otherPlayerDrawings['0'],gameData)});
    lstnr3= imgElement3.addEventListener("click",function(){submitGuess(2,otherPlayerDrawings['0'],gameData)});
    lstnr4= imgElement4.addEventListener("click",function(){submitGuess(3,otherPlayerDrawings['0'],gameData)});
    lstnr5= imgElement5.addEventListener("click",function(){submitGuess(4,otherPlayerDrawings['0'],gameData)});
  }

  function switchToGuessMode(doc){
      //load other player's drawing
      gameData = doc.data()
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      messageText.innerText = "Select the correct picture";
      clickIsPossible = 1;
      console.log("getting data from ",gameData["player"+(3-playerNum).toString()+"Drawing"]);
      loadOtherPlayerDrawing(doc);
      drawArray(dict2drawing(gameData["player"+(3-playerNum).toString()+"Drawing"]));
  }

  function didBothPlayersSubmitDrawing(doc){
      gamedata = doc.data();
      if(gamedata["player1Drawing"]!=-1 && gamedata["player2Drawing"]!=-1){
          switchToGuessMode(doc);
          //stop listening for the gameDoc? probably not. place guess there.
      }
  }

var unloadEvent = function (e) {
    var confirmationMessage = "Warning: Leaving this page will result in any unsaved data being lost. Are you sure you wish to continue?";
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    var keysToRemove = {};
    keysToRemove[myKey] = firebase.firestore.FieldValue.delete();
    docRef.update(keysToRemove).then(function(){
        console.log("removed matched people from imLooking");
    });
    return confirmationMessage; //Webkit, Safari, Chrome etc.
};

var nextExampleButtonClick = function(){
    lookForGame.style.display = "inline-block";
    nextExampleButton.style.display = "none";
    document.querySelector("#doodle1").src = "data\\exfootball.PNG";
    document.querySelector("#doodle2").src = "data\\exfootballBad.png";
    document.querySelector("#eximg1").className = "eximg";
    document.querySelector("#eximg4").className = "exBorder eximg";
    document.querySelector("#message2").innerText = "Example 2:";
    document.querySelector("#message3").innerHTML = "The <font color=\"red\">right</font> drawing is <font color=\"red\">not good.</font> It does not contain enough details to determine the framed picture is a football, rather than a basketball.<br> The <font color=\"green\">left</font> drawing is <font color=\"green\">good</font>, it's a <font color=\"green\">minimal</font> representation that allows us to tell the picture is the red framed football:"
}

window.addEventListener("beforeunload", unloadEvent);

searchButton.addEventListener("click",function(){findGame();})
playAgainButton.addEventListener("click",function(){clickPlayAgain();})
submitButton.addEventListener("click",function(){submitDrawing()});
undoButton.addEventListener("click",function(){undoStroke()});
nextExampleButton.addEventListener("click",function(){nextExampleButtonClick()})
