var output = [];
var picIndex = -1;
const pathToDB = "\\media\\eyal\\Acer\\Users\\Eyal\\Documents\\School\\datasets\\shapeNet\\choices2\\cropped\\"
const numOfPicsPerRound = 3;

function handleIndex(i){
  drawIndex(i)
  setImages(getImgNumsForCurIndex(i))
  document.querySelector("#right").innerHTML = " Right: "+output["right"][i]
  document.querySelector("#wrong").innerHTML = " Wrong: "+output["wrong"][i]
  document.querySelector("#total").innerHTML = " total: "+output["total"][i]
}

function drawIndex(i) {
  var curOutputData = output[i];
  //var drawingArr = dict2drawing(curOutputData["Drawing"])
  var drawingArr = dict2drawing(output["Drawing"][i])
  drawArray(drawingArr)
}

function setImages(imgNumsToSet) {
  for (var i = 0; i < imgNumsToSet.length; i++) {
    var imgElement = document.querySelector("#img" + (i + 1).toString());
    imgElement.src = pathToDB + imgNumsToSet[i] + ".jpg";
    console.log("correct answer: ", output["images"][picIndex][0])
    if (output["images"][picIndex][0] == i) {
      imgElement.style.border = "thick solid red";
    } else {
      imgElement.style.border = "none";
    }
  }
}

function getImgNumsForCurIndex(picIndex) {
  var imgNums = [];
  for (var i = 0; i < numOfPicsPerRound; i++) {
    imgNums.push(output["images"][picIndex][(i + 1).toString()])
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
        //output.push(JSON.parse(e.target.result))
        output = JSON.parse(e.target.result)
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
  }
  console.log(output)
  drawFirstPicture = function () {
    setTimeout(() => {
      if (output.length > 0) {
        handleIndex(picIndex)
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
  handleIndex(picIndex)
}

function clickPrev() {
  picIndex--;
  if (picIndex < 0) {
    console.log("no more pictures selected");
    picIndex = -1;
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleIndex(picIndex)
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('nextBtn').addEventListener('click', clickNext);
document.getElementById('prevBtn').addEventListener('click', clickPrev);