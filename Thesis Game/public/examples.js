var numberOfExamplesRight = -1;
var language = "english"
const imgsPerRound = 3;

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function initHebrew() {
  if (language == "hebrew") {
    document.querySelector("#message").innerHTML = "<center>הוראות</center>";
    document.querySelector("#message2").innerHTML = document.querySelector("#message2").innerHTML = "<center>יוצגו לכם " + imgsPerRound + " תמונות. בבקשה ציירו את התמונה שמוקפת במסגרת אדומה. <br> אדם אחר יראה את " + imgsPerRound + " התמונות, וינסה לנחש איזה מהן ציירתם <br><br> הציור שלכם צריך להיות <font color=\"#FFE400\">מינימלי</font>, אבל עדיין לאפשר לנחש מה ציירתם</center>" + "<center><br> הציור שלכם יכלול קו אחד בלבד</center>";
    document.querySelector("#loginMsg").innerHTML = "כדי לשחק, בבקשה התחבר"
    document.querySelector("#secondInterExBtn").innerHTML = "לדוגמא הבאה";
    document.querySelector("#doneDrawing").innerHTML = "שלח";
    document.querySelector("#undoStroke").innerHTML = "מחק"
  }
}

language = getParameterByName("lang");
initHebrew();

var nextExampleButtonClick = function () {
  //newGameButton.style.display = "inline-block";
  if (!userSignedIn) {
    authButtons.style.display = "inline-block";
  } else {
    document.querySelector("#startGame").style.display = "inline-block";
    document.querySelector("#startGame").innerText = userName + " signed in. New game";
  }
  nextExampleButton.style.display = "none";
  document.querySelector("#doodle1").src = "data\\exfootball.PNG";
  document.querySelector("#doodle2").src = "data\\exfootballBad.png";
  document.querySelector("#eximg1").className = "eximg";
  document.querySelector("#eximg4").className = "exBorder eximg";
  document.querySelector("#message").innerHTML = "<center>Example 2:</example>";
  document.querySelector("#message3").innerHTML = "<center>The <font color=\"red\">right</font> drawing is <font color=\"red\">not good.</font> It does not contain enough details to determine the framed picture is a football, rather than a basketball.<br> The <font color=\"green\">left</font> drawing is <font color=\"green\">good</font>, it's a <font color=\"green\">minimal</font> representation that allows us to tell the picture is the red framed football:</example>"
  if (language == "hebrew") {
    document.querySelector("#message").innerHTML = "<center>דוגמא 2</example>";
    document.querySelector("#message3").innerHTML = "<center> הציור <font color=\"#FF652F\">הימני</font> הוא <font color=\"#FF652F\">לא טוב</font> . אין בו מספיק מידע בשביל לקבוע שהתמונה המסומנת היא כדורגל, ולא כדורסל. <br> הציור <font color=\"#14A76C\">השמאלי</font> הוא <font color=\"#14A76C\">טוב.</font> הוא יצוג <font color=\"#14A76C\">מינימלי</font> שמאפשר להבחין שהתמונה במסגרת האדומה היא כדורגל.</center>"
    if (userSignedIn) {
      document.querySelector("#startGame").innerText = " מחובר. התחל משחק " + userName;
    }
  }
  downloadDrawingImages(numOfDrawingRounds);
  needToDownloadPics = 0;
}

function resizeExampleImage(element, numOfPics) {
  console.log("resizing pic")
  var pic1 = document.querySelector("#eximg1");
  var picRatio = pic1.naturalHeight / pic1.naturalWidth
  element.style.maxWidth = (document.documentElement.clientWidth / numOfPics - 35) / document.documentElement.clientWidth * 100 + "vw";
}

