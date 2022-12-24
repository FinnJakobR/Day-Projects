
//Term is a DataType like Integer -> Strings -> Floats and Identifiers or a Expression in Parantesies
//Expresison is a operator like + - / * 
// build a tree DataStructure 


import ParsingTree, { ADD, AND, Binary, Integer, invert, LEFT_SHIFT, OR, RIGHT_SHIFT, SUBTRACT } from "../bitOpClasses.js";


export default function BitOp(str,debug){

    if(debug) console.log(str);

    const tokens = lex(str.split(""));

    if(debug) console.log(tokens);

    const tree = parse(tokens);

    if(debug) console.log(tree);

    const result = evalutation(tree.TREE.root);

    if(debug) console.log(result);

    return result;
}

const BitInvert = (a)=>{

    var binary = a.split('').map(x => {
        return (x == 1) ? 0 : 1;
      }).join('');
      return binary;

}

 const BitOr = (a,b)=>{
    
    if((typeof a === "number") && (typeof b == "number")) return (a | b);

    if(a.length != b.length) {
        const l = a.length - b.length;
        const b2 = b;
        b = "0".repeat(l) + b2;
    };

    var BitString = "";

    for (let bit = 0; bit < a.length; bit++) {
        if(a[bit] == 1 || b[bit] == 1){
            BitString+="1";
        }else{
            BitString+="0";
        }
    }
    return BitString;
}

const BitAnd = (a,b)=>{
    if(a.length != b.length) {
        const l = a.length - b.length;
        const b2 = b;
        b = "0".repeat(l) + b2;
    };

    if((typeof a === "number") && (typeof b == "number")) return (a & b);

    var BitString = "";

    for (let bit = 0; bit < a.length; bit++) {
        if(a[bit] == 1 && b[bit] == 1){
            BitString+="1";
        }else{
            BitString+="0";
        }
    }
    return BitString;
}





const lex = function(input){
    var tokens = [];

    var isNumber = function(c) { return /[0-9]/.test(c)};
    
    var isBinary = function(c) {
        return c == "0b";
    };

    var isWhiteSpace = function(c) { return /\s/.test(c);};
    var isOperator = function(c) {return /[\+\|\-\&]/.test(c);}
    var isInvert = function(c) {return /[~]/.test(c);}

    var islparen = function(c) {return /[(]/.test(c)};
    var isrparen = function(c) {return /[)]/.test(c)};

    var isrightShift = function(c){return /[>]/.test(c)};
    var isleftShift = function(c){return /[<]/.test(c)};
    var isReverse = function(c) {return /[´]/.test(c)};

    var isIndetifier = function(c) {return typeof c === "string" && !isOperator(c) && !isBinary(c) && !isNumber(c) && !isInvert(c) && !islparen(c) && !isrparen(c) && !isWhiteSpace(c) && !isleftShift(c) && !isrightShift(c)};


    let index = 0

    while (index < input.length) {
        var c = input[index];


        if(islparen(c)){
            tokens.push({
                type: "lparen",
                value: c
            })
        }

        if(isrparen(c)){
            tokens.push({
                type: "rparen",
                value:c
            })
        }


       if(isNumber(c)){
        const prefix = c + input[index + 1];
        if(isBinary(prefix)){
            var binaryIndex = index + 2;
            var binaryString = "";

            while (input[binaryIndex] == "0" || input[binaryIndex] == "1"){
                binaryString+=input[binaryIndex];
                binaryIndex++;
            }

            tokens.push({
                type: "binary",
                value: binaryString
            });

            index = binaryIndex - 1;
            
        }else{
                var num = c;
                var digitIndex = index + 1;
                while (isNumber(input[digitIndex])){
            
                    num+=input[digitIndex];
            
                    digitIndex++;
                }

                tokens.push({
                    type: "number",
                    value: num
                });
                index = digitIndex  -1;
            
        }
       }

        if(isInvert(c)){
            tokens.push({
                type: "invert",
                value: c
            })
        }

        if(isleftShift(c) && isleftShift(input[index + 1])){
            tokens.push({
                type: "operator",
                value : "<<"
            });
            index++;
        }

        if(isrightShift(c) && isrightShift(input[index + 1])){
            tokens.push({
                type: "operator",
                value : ">>"
            });
            index++;
        }



        if(isOperator(c)){
            tokens.push({
                type: "operator",
                value: c
            })
        }

        if(isIndetifier(c)){
            var idn = c;
            var IndentifierIndex = index + 1;

            while (isIndetifier(input[IndentifierIndex])) {
                idn+=input[IndentifierIndex];
                IndentifierIndex++;
            }

            tokens.push({
                type:"identifier",
                value: idn
            });

            index = IndentifierIndex  -1;
        }

        if(!isWhiteSpace(c) && !isIndetifier(c) && !isBinary(c) && !isOperator(c) && !isNumber(c) && !isInvert(c) && !islparen(c) && !isrparen(c) && !isleftShift(c) && !isrightShift(c)){
            throw "Unrecognized token.";
        }

        index++;
    }

    return tokens;
}



