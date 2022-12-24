import BitOp,{AddBinary} from "./components/bitOperations.js";
import generateField from "./components/build.js";
import { createEmptyBitboard, GenerateFileBoards, GenerateRankBoard, getSignedInteger, ShowAsBitboard } from "./components/calcBits.js";
import CalculateCoords from "./components/calculateNotationCoords.js";
import convertValidMovesToNoation, { getLineOnBitBoard } from "./components/convertValidMoves.js";
import { parseInto2DBoard, parseNotationStr } from "./components/parse.js";
import setPieces from "./components/setPieces.js";
import { validateColor, validFen } from "./components/validation.js";



class Chess {
    constructor(size, fenStrn, color) {
        this.bordColor = color;
        this.size = size;
        this.fenStr = fenStrn;

        //Pointer to field in Html
        this.board = null;
        
        this.currentRound = 1;


        /* 
        1. each pos of Pieces on the board
        2. whose turn to move 
        3. Status of the 50 Move draw rule 
        4. if an en-Passate Move is Possible 
        5. Rochade rights 
        */
        this.state = null;


        this.TwoDBoard = null;

        //Bitboard Instances for Pieces 

        this.WHITE_PAWN = "0".repeat(64);
        this.WHITE_KNIGHT = "0".repeat(64);
        this.WHITE_BISHOP = "0".repeat(64);
        this.WHITE_ROOK = "0".repeat(64);
        this.WHITE_QUEEN = "0".repeat(64);
        this.WHITE_KING = "0".repeat(64);

        this.BLACK_PAWN = "0".repeat(64);
        this.BLACK_KNIGHT = "0".repeat(64);
        this.BLACK_BISHOP = "0".repeat(64);
        this.BLACK_ROOK = "0".repeat(64);
        this.BLACK_QUEEN = "0".repeat(64);
        this.BLACK_KING = "0".repeat(64);

        this.FILE_A = GenerateFileBoards("a");
        this.FILE_B = GenerateFileBoards("b");
        this.FILE_C = GenerateFileBoards("c");
        this.FILE_D = GenerateFileBoards("d");
        this.FILE_E = GenerateFileBoards("e");
        this.FILE_F = GenerateFileBoards("f");
        this.FILE_G = GenerateFileBoards("g");
        this.FILE_H = GenerateFileBoards("h");
        this.FILE_MIDDLE = this.FILE_D;

        this.RANK_8 = GenerateRankBoard(8);
        this.RANK_7 = GenerateRankBoard(7);
        this.RANK_6 = GenerateRankBoard(6);
        this.RANK_5 = GenerateRankBoard(5);
        this.Rank_4 = GenerateRankBoard(4);
        this.RANK_3 = GenerateRankBoard(3);
        this.RANK_2 = GenerateRankBoard(2);
        this.RANK_1 = GenerateRankBoard(1);
        this.RANK_MIDDLE = this.Rank_4;
        this.history = null;

        //11111111



        this.MIDDLE = 103481868288;
        this.MIDDLE_EXTENDED = 66229406269440;
        this.KING_SIDE = -1085102592571150096;
        this.QUEEN_SIDE = 1085102592571150095;

         //TODO: DiagonalMask -> AntiDiagonalMask

        this.RANK_MASK = [this.RANK_1, this.RANK_2, this.RANK_3, this.Rank_4, this.RANK_5, this.RANK_6, this.RANK_7, this.RANK_8];
        this.FILE_MASK = [this.FILE_A,this.FILE_B,this.FILE_C,this.FILE_D,this.FILE_E,this.FILE_F,this.FILE_G,this.FILE_H];

        this.DIAGONAL_MASK = [BitOp(`(${"0b" + this.RANK_8} & ${"0b" + this.FILE_H})`),BitOp(`(${"0b" + this.RANK_7} & ${"0b" + this.FILE_G})`),BitOp(`(${"0b" + this.RANK_6} & ${"0b" + this.FILE_F})`),BitOp(`${"0b" + this.RANK_5} & ${"0b" + this.FILE_E})`),BitOp(`(${"0b" + this.Rank_4} & ${"0b" + this.FILE_D})`),BitOp(`(${"0b" + this.RANK_3} & ${"0b" + this.FILE_C})`),BitOp(`(${"0b" + this.RANK_2} & ${"0b" + this.FILE_B})`),BitOp(`(${"0b" + this.RANK_1} & ${"0b" + this.FILE_A})`)];

        this.ANTI_DIAGONAL_MASK = [BitOp(`(${"0b" + this.RANK_8} & ${"0b" + this.FILE_A})`), BitOp(`(${"0b" + this.RANK_8} & ${"0b" + this.FILE_A})`)]

        this.DIAGONAL_LINE = BitOp(`(${"0b" + this.RANK_8} & ${"0b" + this.FILE_H}) | (${"0b" + this.RANK_7} & ${"0b" + this.FILE_G}) | (${"0b" + this.RANK_6} & ${"0b" + this.FILE_F}) | (${"0b" + this.RANK_5} & ${"0b" + this.FILE_E}) | (${"0b" + this.Rank_4} & ${"0b" + this.FILE_D}) | (${"0b" + this.RANK_3} & ${"0b" + this.FILE_C}) | (${"0b" + this.RANK_2} & ${"0b" + this.FILE_B}) | (${"0b" + this.RANK_1} & ${"0b" + this.FILE_A})`);

        this.ANTI_DIAGONAL_LINE = (BitOp(`(${"0b" + this.RANK_8} & ${"0b" + this.FILE_A}) | (${"0b" + this.RANK_7} & ${"0b" + this.FILE_B}) | (${"0b" + this.RANK_6} & ${"0b" + this.FILE_C}) | (${"0b" + this.RANK_5} & ${"0b" + this.FILE_D}) | (${"0b" + this.Rank_4} & ${"0b" + this.FILE_E}) | (${"0b" + this.RANK_3} & ${ "0b" + this.FILE_F}) | (${"0b" + this.RANK_2} & ${"0b" + this.FILE_G}) | (${"0b" + this.RANK_1} & ${"0b" + this.FILE_H})`))

        this.KING_B7 = 460039;
        this.KNIGHT_C7 = 43234889994;
        

        //build the board
        this.build();

        const res = "0b10000".numberOfLeadingZeros()
        const res2 = "0b000100000".numberOfTrailingZeros();

        console.log(res,res2)


       //ShowAsBitboard(this.BLACK_QUEEN)
    }


