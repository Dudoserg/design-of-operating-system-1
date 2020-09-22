function draw(arr, canvasName) {
    let canvas = document.getElementById(canvasName);
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let ctx = canvas.getContext("2d");
    let canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    function drawPixel(x, y, r, g, b, a) {
        var index = (x + y * canvasWidth) * 4;

        canvasData.data[index + 0] = r;
        canvasData.data[index + 1] = g;
        canvasData.data[index + 2] = b;
        canvasData.data[index + 3] = a;
    }

    function drawLine(x1, y1, x2, y2) {
        ctx.strokeStyle = "#FF0000";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }

    function updateCanvas() {
        ctx.putImageData(canvasData, 0, 0);
    }

    let max = -99999;
    for(let i = 0 ; i < arr.length; i++)
        if(arr[i] > max)
            max = arr[i];
    ctx.beginPath();

    for (let index = 0; index < 500 - 1; index++) {
        let x1 = arr[index];
        let y1 = Math.round(500 - (x1 / max * 500) - 1);
        let x2 = arr[index + 1];
        let y2 = Math.round(500 - (x2 / max * 500) - 1);
        // drawPixel(index, y, 255, 0, 0, 255);
        drawLine(index, y1, index + 1, y2);
        updateCanvas();
    }
    ctx.stroke();
}

export {draw}