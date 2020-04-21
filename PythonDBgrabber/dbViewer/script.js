var output = [];
var picIndex = -1;
const pathToDB = "C:\\Users\\Eyal\\Documents\\School\\datasets\\aloi\\"

function drawIndex(i){
  var curOutputData = output[i];
  var drawingArr = dict2drawing(curOutputData["Drawing"])
  drawArray(drawingArr)
}

function setImages(img1Num,img2Num,img3Num,img4Num,img5Num){
  var imgElement1 = document.querySelector("#img1");
  var imgElement2 = document.querySelector("#img2");
  var imgElement3 = document.querySelector("#img3");
  var imgElement4 = document.querySelector("#img4");
  var imgElement5 = document.querySelector("#img5");

  imgElement1.src = pathToDB + img1Num +"\\" + img1Num + "_i250.png";
  imgElement2.src = pathToDB + img2Num +"\\" + img2Num + "_i250.png";
  imgElement3.src = pathToDB + img3Num +"\\" + img3Num + "_i250.png";
  imgElement4.src = pathToDB + img4Num +"\\" + img4Num + "_i250.png";
  imgElement5.src = pathToDB + img5Num +"\\" + img5Num + "_i250.png";
}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  picIndex = 0;
  // files is a FileList of File objects. List some properties.
  output = [];
  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        output.push(JSON.parse(e.target.result))
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
  }
  console.log(output)
  drawFirstPicture = function() {setTimeout(() => {
    if(output.length>0){
      drawIndex(picIndex);
      setImages(output[picIndex]["images"]["1"],output[picIndex]["images"]["2"],output[picIndex]["images"]["3"],output[picIndex]["images"]["4"],output[picIndex]["images"]["5"]);
    }
    else{
      drawFirstPicture();
    }
    }, 50); }
  drawFirstPicture();
}

function clickNext(){
  picIndex++;
  if(picIndex>=output.length){
    console.log("no more pictures selected");
    picIndex = output.length;
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawIndex(picIndex);
  setImages(output[picIndex]["images"]["1"],output[picIndex]["images"]["2"],output[picIndex]["images"]["3"],output[picIndex]["images"]["4"],output[picIndex]["images"]["5"]);
}

function clickPrev(){
  picIndex--;
  if(picIndex<0){
    console.log("no more pictures selected");
    picIndex = -1;
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawIndex(picIndex);
  setImages(output[picIndex]["images"]["1"],output[picIndex]["images"]["2"],output[picIndex]["images"]["3"],output[picIndex]["images"]["4"],output[picIndex]["images"]["5"]);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('nextBtn').addEventListener('click',clickNext);
document.getElementById('prevBtn').addEventListener('click',clickPrev);