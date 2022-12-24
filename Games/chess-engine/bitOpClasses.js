

 const createPointer = function () {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }



export default class ParsingTree {

    constructor() {
        this.TREE = {};
    }

    search(pointer){
        return this.TREE[pointer];
    }

    insert(node){
        this.TREE["root"] = node;
        return node;
    }
}


export class Binary {

    constructor(value){
        this.type = "binary",
        this.value = value
        this.grammar = "term"


        //super.insert(this.pointer,this.body,"term");
    }
    
}

export class RIGHT_SHIFT {
    constructor(pointer,value,secondPointer){
        this.type = "right_shift";
        this.value = value;
        this.left = pointer;
        this.right = secondPointer;
    }
}


export class LEFT_SHIFT {
    constructor(pointer,value,secondPointer){
        this.type = "left_shift";
        this.value = value;
        this.left = pointer;
        this.right = secondPointer;
    }
}


export class Integer {
    constructor(value){
            this.type=  "number",
            this.value = value
            this.grammar = "term"
}
}


export class invert {
    
    constructor(next,value){
        this.type=  "invert",
        this.value = value
        this.next = next;
        this.grammar = "term"

        //super.insert(this.pointer,this.body,"term");
    }
}


export class OR {
    
    constructor(pointer = null,value,secondPointer){
        this.type="or",
            this.value = value
            this.left = pointer;
            this.right= secondPointer;
            this.grammar = "expression"

        //super.insert(this.pointer,this.body,"expression");
    }
}


export class ADD {
    constructor(pointer, value,secondPointer){
        this.type = "add";
        this.value = value;
        this.left = pointer;
        this.right = secondPointer;
        this.grammar = "expression";
    }
}

export class SUBTRACT {
    constructor(pointer,value,secondPointer){
        this.type = "sub";
        this.value = value;
        this.left = pointer;
        this.right = secondPointer;
        this.grammar = "expression"
    }
}

export class AND {
    
    constructor(pointer = null,value, secondPointer){
        this.type="and",
            this.value = value
            this.left = pointer;
            this.right= secondPointer;
            this.grammar = "expression"
        //super.insert(this.pointer,this.body,"expression");
    }
}

const TREE = {
    "HDHDHD": {type: "int", value: 10},
    "ffjssfjsfjfs": {type: "sub", value: "-", left: "HDHDHD", right: null},


}