var goToFirstExample = function () {
  document.querySelector("#exampleImgRow").style.display = "block";
  document.querySelector("#exampleImgRow2").style.display = "block";
  document.querySelector("#doodle3").style.display = "none";
  document.querySelector("#screwdriversSlot").style.display = "none"; //hide screwdriver photo
  document.querySelector("#sheepSlot").style.display = "none"; //hide sheep photo
  all = document.getElementsByClassName('excolumn');
  const numOfExamplePics = 4;
  for (var i = 0; i < all.length; i++) {
    resizeExampleImage(all[i], numOfExamplePics)
  }
  document.querySelector("#message3").style.display = "inline"
  document.querySelector("#message").innerHTML = "<center>example 1:<br>given these 3 pictures, when asked to draw the red framed picture</center>"
  if (language == "hebrew") {
    document.querySelector("#message").innerHTML = "<center>דוגמא 1 <br> בהינתן שלושלת התמונות הבאות, כאשר אתם מתבקשים לצייר את התמונה עם המסגרת האדומה:"
    document.querySelector("#message3").innerHTML = "<center>הציור <font color=\"#14A76C\">השמאלי</font>  הוא <font color=\"#14A76C\">טוב</font>. הוא <font color=\"#14A76C\">מינימלי</font> ומייצג את התמונה השמאלית ביותר בבירור. <br> הציור <font color=\"#FF652F\">הימני</font>  הוא <font color=\"#FF652F\">לא טוב</font>. הוא מייצג את התמונה השמאלית ביותר בבירור, אבל מכיל הרבה <font color=\"#FF652F\">פרטים מיותרים</font></center>"
    document.querySelector("#nextExample").innerText = "הבנתי"
  }
  document.querySelector("#message2").style.display = "none";
  nextExampleButton.style.display = "inline-block"
  document.querySelector("#firstExample").style.display = "none";
}

var goToFirstInteactiveExample = function () {
  numberOfExamplesRight = 0;
  document.querySelector("#sheepSlot").style.display = "block";
  document.querySelector("#message").innerHTML = "<center>Which sketch best represents the picture with the red frame? <br> The representation must be <font color=\"#FFE400\">minimal</font>, but still allow to tell which picture was drawn.</center>"
  if (language == "hebrew") {
    document.querySelector("#message").innerHTML = "<center>איזה מהיצוגים הבאים מייצג את התמונה עם המסגרת האדומה ?<br> היצוג צריך להיות <font color=\"#FFE400\">מינימלי</font>, אבל עדיין לאפשר להבין איזה מהתמונות צויירה.</center>"
  }

  let doodle1 = document.querySelector("#doodle1")
  let doodle2 = document.querySelector("#doodle2")
  let doodle3 = document.querySelector("#doodle3")
  doodle3.style.display = "inline-block";
  doodle1.src = "/data/cerealDoodle1.png"
  doodle2.src = "/data/cerealDoodle2.png"
  doodle3.src = "/data/cerealDoodle3.png";
  doodle1.style.border = "none";
  doodle2.style.border = "none";
  doodle3.style.border = "none";

  doodle1.addEventListener("click", clickSketch11);
  doodle2.addEventListener("click", clickSketch12);
  doodle3.addEventListener("click", clickSketch13);

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

  document.querySelector("#message3").innerHTML = "<center>Please click on the correct sketch</center>";
  if (language == "hebrew") {
    document.querySelector("#message3").innerHTML = "<center>בבקשה לחצו על הציור הנכון</center>"
  }
}

var clickSketchSecondExample = function () {
  document.querySelector("#doodle3").style.border = "thick solid green";
  document.querySelector("#startGame").style.display = "inline-block";
  document.querySelector("#doodle1").removeEventListener("click", clickSketch21)
  document.querySelector("#doodle2").removeEventListener("click", clickSketch22)
  document.querySelector("#doodle3").removeEventListener("click", clickSketch23)
}

var clickSketchFirstExample = function () {
  document.querySelector("#doodle2").style.border = "thick solid green";
  document.querySelector("#secondInterExBtn").style.display = "inline-block";
  document.querySelector("#doodle1").removeEventListener("click", clickSketch11)
  document.querySelector("#doodle2").removeEventListener("click", clickSketch12)
  document.querySelector("#doodle3").removeEventListener("click", clickSketch13)
}

var clickSketch11 = function () {
  document.querySelector("#message3").innerHTML = "<center><font color=\"#FF652F\">INCORRECT</font>. The sketch does not allow to distinguish between the two cereal bowls.</center>";
  if (language == "hebrew") {
    document.querySelector("#message3").innerHTML = "<center><font color=\"#FF652F\">לא נכון </font> הציור לא מאפשר להבדיל בין שתי הקערות.</center>";
  }
  clickSketchFirstExample();
}

