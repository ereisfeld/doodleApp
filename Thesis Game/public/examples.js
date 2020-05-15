var numberOfExamplesRight = 0;

var nextExampleButtonClick = function(){
    //newGameButton.style.display = "inline-block";
    if(!userSignedIn){
        authButtons.style.display = "inline-block";
    }
    else{
        document.querySelector("#startGame").style.display = "inline-block";
        document.querySelector("#startGame").innerText = userName + " signed in. New game";
    }
    nextExampleButton.style.display = "none";
    document.querySelector("#doodle1").src = "data\\exfootball.PNG";
    document.querySelector("#doodle2").src = "data\\exfootballBad.png";
    document.querySelector("#eximg1").className = "eximg";
    document.querySelector("#eximg4").className = "exBorder eximg";
    document.querySelector("#message").innerText = "Example 2:";
    document.querySelector("#message3").innerHTML = "The <font color=\"red\">right</font> drawing is <font color=\"red\">not good.</font> It does not contain enough details to determine the framed picture is a football, rather than a basketball.<br> The <font color=\"green\">left</font> drawing is <font color=\"green\">good</font>, it's a <font color=\"green\">minimal</font> representation that allows us to tell the picture is the red framed football:"
    downloadDrawingImages(numOfImagesToDraw);
    needToDownloadPics = 0;
}

var goToFirstExample = function(){
  var all = document.getElementsByClassName('exDoodle');
  for (var i = 0; i < all.length; i++) {
  all[i].style.display = "inline-block";
  }
  document.querySelector("#doodle3").style.display ="none";
  all = document.getElementsByClassName('eximg');
  for (var i = 0; i < all.length; i++) {
  all[i].style.display = "inline-block";
  }
  document.querySelector("#message3").style.display = "inline"
  document.querySelector("#message").innerHTML = "example 1:<br>given these 5 pictures, when asked to draw the red framed picture"
  document.querySelector("#message2").style.display = "none";
  nextExampleButton.style.display = "inline-block"
  document.querySelector("#firstExample").style.display = "none";
}

var goToFirstInteactiveExample = function(){
  document.querySelector("#message").innerHTML = "Which sketch best represents the picture with the red frame? <br> The representation must be both <font color=\"#FFE400\">minimal</font>, but still allow to tell which picture was drawn."

  let doodle1 = document.querySelector("#doodle1")
  let doodle2 = document.querySelector("#doodle2")
  let doodle3 = document.querySelector("#doodle3")
  doodle3.style.display ="inline-block";
  doodle1.src = "/data/cerealDoodle1.png"
  doodle2.src = "/data/cerealDoodle2.png"
  doodle3.src = "/data/cerealDoodle3.png";
  doodle1.style.border = "none";
  doodle2.style.border = "none";
  doodle3.style.border = "none";

  doodle1.addEventListener("click",clickSketch11);
  doodle2.addEventListener("click",clickSketch12);
  doodle3.addEventListener("click",clickSketch13);

  var imgElement1 = document.querySelector("#eximg1");
  imgElement1.style.border = "thick solid red";
  imgElement1.src = "\\data\\excereal1.jpg"
  
  var imgElement2 = document.querySelector("#eximg2");
  imgElement2.style.border = "none";
  imgElement2.src = "\\data\\excereal2.jpg"

  var imgElement3 = document.querySelector("#eximg3");
  imgElement3.style.border = "none";
  imgElement3.src = "/data/exbread.jpg"

  var imgElement4 = document.querySelector("#eximg4");
  imgElement4.style.border = "none";
  imgElement4.src = "/data/exdollar.jpg"

  var imgElement5 = document.querySelector("#eximg5");
  imgElement5.style.display = "none";

  document.querySelector("#message3").innerText = "Please click on the correct sketch";
}

var clickSketchSecondExample = function(){
  document.querySelector("#doodle3").style.border = "thick solid green";
  document.querySelector("#startGame").style.display = "inline-block";
  document.querySelector("#doodle1").removeEventListener("click",clickSketch21)
  document.querySelector("#doodle2").removeEventListener("click",clickSketch22)
  document.querySelector("#doodle3").removeEventListener("click",clickSketch23)
}