    build(){

        if(!validateColor(this.bordColor)) throw Error("valid Color Parameter");

        if(!validFen(this.fenStr)) throw Error("not valid FEN String!")

        generateField(this.size,this.bordColor)

        this.state = parseNotationStr(this.fenStr.slice(0,this.fenStr.indexOf(" ") + 1), this.fenStr);

        this.TwoDBoard = parseInto2DBoard(this.state)

        this.createBitBoard();

        this.state = CalculateCoords(this.state);

        setPieces(this.state,null);

        const valid = this.calcValidMoves("P_white");
        const valid2 = this.calcValidMoves("P_black");

        console.log(valid2);

        const validTest = valid2.substring(28,32); // immer in 4er schritten auslesen 

        const start = parseInt(validTest.charAt(0)) * 8 + parseInt(validTest.charAt(1));
        const end = parseInt(validTest.charAt(2) * 8) + parseInt(validTest.charAt(3));

        console.log(start,end);


        console.log("ValidMoves for White Pawns:", convertValidMovesToNoation(valid));
        console.log("ValidMoves for Black Pawns:", convertValidMovesToNoation(valid2));

        this.Nextround()


    }

    Nextround(){
    }


    createBitBoard(){
        var Binary;

        console.log(this.TwoDBoard)
        for (let index = 0; index < 64; index++) {

            Binary = "0".repeat(64);

            Binary = Binary.substring(index + 1) + "1" + Binary.substring(0, index);

            const line = Math.floor(index / 8);
            const row = index % 8;

            switch (this.TwoDBoard[line][row]) {
                case "white_R":
                    this.WHITE_ROOK = BitOp(`${"0b" + this.WHITE_ROOK} + ${"0b" + Binary}`);
                    break;
                case "white_B":
                    this.WHITE_BISHOP = BitOp(`${"0b" + this.WHITE_BISHOP} + ${"0b" + Binary}`);
                    break;
                case "white_P":
                    this.WHITE_PAWN = BitOp(`${"0b" + this.WHITE_PAWN} + ${"0b" + Binary}`);
                    break;
                case "white_N":
                    this.WHITE_KNIGHT = BitOp(`${"0b" + this.WHITE_KNIGHT} + ${"0b" + Binary}`);
                    break;
                case "white_Q":
                    this.WHITE_QUEEN =BitOp(`${"0b" + this.WHITE_QUEEN} + ${"0b" + Binary}`);
                    break;
                case "white_K":
                    this.WHITE_KING = BitOp(`${"0b" + this.WHITE_KING} + ${"0b" + Binary}`);
                    break;

                case "black_R":
                    this.BLACK_ROOK = BitOp(`${"0b" + this.BLACK_ROOK} + ${"0b" + Binary}`);
                    break;
                case "black_B":
                    this.BLACK_BISHOP = BitOp(`${"0b" + this.BLACK_BISHOP} + ${"0b" + Binary}`);
                    break;
                case "black_P":
                    this.BLACK_PAWN =  BitOp(`${"0b" + this.BLACK_PAWN} + ${"0b" + Binary}`);
                    break;
                case "black_N":
                    this.BLACK_KNIGHT = BitOp(`${"0b" + this.BLACK_KNIGHT} + ${"0b" + Binary}`);
                    break;
                 case "black_Q":
                    this.BLACK_QUEEN = BitOp(`${"0b" + this.BLACK_QUEEN} + ${"0b" + Binary}`);
                    break;
                case "black_K":
                     this.BLACK_KING =  BitOp(`${"0b" + this.BLACK_KING} + ${"0b" + Binary}`);
                    break;
                
            }
            
        }
    }

