

export class Cpu {
    constructor(playState){
        this.playState = playState;
    }

    unendschieden(){

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if(this.playState[x][y] < 0) return false;
                
            }
            
        }

        return true;
    }


    avaibleMoves(){
     const Moves = [];

     for (let colums = 0; colums < 3; colums++) {
        for (let rows = 0; rows < 3; rows++) {
            if(this.playState[colums][rows] == -1) {
                const possibleMove = {x: colums, y: rows};
                Moves.push(possibleMove);
            }
        }        
    }
    return Moves;
    }

    doMove(x,y,player){

    this.playState[x][y] = player;
    return;
    }

    undoMove(x,y){

    this.playState[x][y] = -1;

    }

    winner(){
        for (let row = 0; row < 3; row++) {
            const rows = this.playState[row].join("");

            if(rows === "111") return {winner: true, player: "X"};

            if(rows === "000") return {winner: true, player: "O"};

        }


        for (let colums = 0; colums < 3; colums++) {
            var column = "";

            for (let rows = 0; rows < 3; rows++) {
                column += this.playState[rows][colums];    
                
            }

            if(column === "111") return {winner: true, player: "X"};

            if(column === "000") return {winner: true, player: "O"};
            
        }

        const leftQuer = `${this.playState[0][0]}${this.playState[1][1]}${this.playState[2][2]}`;

        if(leftQuer === "111") return {winner: true, player: "X"};

        if(leftQuer === "000") return {winner: true, player: "O"};

        const rightQuer = `${this.playState[0][2]}${this.playState[1][1]}${this.playState[2][0]}`;

        if(rightQuer === "111") return {winner: true, player: "X"};

        if(rightQuer === "000") return {winner: true, player: "O"};

       const isuendschieden = this.unendschieden();

       if(isuendschieden) return {winner: true, player: "both"};

        return {winner: false, player: null};
    }

    score(player){

        if(player === "X") return 10;
        
        if(player === "O") return -10;

        if(player === "both") return 0; 

    }


    play(){

        var maxScore = -Infinity;

        var perfectScore = {};

        const Moves = this.avaibleMoves();

        for (let index = 0; index < Moves.length; index++) {
            this.doMove(Moves[index].x, Moves[index].y, 1);
            const newBot = new Cpu(this.playState);
            const newPossibleGame = newBot.minmax(0, 0, -Infinity, Infinity);
            this.undoMove(Moves[index].x, Moves[index].y);
            if(newPossibleGame > maxScore){
                maxScore = newPossibleGame;
                perfectScore = {x: Moves[index].x, y: Moves[index].y}
            }
        }
        return perfectScore;
    }

    minmax(depth, player, alpha, beta){
        var isMax = false;
        if(player == 1) isMax = true;

        const isEnded = this.winner();
        
        if(isEnded.winner === true) return this.score(isEnded.player);

        if(isMax) {
            const Moves = this.avaibleMoves();

            for (let index = 0; index < Moves.length; index++) {
                this.doMove(Moves[index].x, Moves[index].y, 1);
                const newBot = new Cpu(this.playState);
                var newPlayer = 0;
                if(!isMax) newPlayer = 1; 
                const newPossibleGame = newBot.minmax(depth++, newPlayer, alpha, beta);
                alpha = Math.max(alpha, newPossibleGame);
                this.undoMove(Moves[index].x, Moves[index].y);
                if(alpha >= beta) break;
            }
            return alpha;
        }else{
            const Moves = this.avaibleMoves();
            for (let index = 0; index < Moves.length; index++) {
                this.doMove(Moves[index].x, Moves[index].y, 0);
                const newBot = new Cpu(this.playState);
                var newPlayer = 0;
                if(!isMax) newPlayer = 1; 
                const newPossibleGame = newBot.minmax(depth++, newPlayer, alpha, beta);
                beta = Math.min(beta, newPossibleGame);
                this.undoMove(Moves[index].x, Moves[index].y);
                if (beta <= alpha) break;
            }
            return beta;
        }
    }
}