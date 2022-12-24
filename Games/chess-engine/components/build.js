

export default function generateField(size, color){
    const fieldInstance = document.createElement("div");
    
    fieldInstance.style.height = size + "px";
    fieldInstance.style.width = size + "px";

    fieldInstance.className = "field";

   const backgroundUrl = generateGrid(size,color)

   fieldInstance.style.background = `url(${backgroundUrl})`;

   document.getElementsByTagName("body")[0].appendChild(fieldInstance);
}



function generateGrid(size,color){

    const pseudoCanvas = document.createElement("canvas");
    
    pseudoCanvas.height = size;
    pseudoCanvas.width = size;


    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            var isLightField = (x + y) % 2 != 0;
            var currentColor = isLightField ? color.w : color.b;
            generateGridField(y,x,currentColor,pseudoCanvas);
        }
        
    }

    return pseudoCanvas.toDataURL();

    

}



function generateGridField(y,x,color,canvas){

    const heightPerGrid = canvas.height / 8;
    const widthPerGrid = canvas.width / 8;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = color;
    ctx.fillRect(heightPerGrid * y, widthPerGrid * x, widthPerGrid, heightPerGrid);

    return;
}