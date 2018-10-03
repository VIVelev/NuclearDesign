//////////////////////////
//  Global variables    //
//////////////////////////


// Configuration
const CONFIG = {
    absorberChance: 25,     // chance for absorber to absorb a neutron
    absorberCool: 1,        // absorber cooling per tick
    absorberHeat: 200,      // heat generated per collision
    controlRodChance: 50,   // chance for control rod to absorb a neutron
    controlRodCool: 1,      // control rod cooling per tick
    controlRodHeat: 200,    // heat generated per collision
    coolantCool: 400,       // coolant cell cooling per tick
    fuelChance: 7,          // chance for fuel rod to absorb a neutron
    fuelCool: 1,            // fuel rod cooling per tick
    fuelHeat: 400,          // heat generated per reaction
    fuelSpontChance: 5,     // chance for spontaneous neutron emission
    fuelSpontHeat: 2,       // heat generated per spontaneous neutron emission
    heatMax: 10000,         // maximum allowed heat
    heatTransfer: 0.05,     // percent of heat transferred to adjacent tiles
    moderatorCool: 2,       // moderator cooling per tick
    nCardDir: false,        // neutrons only travel in cardinal directions
    nSpawnMin: 1,           // min number of neutrons per reaction
    nSpawnMax: 3,           // max number of neutrons per reaction
    nSpeedMin: 1,           // min neutron speed
    nSpeedMax: 10,          // max neutron speed
    reflectorCool: 1,       // reflector cooling per tick
    reflectorHeat: 100,     // heat generated per reflection
    renderGlow: true,       // render glow effect
    wallCool: 1000000       // wall cooling per tick
};

const RENDER = {
    cellSize: 20,       // height and width of each cell
    nSize: 10,          // diameter of each neutron
    gLayers: 5,         // number of layers for glow effect
    gSize: 60,          // diameter of glow effect
    canvasWidth: 400,   // width of canvas
    canvasHeight: 400   // height of canvas
};


// Misc.
var canvas;

var cols;
var rows;

var grid;
var neutrons;

var selected;

var controlRods = true;
var heatOverlay = false;


//////////////////////////////
//  Resetting simulation    //
//////////////////////////////


function initCanvas() {
    canvas = createCanvas(RENDER.canvasWidth, RENDER.canvasHeight);
    canvas.parent("sketch-container");
}

function initGrid() {
    cols = floor(width / RENDER.cellSize);
    rows = floor(height / RENDER.cellSize);

    grid = new Array(cols);
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }
}

function initNeutrons() {
    neutrons = [];
}

// Fill board with moderator
function fillModerator() {
    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            grid[x][y] = new Moderator(x, y);
        }
    }

    fillEdges();
}

// Fill edges with walls
function fillEdges() {
    for (var x = 0; x < cols; x++) {
        grid[x][0] = new Wall(x, 0);
        grid[x][rows-1] = new Wall(x, rows-1);
    }

    for (var y = 1; y < rows-1; y++) {
        grid[0][y] = new Wall(0, y);
        grid[cols-1][y] = new Wall(cols-1, y);
    }
}

// Create example reactor
function defaultReactor() {
    fillModerator();

    grid[1][1] = new Wall(1, 1);
    grid[1][12] = new Wall(1, 12);
    grid[12][1] = new Wall(12, 1);
    grid[12][12] = new Wall(12, 12);

    for (var x = 2; x < 12; x++) {
        grid[x][1] = new VerticalReflector(x, 1);
        grid[x][12] = new VerticalReflector(x, 12);
    }

    for (var y = 2; y < 12; y++) {
        grid[1][y] = new HorizontalReflector(1, y);
        grid[12][y] = new HorizontalReflector(12, y);
    }

    for (var x = 3; x < 11; x++) {
        for (var y = 3; y < 11; y++) {
            grid[x][y] = new Fuel(x, y);
        }
    }

    for (var x = 2; x < 12; x++) {
        grid[x][2] = new ControlRod(x, 2);
        grid[x][5] = new ControlRod(x, 5);
        grid[x][8] = new ControlRod(x, 8);
        grid[x][11] = new ControlRod(x, 11);
    }

    for (var y = 3; y < 11; y++) {
        grid[2][y] = new ControlRod(2, y);
        grid[5][y] = new ControlRod(5, y);
        grid[8][y] = new ControlRod(8, y);
        grid[11][y] = new ControlRod(11, y);
    }
}

// Ensure that the min value is less than or equal to the max value
function checkMinMax(min, max) {
    if (min > max) {
        return max;
    } else {
        return min;
    }
}

// Ensure value falls within the correct bounds
function constrain(value, min=0, max=1000000) {
    value = int(value);
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
}

// Find the nearest tile
function currentTile(x, y) {
    return {
        x: floor(x / RENDER.cellSize),
        y: floor(y / RENDER.cellSize)
    };
}

// Create a glowing effect
function glow(x, y, color) {
    if ((CONFIG.renderGlow) && !(heatOverlay)) {
        for (var i = 0; i < RENDER.gLayers; i++) {
            fill(color.r, color.g, color.b, round(255/RENDER.gLayers));
            noStroke();
            ellipse(x, y, (RENDER.gSize/RENDER.gLayers)*(i+1),
                    (RENDER.gSize/RENDER.gLayers)*(i+1));
        }
    }
}

// Returns 1 or -1
function plusOrMinus() {
    return round(random()) * 2 - 1;
}

// Returns random neutron velocity
function randVelocity() {
    return random(CONFIG.nSpeedMin, CONFIG.nSpeedMax) * plusOrMinus();
}

// Deletes a neutron
function removeNeutron(n) {
    var index = neutrons.indexOf(n);

    if (index > -1) {
        neutrons.splice(index, 1);
    }
}

// Updates the monitor with information
function updateMonitor() {
    ncount = document.getElementById("ncount");
    ncount.innerHTML = "Neutron count: " + neutrons.length;
}

//////////////////////////////////
//  p5.js built-in functions    //
//////////////////////////////////


function setup() {
    initCanvas();
    initGrid();
    initNeutrons();

    defaultReactor();
}

function draw() {
    background(210, 215, 211);

    for (var x = 0; x < cols; x++) {
        for (var y = 0; y < rows; y++) {
            grid[x][y].update();
            grid[x][y].display();
        }
    }

    for (var i = 0; i < neutrons.length; i++) {
        neutrons[i].update();
        if (neutrons[i].checkEdges()) {
            removeNeutron(neutrons[i]);
            continue;
        }

        var c = currentTile(neutrons[i].pos.x, neutrons[i].pos.y);
        if (grid[c.x][c.y].onReact(neutrons[i])) {
            continue;
        }

        neutrons[i].display();
    }

    updateMonitor();
}

// Fit grid to screen
function windowResized() {
    resizeCanvas(RENDER.canvasWidth, RENDER.canvasHeight);

    initGrid();
    initNeutrons();

    defaultReactor();
}
