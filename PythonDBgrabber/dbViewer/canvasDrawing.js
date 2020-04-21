const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

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
    const canvasHeight = 500;
    const canvasWidth = 500;

    canvas.height=canvasHeight;
    canvas.width = canvasWidth;

});