var clickSketchFirstExample = function(){
  document.querySelector("#doodle2").style.border = "thick solid green";
  document.querySelector("#secondInterExBtn").style.display = "inline-block";
  document.querySelector("#doodle1").removeEventListener("click",clickSketch11)
  document.querySelector("#doodle2").removeEventListener("click",clickSketch12)
  document.querySelector("#doodle3").removeEventListener("click",clickSketch13)
}

var clickSketch11 = function(){
  document.querySelector("#message3").innerHTML = "<font color=\"#FF652F\">INCORRECT</font>. The sketch does not allow to distinguish between the two cereal bowls.";
  clickSketchFirstExample();
}

var clickSketch12 = function(){
  numberOfExamplesRight++;
  document.querySelector("#message3").innerHTML = "<font color=\"#14A76C\">CORRECT</font>. This sketch is enough to distinguish between the two bowls, without adding too many unnecessary details";
  clickSketchFirstExample();
}
var clickSketch13 = function(){
  document.querySelector("#message3").innerHTML = "<font color=\"#FF652F\">INCORRECT</font>. The sketch refers to the correct picture, but has a lot of unnecessary details.";
  clickSketchFirstExample();
}

var clickSketch21 = function(){
  document.querySelector("#message3").innerHTML = "<font color=\"#FF652F\">INCORRECT</font>. The sketch does not allow to distinguish between the bread and the dollar bill.";
  clickSketchSecondExample();
}

var clickSketch23 = function(){
  numberOfExamplesRight++;
  document.querySelector("#message3").innerHTML = "<font color=\"#14A76C\">CORRECT</font>. This sketch is enough to distinguish between all of the pictures, without adding too many unnecessary details";
  clickSketchSecondExample();
}
var clickSketch22 = function(){
  document.querySelector("#message3").innerHTML = "<font color=\"#FF652F\">INCORRECT</font>. The sketch refers to the correct picture, but has some unnecessary details.";
  clickSketchSecondExample();
}

var goToSecondInteractiveExample = function(){
  document.querySelector("#secondInterExBtn").style.display = "none";

  document.querySelector("#message").innerHTML = "Which sketch best represents the picture with the red frame? <br> The representation must be both <font color=\"#FFE400\">minimal</font>, but still allow to tell which picture was drawn."

  let doodle1 = document.querySelector("#doodle1")
  let doodle2 = document.querySelector("#doodle2")
  let doodle3 = document.querySelector("#doodle3")
  doodle3.style.display ="inline-block";
  doodle1.src = "/data/breadDoodle1.png"
  doodle2.src = "/data/breadDoodle2.png"
  doodle3.src = "/data/breadDoodle3.png";
  doodle1.style.border = "none";
  doodle2.style.border = "none";
  doodle3.style.border = "none";

  doodle1.addEventListener("click",clickSketch21);
  doodle2.addEventListener("click",clickSketch22);
  doodle3.addEventListener("click",clickSketch23);

  var imgElement1 = document.querySelector("#eximg1");
  imgElement1.style.border = "none";
  imgElement1.src = "\\data\\excereal1.jpg"
  
  var imgElement2 = document.querySelector("#eximg2");
  imgElement2.style.border = "none";
  imgElement2.src = "\\data\\excereal2.jpg"

  var imgElement3 = document.querySelector("#eximg3");
  imgElement3.style.border = "thick solid red";
  imgElement3.src = "/data/exbread.jpg"

  var imgElement4 = document.querySelector("#eximg4");
  imgElement4.style.border = "none";
  imgElement4.src = "/data/exdollar.jpg"

  var imgElement5 = document.querySelector("#eximg5");
  imgElement5.style.display = "none";

  document.querySelector("#message3").innerText = "Please click on the correct sketch";
}


document.querySelector("#secondInterExBtn").addEventListener("click",goToSecondInteractiveExample)
document.querySelector("#firstExample").addEventListener("click",function(){goToFirstExample()})