

export default function CalculateCoords(game){

    const canvas = document.getElementsByTagName("div")[0];

    const gameHeight = canvas.style.height.match(/\d*/)[0];
    const gameWidth = canvas.style.width.match(/\d*/)[0];


    const notations = game.notations;

    for (let y = 0; y < notations.length; y++) {

        const heightPerGrid = gameHeight / 8;
        const widthPerGrid = gameWidth / 8;

        var index = 0

        for (var key in notations[y]){
            const TopLeft = {x: index * widthPerGrid, y: y * heightPerGrid};
            const TopRight = {x: (index * widthPerGrid) + widthPerGrid, y: y * heightPerGrid};
            const BottomLeft = {x: index * widthPerGrid, y: (y * heightPerGrid) + heightPerGrid};
            const BottomRight = {x: (index * widthPerGrid) + widthPerGrid, y: (y * heightPerGrid) + heightPerGrid};
            notations[y][key].pos = [TopLeft, TopRight, BottomLeft, BottomRight]
            index++;
        }
        
    }

    game.notations = notations;

    return game;
}