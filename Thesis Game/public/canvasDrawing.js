var currentDrawing = [];
var canDraw = 1;

function undoStroke(){
    if(currentDrawing.length > 0){
        currentDrawing.pop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawArray(currentDrawing);
    }
}

function drawing2dict(arr){
    resultDict = {};
    for(var i=0; i<arr.length; i++){ //i is the stroke number
        resultDict[i.toString()] = {}
        for (var j=0; j<arr[i].length; j++){ //iterate over points in each stroke
            resultDict[i.toString()][j.toString()]= {x: arr[i][j][0],y: arr[i][j][1]};           
        }
            }
    return resultDict;
}

function dict2drawing(dict){
    arr = new Array(Object.values(dict).length); //array with room for each stroke size
    for (var i=0; i<Object.values(dict).length; i++){
        arr[i] = new Array(Object.values(dict[i.toString()]).length); //array with room for each point within a stroke
        for (var j=0; j<Object.values(dict[i.toString()]).length; j++){
            arr[i][j] = [dict[i.toString()][j.toString()]["x"], dict[i.toString()][j.toString()]["y"]];
        }
    }
    return arr;
}

function drawArray(arr){
        console.log("drawing ",arr);
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();

        for(var i=0; i<arr.length; i++){ //i is the stroke number
            for (var j=0; j<arr[i].length; j++){ //iterate over points in each stroke
            ctx.lineTo(arr[i][j][0],arr[i][j][1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(arr[i][j][0],arr[i][j][1]);
            }
            ctx.beginPath();
        }
        ctx.beginPath();
}

window.addEventListener("load",() => {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    const submitButton = document.querySelector("#doneDrawing");

    const canvasHeight = 500;
    const canvasWidth = 500;

    canvas.height=canvasHeight;
    canvas.width = canvasWidth;

    var currentStroke = [];

    let painting = false;

    var touchX,touchY;
    var mouseX,mouseY;

    function startPainting(e) {
        painting = true;
        currentStroke = [];
        draw(e)
    }

    function startPaintingTouch(e) {
        painting = true;
        currentStroke = [];
        drawTouch(e)
        event.preventDefault();
    }

    function stopPainting(){
        painting = false;
        if(currentStroke.length >0){
        currentDrawing.push(currentStroke);
        currentStroke = [];
        ctx.beginPath();
        }
    }

    function getMousePos(e) {
        if (!e)
         var e = event;

        if (e.offsetX) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        }
        else if (e.layerX) {
            mouseX = e.layerX;
            mouseY = e.layerY;
        }
    }

    function draw(e){
        if (!painting || !canDraw) return;
        getMousePos(e);
        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        ctx.lineTo(mouseX,mouseY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouseX,mouseY);
        currentStroke.push([mouseX,mouseY]);
    }

    function getTouchPos(e) {
        if (!e)
            var e = event;

        if (e.touches) {
                var touch = e.touches[0]; // Get the information for finger #1
                var rect = canvas.getBoundingClientRect();
                touchX=touch.clientX - rect.left;
                touchY=touch.clientY - rect.top;
            
        }
    }

    function drawTouch(e){
        if (!painting || !canDraw) return;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        getTouchPos(e)

        ctx.lineTo(touchX,touchY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(touchX,touchY);
        currentStroke.push([touchX,touchY]);
        event.preventDefault();
    }

    canvas.addEventListener("mousedown",startPainting);
    window.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mousemove",draw);
    canvas.addEventListener("touchstart",startPaintingTouch,false);
    window.addEventListener("touchend", stopPainting,false);
    canvas.addEventListener("touchmove", drawTouch,false);

});