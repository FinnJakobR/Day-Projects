export function parseNotationStr(str, strAll){

    const tree = {
        notations : [],
        player: "",
        nextRoundNum: 0,
        enPassateField: "-",
        rule50: 0,
        rochade: []
    }

    var lines = str.match(/([1-7,R,B,P,N,Q,K,r,b,p,n,q,k]{1,8}|8{1})/g)
    var currentPlayer = strAll.match(/\b[w,b]\b/g)
    var roundNum = strAll.match(/\b\d*$\b/g)
    var enPassateField = strAll.match(/([-]|([a,b,c,d,e,f,g,h][1-8]))/g)
    var Rule50 = strAll.match(/\b\d*\b/g)
    var rochardeRules = strAll.match(/([-]|([k,q,K,Q]{1,4}\b))/g)


    tree.player = currentPlayer[0] == "w" ? "white" : "black";
    tree.nextRoundNum = parseInt(roundNum[0]);
    tree.enPassateField = enPassateField[enPassateField.length -1]
    tree.rule50 = parseInt(Rule50[Rule50.length - 2])

    tree.rochade = rochardeRules[0] === "-" ? [] : rochardeRules[0].split("")



    const line8 = parseLine(lines[0], 8)
    const line7 = parseLine(lines[1], 7)
    const line6 = parseLine(lines[2], 6)
    const line5 = parseLine(lines[3], 5)
    const line4 = parseLine(lines[4], 4)
    const line3 = parseLine(lines[5], 3)
    const line2 = parseLine(lines[6], 2)
    const line1 = parseLine(lines[7], 1)

    tree.notations.push(line8,line7,line6,line5,line4,line3,line2,line1)

    return tree;

    }


    function parseLine(line, i){
        const tree = {}
        const types = line.split("");
        var currentFieldIndex = 1;

        for (let index = 0; index < types.length; index++) {
            const isNum = isNumeric(types[index]);
            
            if(isNum){
                for (let index2 = 0; index2 < parseInt(types[index]); index2++) {
                    const Notation = generateNotation(i, currentFieldIndex + index2)
                    tree[Notation] = {pos: []}
                }
                currentFieldIndex += parseInt(types[index])
            }
            if(!isNum){
                const Notation = generateNotation(i, currentFieldIndex)
                currentFieldIndex += 1;
                tree[Notation] = {
                    player : types[index] === types[index].toUpperCase() ? "white" : "black",
                    pos : [],
                    type : types[index].toUpperCase()
                }
            }
        }

        return tree;
    }

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

const REIHE = {
    1: "a",
    2: "b",
    3: "c",
    4: "d",
    5: "e",
    6: "f",
    7: "g",
    8: "h",
}


function generateNotation(line, reihe){
    const Notation = (REIHE[reihe])+(line)

    if(Notation == NaN) console.log(line + " " + reihe)
    return Notation
}


export function parseInto2DBoard(gameInstance){
    const notations = gameInstance.notations;
    const Board2D = [];

    for (var line in notations){
        const BoardLine = [];

        for (var field in notations[line]){
            const player = notations[line][field].player;
            const piece = notations[line][field].type;

            const name = `${player}_${piece}`;

            if(player) {
                BoardLine.push(name);
            }

            if(!player){
                BoardLine.push(" ");
            }
        }
        Board2D.push(BoardLine);
    }

    return Board2D;
}