var clickSketch12 = function () {
  numberOfExamplesRight++;
  document.querySelector("#message3").innerHTML = "<center><font color=\"#14A76C\">CORRECT</font>. This sketch is enough to distinguish between the two bowls, without adding too many unnecessary details</center>";
  if (language == "hebrew") {
    document.querySelector("#message3").innerHTML = "<center><font color=\"#14A76C\">נכון. </font> הציור מספיק מספיק כדי להבחין בין שתי הקערות, בלי להכיל יותר מדי פרטים מיותרים.</center>"
  }
  clickSketchFirstExample();
}
var clickSketch13 = function () {
  document.querySelector("#message3").innerHTML = "<center><font color=\"#FF652F\">INCORRECT</font>. The sketch refers to the correct picture, but has a lot of unnecessary details.</center>";
  if (language == "hebrew") {
    document.querySelector("#message3").innerHTML = "<center><font color=\"#FF652F\">לא נכון </font> הציור מייצג את התמונה הנכונה, אבל כולל הרבה פרטים מיותרים</center>"
  }
  clickSketchFirstExample();
}

var clickSketch21 = function () {
  document.querySelector("#message3").innerHTML = "<center><font color=\"#FF652F\">INCORRECT</font>. The sketch does not allow to distinguish between the bread and the dollar bill.</center>";
  if (language == "hebrew") {
    document.querySelector("#message3").innerHTML = "<center><font color=\"#FF652F\">לא נכון </font> הציור לא מאפשר להבדיל בין השטר של הדולר, לבין הלחם</center>"
  }
  clickSketchSecondExample();
}

var clickSketch23 = function () {
  numberOfExamplesRight++;
  document.querySelector("#message3").innerHTML = "<center><font color=\"#14A76C\">CORRECT</font>. This sketch is enough to distinguish between all of the pictures, without adding too many unnecessary details</center>";
  if (language == "hebrew") {
    document.querySelector("#message3").innerHTML = "<center><font color=\"#14A76C\">נכון. </font> הציור מספיק מספיק כדי להבדיל בין כל הציורים, בלי להכיל יותר מדי פרטים מיותרים.</center>"
  }
  clickSketchSecondExample();
}
var clickSketch22 = function () {
  document.querySelector("#message3").innerHTML = "<center><font color=\"#FF652F\">INCORRECT</font>. The sketch refers to the correct picture, but has some unnecessary details.</center>";
  if (language == "hebrew") {
    document.querySelector("#message3").innerHTML = "<center><font color=\"#FF652F\">לא נכון </font> הציור מייצג את התמונה הנכונה, אבל כולל הרבה פרטים מיותרים</center>"
  }
  clickSketchSecondExample();
}

var goToSecondInteractiveExample = function () {
  document.querySelector("#secondInterExBtn").style.display = "none";

  document.querySelector("#message").innerHTML = "<center>Which sketch best represents the picture with the red frame? <br> The representation must be both <font color=\"#FFE400\">minimal</font>, but still allow to tell which picture was drawn.</center>"
  if (language == "hebrew") {
    document.querySelector("#message").innerHTML = "<center>איזה מהיצוגים הבאים מייצג את התמונה עם המסגרת האדומה ?<br> היצוג צריך להיות <font color=\"#FFE400\">מינימלי</font>, אבל עדיין לאפשר להבין איזה מהתמונות צויירה.</center>"
  }

  let doodle1 = document.querySelector("#doodle1")
  let doodle2 = document.querySelector("#doodle2")
  let doodle3 = document.querySelector("#doodle3")
  doodle3.style.display = "inline-block";
  doodle1.src = "/data/breadDoodle1.png"
  doodle2.src = "/data/breadDoodle2.png"
  doodle3.src = "/data/breadDoodle3.png";
  doodle1.style.border = "none";
  doodle2.style.border = "none";
  doodle3.style.border = "none";

  doodle1.addEventListener("click", clickSketch21);
  doodle2.addEventListener("click", clickSketch22);
  doodle3.addEventListener("click", clickSketch23);

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

  document.querySelector("#message3").innerHTML = "<center>Please click on the correct sketch</center>";
  if (language == "hebrew") {
    document.querySelector("#message3").innerHTML = "<center>בבקשה לחצו על הציור הנכון</center>"
  }
}


document.querySelector("#secondInterExBtn").addEventListener("click", goToSecondInteractiveExample)
document.querySelector("#firstExample").addEventListener("click", function () {
  goToFirstExample()
})