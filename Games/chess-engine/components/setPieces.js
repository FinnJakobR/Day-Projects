
export const Pieces = {
    
    B_black: "../assets/pieces/black/B_black.png",
    K_black: "../assets/pieces/black/K_black.png",
    N_black: "../assets/pieces/black/N_black.png",
    P_black: "../assets/pieces/black/P_black.png",
    Q_black: "../assets/pieces/black/Q_black.png",
    R_black: "../assets/pieces/black/R_black.png",
    
    //Black Pieces------------------------------

    B_white : "../assets/pieces/white/B_white.png",
    K_white: "../assets/pieces/white/K_white.png",
    N_white: "../assets/pieces/white/N_white.png",
    P_white: "../assets/pieces/white/P_white.png",
    Q_white: "../assets/pieces/white/Q_white.png",
    R_white: "../assets/pieces/white/R_white.png"
}


export default function setPieces(game, notSet){

    const notations = game.notations;

    const field = document.getElementsByTagName("div")[0];

    for (let index = 0;  index < notations.length; index++) {

        for (var x in notations[index]){
            if(!isEmptyField(notations[index][x]) && notations[index][x] != notSet){
                const player = notations[index][x].player;
                const piece = notations[index][x].type;
                const pos = notations[index][x].pos;
                addToField(`${piece}_${player}`, pos,x);
            }
        }
    }
}


function isEmptyField(place){
    return place.player == undefined;
}

export function addToField(name,pos,notation){
    const pieceImg = document.createElement("img");
    const field = document.getElementsByTagName("div")[0];
    pieceImg.src = Pieces[name];
    pieceImg.setAttribute("piece_type", name);
    pieceImg.width = 65;
    pieceImg.draggable = true;
    pieceImg.height = 65;
    pieceImg.setAttribute("currentField",notation);
    const middleX = ((pos[1].x - (pos[0].x + pieceImg.width)) / 2) + pos[0].x;
    const middleY = (((pos[2].y) - (pos[0].y + pieceImg.height))/2) + pos[0].y;
    pieceImg.style.position = "absolute";
    pieceImg.style.top = middleY + "px";
    pieceImg.style.left = middleX + "px";
    field.appendChild(pieceImg);
}