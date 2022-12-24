


export function validateColor(color){

    return color.w && color.b;
}



export function validFen(str){
    const checkValidParsing = str.match(/((^[1-7,R,B,P,N,Q,K,r,b,p,n,q,k]{1,8}|^8{1})[/]([1-7,R,B,P,N,Q,K,r,b,p,n,q,k]{1,8}|8{1})[/]([1-7,R,B,P,N,Q,K,r,b,p,n,q,k]{1,8}|8{1})[/]([1-7,R,B,P,N,Q,K,r,b,p,n,q,k]{1,8}|8{1})[/]([1-7,R,B,P,N,Q,K,r,b,p,n,q,k]{1,8}|8{1})[/]([1-7,R,B,P,N,Q,K,r,b,p,n,q,k]{1,8}|8{1})[/]([1-7,R,B,P,N,Q,K,r,b,p,n,q,k]{1,8}|8{1})[/]([1-7,R,B,P,N,Q,K,r,b,p,n,q,k]{1,8}|8{1}))\s(w|b)\s([K,Q,k,q]{1,4}|-)\s(([a-h][1-8])|-)\s([1-5][0-9]|[0-9])\s\d*$/g) != null

    const checkValidStrings = str.slice(0,str.indexOf(" ") + 1).split("/")
    
    var isValidStrings = true
    
    for (let index = 0; index < checkValidStrings.length; index++) {
        const field = checkValidStrings[index]
        const Numbers = field.match(/[0-9]{1}/g)
        const letters = field.match(/[a-zA-Z]/g)
        var lettersLength = 0
        var NumberLength = 0
    
        if(Numbers){
            for (let number = 0; number < Numbers.length; number++) {
                NumberLength+=Number(Numbers[number])
            }
        }
    
        if(letters){
            lettersLength = letters.length
        }
    
        if((lettersLength + NumberLength) > 8){
            isValidStrings = false
            break
        }
    }

    return checkValidParsing && isValidStrings;
}

