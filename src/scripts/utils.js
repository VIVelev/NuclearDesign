//////////////////////////
//   Utility functions  //
//////////////////////////

// Random choice from array
function choose(choices) {
    var index = floor(random() * choices.length);
    return choices[index];
}

// Find the nearest tile
function currentTile(x, y) {
    return {
        x: floor(x / RENDER.cellSize),
        y: floor(y / RENDER.cellSize)
    };
}

// Returns 1 or -1
function plusOrMinus() {
    return round(random()) * 2 - 1;
}

// Returns random neutron velocity
function randVelocity() {
    return random(CONFIG.nSpeedMin, CONFIG.nSpeedMax) * plusOrMinus();
}

// Initialize Linear Algebra utils
linAlg = linearAlgebra();

function det(M) {
    if (M.length==2) { return (M[0][0]*M[1][1])-(M[0][1]*M[1][0]); }
    var answer = 0;
    for (var i=0; i< M.length; i++) { answer += Math.pow(-1,i)*M[0][i]*det(deleteRowAndColumn(M,i)); }
    return answer;
}

function deleteRowAndColumn(M,index) {
    var temp = [];
    for (var i=0; i<M.length; i++) { temp.push(M[i].slice(0)); } 
    temp.splice(0,1); 
    for (var i=0; i<temp.length; i++) { temp[i].splice(index,1); } 
    return temp;
}

// Symmetric matrix metric from -1 (anti-symmetric) to 1 (symmetric)
function symmetricMetric(array) {
    var A, A_sym, A_anti, x, y;
    
    A = new linAlg.Matrix(array);
    A_sym = (A.plus(A.trans())).mulEach(1/2);
    A_anti = (A.minus(A.trans())).mulEach(1/2);

    x = det(A_sym.toArray());
    y = det(A_anti.toArray());

    return (x - y) / (x + y);
}