const parse = function(tokens){
    var i = -1;
    var nextToken = null;

    var tree = new ParsingTree();

    const scanToken = ()=>{
        i++;
        nextToken = tokens[i];
    }





//term ist wichtig 
    const term = ()=>{
     var a = factor();
     scanToken()
     return a;
    }

    //a ist das letzte und 

    const expression = () => {
        var a = term();
        while (true){
            if(nextToken == null) return a;
            if(nextToken.value == "|"){
                scanToken();
                var b = term();
                const obj = new OR(a,"|",b);
                a = obj;

            }else if (nextToken.value == "&"){
                scanToken();
                var b = term();
                const obj = new AND(a,"&",b);
                a = obj;

            }else if(nextToken.value == "+"){
                scanToken();
                var b = term();
                const obj = new ADD(a,"+",b);
                a = obj;

            }else if(nextToken.value == "-"){
                scanToken();
                var b = term();
                const obj = new SUBTRACT(a,"-",b);
                a = obj;

            }else if(nextToken.value == "<<"){
                scanToken();
                var b = term();
                const obj = new LEFT_SHIFT(a,"<<",b);
                a = obj;
            }else if(nextToken.value == ">>"){
                scanToken();
                var b = term();
                const obj = new RIGHT_SHIFT(a,">>",b);
                a = obj;
            }else{
                return a;
            }
        }
    }


    const factor = ()=>{
        if(nextToken.type == "binary"){
            const obj = new Binary(nextToken.value);
            return obj;
        }
        else if(nextToken.type == "number"){
            const obj = new Integer(nextToken.value);
            return obj;
        }

        else if(nextToken.type == "lparen"){
            scanToken()
           var a = expression();
           if(a == null) return null;
           if(nextToken.type == "rparen"){
            return a;
           }else{
            return null;
           }
        }
        else if(nextToken.type == "invert"){
            scanToken();
            const obj = new invert(factor(), "~")
            return obj;
        }

        else {
            return null;
        }
    }

    scanToken();

    const root = expression();

    tree.insert(root);
    
    return tree;
}



const evalutation = (node) =>{
    const type = node.type;
    switch(type) {
        case "and":
            var a = evalutation(node.left);
            var b = evalutation(node.right);
            return BitAnd(a,b);
        case "add":
            var a = evalutation(node.left);
            var b = evalutation(node.right);
            return AddBinary(a,b);
        case "or":
            var a = evalutation(node.left);
            var b = evalutation(node.right);
            return BitOr(a,b);
        case "invert":
            var a = evalutation(node.next);
            return BitInvert(a)
        case "left_shift":
            var a = evalutation(node.left);
            var b = evalutation(node.right);
            return left_shift(a,b);
        
        case "right_shift":
            var a = evalutation(node.left);
            var b = evalutation(node.right);
            return right_shift(a,b);

        case "number":
            return parseInt(node.value);
        case "binary":
            return node.value;
    }
}


const right_shift = (binary,b)=>{

    if(typeof binary == "number" && typeof b == "number") return (binary >> b);


    var binaryStr = "0".repeat(binary.length);
    binaryStr = binaryStr.split("");
    for (let bit = 0; bit < binary.length; bit++) {
        const newIndex = bit + b;

        if(newIndex < binary.length ){
            binaryStr[newIndex] = binary[bit];
        }
        
    }

    return binaryStr.join("");
}


 const left_shift = (binary,b)=>{

    if(typeof binary == "number" && typeof b == "number") return (binary << b);

    var binaryStr = "0".repeat(binary.length);
    binaryStr = binaryStr.split("");
    for (let bit = 0; bit < binary.length; bit++) {
        const newIndex = bit - b;

        if(newIndex >= 0 ){
            binaryStr[newIndex] = binary[bit];
        }
        
    }
    return binaryStr.join("");
}


String.prototype.numberOfTrailingZeros = function () {
    var value = this;

    if(!value.includes("0b")) throw Error("can only use with Binary Numbers!");

    value = value.substring(2);
    var trail = 0;

    const size = value.length * 8;

    for (let i = 0; i < size; i++) {
        const x = parseInt(BitOp(`(${"0b" + value} >> ${i}) & 0b1`),2);
        if(x == 1){
            break;
        }
        trail++;
    }

    return trail;
}


String.prototype.numberOfLeadingZeros = function (){
    var value = this;

    if(!value.includes("0b")) throw Error("can only use with Binary Numbers!");


    value = value.substring(2);

    var leading = 0;

    for (let i = 0; i < value.length; i++) {
        if(value[i] == 1) break;
        leading++;
    }

    return leading;
}






export function AddBinary(a,b){
    let sum = '';
    let carry = '';

    if((typeof a == "number") && (typeof b == "number")) return (a + b);
  
    for(var i = a.length-1;i>=0; i--){
      if(i == a.length-1){
        //half add the first pair
        const halfAdd1 = halfAdder(a[i],b[i]);
        sum = halfAdd1[0]+sum;
        carry = halfAdd1[1];
      }else{
        //full add the rest
        const fullAdd = fullAdder(a[i],b[i],carry);
        sum = fullAdd[0]+sum;
        carry = fullAdd[1];
      }
    }
  
    return carry ? carry + sum : sum;
}


function halfAdder(a,b){
    const sum = xor(a,b);
    const carry = and(a,b);
    return [sum,carry];
}

function fullAdder(a,b,carry){
    const halfAdd = halfAdder(a,b);
    const sum = xor(carry, halfAdd[0]);
    carry = and(carry, halfAdd[0]);
    carry = or(carry, halfAdd[1]);
    return [sum, carry];
}

function xor(a, b){return (a === b ? 0 : 1);}
function and(a, b){return a == 1 && b == 1 ? 1 : 0;}
function or(a, b){return (a || b);}



function get64binary(int) {
    if (int >= 0)
      return int
        .toString(2)
        .padStart(64, "0");
    else
      return (-int - 1)
        .toString(2)
        .replace(/[01]/g, d => +!+d) // hehe: inverts each char
        .padStart(64, "1");
  }