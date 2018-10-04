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

// Forbenius Norm of a matrix
function forbenius_norm(M) {
    var norm = 0;
    for (var i = 0; i < M.length; i++) {
        for (var j = 0; j < M[i].length; j++) {
            norm += pow(M[i][j], 2);
        }
    }

    return sqrt(norm);
}

// Symmetric matrix metric from -1 (anti-symmetric) to 1 (symmetric)
function symmetricMetric(array) {
    var A, A_sym, A_anti, x, y;
    
    A = new linAlg.Matrix(array);
    A_sym = (A.plus(A.trans())).mulEach(1/2);
    A_anti = (A.minus(A.trans())).mulEach(1/2);

    x = forbenius_norm(A_sym.toArray());
    y = forbenius_norm(A_anti.toArray());

    return (x - y) / (x + y);
}
