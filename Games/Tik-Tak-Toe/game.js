import {Cpu} from './cpu.js';

class TikTakToe {
    constructor(height, width, color, isCpu) {
        this.state = "init";
        this.board = [[],[],[]];
        this.height = height;
        this.width = width;
        this.color = color;
        this.currentPlayer = 1;
    }

    build(){
        const html_board = document.createElement("div");
        const body = document.body;

        html_board.style.backgroundColor = this.color;
        html_board.style.height = this.height + "px";
        html_board.style.width = this.width + "px";

        const fieldWidth = (this.width / 3) + "px"; 
        html_board.style.gridTemplateColumns = `repeat(auto-fill, ${fieldWidth})`
        html_board.className = "board";

        for (let field = 0; field < 9; field++) {
            
            this.buildField(html_board);
            
        }
        body.appendChild(html_board);

        this.state = "Board build";

        this.initBoard();
    }

    buildField(board){
        const field = document.createElement("div")
        field.className = "field";
        field.style.height = this.height / 3 + "px";
        field.style.cursor = "pointer";
        board.appendChild(field);
    }

    run(){

        this.state = "Game Started";

        var symbol = "O";

        if(this.currentPlayer === 1){
            const bot = new Cpu(this.board);
            const perfectIndex = bot.play(1);
            this.doMoveForBot(perfectIndex.x, perfectIndex.y);
            this.currentPlayer = 0;
        }

         const fields = document.getElementsByClassName("field");

         for (let field = 0; field < fields.length; field++) {
            fields[field].addEventListener("click",()=>{
                if(this.state === "Game has Ended") {
                    this.clearBoard();
                    this.run();

                    return;
                };


                const BoardIndex = this.getIndex(field);


                if(this.board[BoardIndex.y][BoardIndex.x] > -1)  return;

                if(symbol === "O") this.board[BoardIndex.y][BoardIndex.x] = 0;

                if(symbol === "X") this.board[BoardIndex.y][BoardIndex.x] = 1;


            fields[field].innerHTML = symbol;

            this.currentPlayer == 0 ? this.currentPlayer = 1 : this.currentPlayer = 0;

            if(this.currentPlayer == 0) symbol = "X";
            else symbol = "O"

            if(this.currentPlayer === 1){
                    const bot = new Cpu(this.board);
                const perfectIndex = bot.play(1);
                console.log(perfectIndex);
                this.doMoveForBot(perfectIndex.x, perfectIndex.y);
                this.currentPlayer = 0;
            }

            const iswinner = this.winner();

            if(iswinner.winner) {
                const winnerScreen = document.createElement("div");

              winnerScreen.innerText = `Game has Ended, the winner is player ${iswinner.player}`;

                winnerScreen.className = "winnerScreen";

               document.body.appendChild(winnerScreen);

               this.state = "Game has Ended";

               setTimeout(() => {
                window.location.reload();
               }, 1000);

               return;

            }
            });
         }
    }

    doMoveForBot(x,y){
        console.log(x,y);
        this.board[x][y] = 1;
        const index = this.calcBackIndex(x,y);
       document.getElementsByClassName("field")[index].innerHTML = "X";
       return;
    }

    calcBackIndex(x,y){
        const index = (x * 3) + y;

        return index;
    }


    winner(){
        for (let row = 0; row < 3; row++) {
            const rows = this.board[row].join("");

            if(rows === "111") return {winner: true, player: "X"};

            if(rows === "000") return {winner: true, player: "O"};

        }


        for (let colums = 0; colums < 3; colums++) {
            var column = "";

            for (let rows = 0; rows < 3; rows++) {
                column += this.board[rows][colums];    
                
            }

            if(column === "111") return {winner: true, player: "X"};

            if(column === "000") return {winner: true, player: "O"};
            
        }

        const leftQuer = `${this.board[0][0]}${this.board[1][1]}${this.board[2][2]}`;

        if(leftQuer === "111") return {winner: true, player: "X"};

        if(leftQuer === "000") return {winner: true, player: "O"};

        const rightQuer = `${this.board[0][2]}${this.board[1][1]}${this.board[2][0]}`;

        if(rightQuer === "111") return {winner: true, player: "X"};

        if(rightQuer === "000") return {winner: true, player: "O"};

       const isuendschieden = this.unendschieden();

       if(isuendschieden) return {winner: true, player: "both"};

        return {winner: false, player: null};
    }


    initBoard(){
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                this.board[x][y] = -1;
                
            }
            
        }
    }

    clearBoard(){
        this.initBoard();
        const board = document.getElementsByClassName("board")[0];
        const winnerScreen = document.getElementsByClassName("winnerScreen")[0];
        document.body.removeChild(board);
        document.body.removeChild(winnerScreen);
        this.build();

        this.state = "Board was cleared";

        this.currentPlayer = 0;

        return;
    }

    unendschieden(){

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if(this.board[x][y] < 0) return false;
                
            }
            
        }

        return true;
    }
    getIndex(fieldIndex){
        const x = (fieldIndex % 3);

        const y = Math.floor(fieldIndex / 3);

        const BoardIndex = {x: x, y: y};


        return BoardIndex;
    }
}


function main (){
    const game = new TikTakToe(800, 800, "white", true);

    game.build();

    game.run();

    return; 
}


main();