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
