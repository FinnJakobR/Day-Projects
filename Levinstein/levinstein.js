const str1 = "Graphic Designer";
const str2 = "Graph Designer";


const lev = (a,b) =>{

    const n = getStrLength(a);
    const m = getStrLength(b);

    var substiutionCost;
    //init a matrix mit 0
    const matrix = new Array(getStrLength(a)).fill(0).map(() => new Array(getStrLength(b)).fill(0));


    for (let i = 1; i < n; i++) {
        matrix[i][0] = i;
        
    }

    for (let j = 1; j < m; j++) {
        matrix[0][j] = j;
    }


    for (let j = 1; j < m; j++) {

        for (let i = 1; i <n; i++) {

            if(a[i - 1] == b[j - 1]){
                substiutionCost = 0;
            }else{
                substiutionCost = 1;
            }

            matrix[i][j] = Math.min((matrix[i-1][j]+1), (matrix[i][j-1] + 1), (matrix[i-1][j-1] + substiutionCost))
        }
        
    }


    return matrix[n - 1][m - 1];
}

const getMin = (str1, arr) =>{
    var currentMin = {dst: lev(str1,arr[0]), job:arr[0]};
    for (let distance = 0; distance < arr.length; distance++) {
        if(str1 == arr[distance] || arr[distance].includes(str1)) return {dst: 0, job: arr[distance]};
        const current_distance = {dst: lev(str1,arr[distance]), job:arr[distance]}
        currentMin = Math.min(current_distance.dst,currentMin.dst) != currentMin.dst ? current_distance : currentMin;

        if(currentMin == 0) return currentMin;
    }

    return currentMin;
}


const getStrLength = (str) =>{
    return str.length;
}

console.log(lev(str1, str2));

