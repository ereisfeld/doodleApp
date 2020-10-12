var output = [];
var picIndex = -1;
const pathToDB = "C:\\Users\\Eyal\\Documents\\School\\datasets\\aloi\\"
const numOfPicsPerRound = 5;


function drawIndex(i) {
  var curOutputData = output[i];
  var drawingArr = dict2drawing(curOutputData["Drawing"])
  drawArray(drawingArr)
}

function setImages(imgNumsToSet) {
  for (var i = 0; i < imgNumsToSet.length; i++) {
    var imgElement = document.querySelector("#img" + (i + 1).toString());
    imgElement.src = pathToDB + imgNumsToSet[i] + "\\" + imgNumsToSet[i] + "_i250.png";
    console.log("correct answer: ", output[picIndex]["images"][0])
    if (output[picIndex]["images"][0] == i) {
      imgElement.style.border = "thick solid red";
    } else {
      imgElement.style.border = "none";
    }
  }
}

function getImgNumsForCurIndex(picIndex) {
  var imgNums = [];
  for (var i = 0; i < numOfPicsPerRound; i++) {
    imgNums.push(output[picIndex]["images"][(i + 1).toString()])
  }
  return imgNums;
}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  picIndex = 0;
  // files is a FileList of File objects. List some properties.
  output = [];
  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        // Render thumbnail.
        output.push(JSON.parse(e.target.result))
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
  }
  console.log(output)
  drawFirstPicture = function () {
    setTimeout(() => {
      if (output.length > 0) {
        drawIndex(picIndex);
        setImages(getImgNumsForCurIndex(picIndex));
      } else {
        drawFirstPicture();
      }
    }, 50);
  }
  drawFirstPicture();
}

function clickNext() {
  picIndex++;
  if (picIndex >= output.length) {
    console.log("no more pictures selected");
    picIndex = output.length;
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawIndex(picIndex);
  setImages(getImgNumsForCurIndex(picIndex));
}

function clickPrev() {
  picIndex--;
  if (picIndex < 0) {
    console.log("no more pictures selected");
    picIndex = -1;
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawIndex(picIndex);
  setImages(getImgNumsForCurIndex(picIndex));
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('nextBtn').addEventListener('click', clickNext);
document.getElementById('prevBtn').addEventListener('click', clickPrev);