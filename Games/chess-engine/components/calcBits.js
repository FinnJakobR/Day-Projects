
const ASCII_A = 97;


export function getSignedInteger(bits) {
    let negative = (bits[0] === '1');
    if (negative) {
        let inverse = '';
        for (let i = 0; i < bits.length; i++) {
            inverse += (bits[i] === '0' ? '1' : '0');
        }
        return (parseInt(inverse, 2) + 1) * -1;
    } else {
        return parseInt(bits, 2);
    }
}


function validateBinaryString(str){
    const match = str.match(/^([0|1]{64})$/g);

    return match != null;
}

export function GenerateFileBoards(fileLetter){

    const index = LetterToFileIndex(fileLetter);

    let Binary = "0".repeat(64);
    const helper = Binary.split("");

    for (let i = 0; i < 8; i++) {
       helper[8 * i + index] = "1";
    }

    Binary = helper.join("")
    

    return Binary;
}


function LetterToFileIndex(Letter){

    const ascii_letter = Letter.charCodeAt(0);

    if((ascii_letter - ASCII_A < 0 ) || (ascii_letter - ASCII_A > 7)) throw new Error("Invalid Letter!")

    return ascii_letter - ASCII_A;
}


export function GenerateRankBoard(rank){
    let Binary = "0".repeat(64);
    const helper = Binary.split("");

    for (let i = 0; i < 8; i++) {
        helper[((rank * 8) - 1) - i] ="1"; 
    }

    Binary = helper.join("")
    
    return Binary;
}


export function createEmptyBitboard(s){
    var binary = "0".repeat(64);

    binary = binary.split("");

    binary[63 - s] = "1";

    return binary.join("");
}

export function ShowAsBitboard(Binary){

    var debug = "";
    for (let index = 63; index >= 0; index--) {
       
        if((index) % 8 == 0){
            debug+=Binary[index]+ "\n";
        }else{
            debug+=Binary[index];
        }
        
    }

    console.log(debug);
}