    //s in clacValidMoves is the index of the currentSliding Piece!


    calcValidMoves(type,s){
        const NOT_WHITE_PIECES = BitOp(`~(${"0b" + this.WHITE_PAWN}|${"0b" + this.WHITE_KNIGHT}|${"0b" + this.WHITE_BISHOP}|${"0b" + this.WHITE_ROOK}|${"0b" + this.WHITE_QUEEN}|${"0b" + this.WHITE_KING}|${"0b" + this.BLACK_KING})`)
        const BLACK_PIECES = BitOp(`${"0b" + this.BLACK_PAWN} | ${"0b" + this.BLACK_KNIGHT}|${"0b" + this.BLACK_BISHOP}|${"0b" + this.BLACK_ROOK}|${"0b" + this.BLACK_QUEEN}`)
        const WHITE_PIECES = BitOp(`~(${"0b" + NOT_WHITE_PIECES})`);
        const EMPTY = BitOp(`~(${"0b" + this.WHITE_PAWN}|${"0b" + this.WHITE_KNIGHT}| ${"0b" + this.WHITE_BISHOP}|${"0b" + this.WHITE_ROOK}|${"0b" + this.WHITE_QUEEN}|${"0b" + this.WHITE_KING} | ${"0b" + this.BLACK_PAWN} | ${"0b" + this.BLACK_KNIGHT} | ${"0b" + this.BLACK_BISHOP}| ${"0b" + this.BLACK_ROOK}| ${"0b" + this.BLACK_QUEEN}| ${"0b" + this.BLACK_KING})`)
        switch(type){
            case "P_white":
                var possibleMoves = "";
                var PAWN_MOVES = BitOp(`(${"0b" + this.WHITE_PAWN} >> 7)&${"0b" + BLACK_PIECES}&(~${"0b" + this.RANK_8})&(~${"0b" + this.FILE_A})`)//caputure right
                
                for (let i = ("0b" + PAWN_MOVES).numberOfTrailingZeros(); i < 64 - ("0b" + PAWN_MOVES).numberOfLeadingZeros(); i++) {
                    const condition = parseInt(BitOp(`(${"0b" + PAWN_MOVES} >> ${i}) & 0b1`),2);
                    if(condition == 1){
                        possibleMoves+=""+Math.floor(i/8+1)+Math.floor(i%8-1)+Math.floor(i/8)+Math.floor(i%8);
                    }
                    
                }

                PAWN_MOVES = BitOp(`(${"0b"+ this.WHITE_PAWN} >> 9)&${"0b"+ BLACK_PIECES}&~${"0b" + this.RANK_8}&~${"0b" + this.FILE_H}`); //capture left;
                for (let i = ("0b" + PAWN_MOVES).numberOfTrailingZeros(); i < 64 - ("0b" + PAWN_MOVES).numberOfLeadingZeros(); i++) {
                    const condition = parseInt(BitOp(`(${"0b" + PAWN_MOVES} >> ${i}) & 0b1`),2);
                    if(condition == 1){
                        possibleMoves+=""+Math.floor((i/8+1))+Math.floor((i%8+1))+Math.floor((i/8))+Math.floor((i%8));
                    }
                }

                PAWN_MOVES = BitOp(`(${"0b" + this.WHITE_PAWN} >> 8)&${"0b"+ EMPTY}&~${"0b"+ this.RANK_8}`) // move 1 forward
                for (let i = ("0b" + PAWN_MOVES).numberOfTrailingZeros(); i < 64 - ("0b" + PAWN_MOVES).numberOfLeadingZeros(); i++) {
                    const condition = parseInt(BitOp(`(${"0b" + PAWN_MOVES} >> ${i}) & 0b1`),2); //serilize 
                    if(condition == 1){
                        possibleMoves+=""+Math.floor((i/8+1))+Math.floor((i%8))+Math.floor((i/8))+Math.floor((i%8));
                    }
                }

                PAWN_MOVES = BitOp(`(${"0b" + this.WHITE_PAWN} >> 16)&${"0b"+ EMPTY}&(${"0b"+ EMPTY} >> 8)`) // move 2 forward
                for (let i = ("0b" + PAWN_MOVES).numberOfTrailingZeros(); i < 64 - ("0b" + PAWN_MOVES).numberOfLeadingZeros(); i++) {
                    const condition = parseInt(BitOp(`(${"0b" + PAWN_MOVES} >> ${i}) & 0b1`),2);
                    if(condition == 1){
                        possibleMoves+=""+Math.floor(i/8+2)+Math.floor(i%8)+Math.floor(i/8)+Math.floor(i%8);
                    }
                }
                return possibleMoves;
            case "P_black":
                var possibleMoves = "";
                var PAWN_MOVES = BitOp(`(${"0b" + this.BLACK_PAWN} << 7)&${"0b" + WHITE_PIECES}&(~${"0b" + this.RANK_1})&(~${"0b" + this.FILE_H})`)//caputure right
                for (let i = ("0b" + PAWN_MOVES).numberOfTrailingZeros(); i < 64 - ("0b" + PAWN_MOVES).numberOfLeadingZeros(); i++) {
                    const condition = parseInt(BitOp(`(${"0b" + PAWN_MOVES} >> ${i}) & 0b1`),2);
                    if(condition == 1){
                        possibleMoves+=""+Math.floor(i/8-1)+Math.floor(i%8+1)+Math.floor(i/8)+Math.floor(i%8);
                    }
                }

                PAWN_MOVES = BitOp(`(${"0b"+ this.BLACK_PAWN} << 9)&${"0b"+ WHITE_PIECES}&~${"0b" + this.RANK_1}&~${"0b" + this.FILE_A}`); //capture left;
                for (let i = ("0b" + PAWN_MOVES).numberOfTrailingZeros(); i < 64 - ("0b" + PAWN_MOVES).numberOfLeadingZeros(); i++) {
                    const condition = parseInt(BitOp(`(${"0b" + PAWN_MOVES} >> ${i}) & 0b1`),2);
                    if(condition == 1){
                        possibleMoves+=""+Math.floor((i/8+1))+Math.floor((i%8+1))+Math.floor((i/8))+Math.floor((i%8));
                    }
                }


                PAWN_MOVES = BitOp(`(${"0b" + this.BLACK_PAWN} << 8)&${"0b"+ EMPTY}&~${"0b"+ this.RANK_1}`) // move 1 forward
                for (let i = ("0b" + PAWN_MOVES).numberOfTrailingZeros(); i < 64 - ("0b" + PAWN_MOVES).numberOfLeadingZeros(); i++) {
                    const condition = parseInt(BitOp(`(${"0b" + PAWN_MOVES} >> ${i}) & 0b1`),2); //serilize
                    if(condition == 1){
                        possibleMoves+=""+Math.floor((i/8-1))+Math.floor((i%8))+Math.floor((i/8))+Math.floor((i%8));
                    }
                }

                PAWN_MOVES = BitOp(`(${"0b" + this.BLACK_PAWN} << 16)&${"0b"+ EMPTY}&(${"0b"+ EMPTY} << 8)`) // move 1 forward
                for (let i = ("0b" + PAWN_MOVES).numberOfTrailingZeros(); i < 64 - ("0b" + PAWN_MOVES).numberOfLeadingZeros(); i++) {
                    const condition = parseInt(BitOp(`(${"0b" + PAWN_MOVES} >> ${i}) & 0b1`),2); //serilize
                    if(condition == 1){
                        possibleMoves+=""+Math.floor((i/8-2))+Math.floor((i%8))+Math.floor((i/8))+Math.floor((i%8));
                    }
                }
                return possibleMoves;
            case "R_white":
                const BITBOARD_S = createEmptyBitboard(s);
                const OCCUPIED = BitOp(`(${"0b" + this.WHITE_PAWN}|${"0b" + this.WHITE_KNIGHT}| ${"0b" + this.WHITE_BISHOP}|${"0b" + this.WHITE_ROOK}|${"0b" + this.WHITE_QUEEN}|${"0b" + this.WHITE_KING} | ${"0b" + this.BLACK_PAWN} | ${"0b" + this.BLACK_KNIGHT} | ${"0b" + this.BLACK_BISHOP}| ${"0b" + this.BLACK_ROOK}| ${"0b" + this.BLACK_QUEEN}| ${"0b" + this.BLACK_KING})`)

            }
    }
}


//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1;

function main(){
    const game = new Chess(600, "rnbqkbnr/ppppp1pp/8/5p2/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1", {w: "#EAD8C3" , b:"#A37C69"})
}


main();