//////////////////////////
//  Global variables    //
//////////////////////////

var visualize = true;

// Configuration
const CONFIG = {
    controlRodChance: 50,   // chance for control rod to absorb a neutron
    controlRodCool: 1,      // control rod cooling per tick
    controlRodHeat: 200,    // heat generated per collision

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

    renderGlow: visualize,       // render glow effect
    wallCool: 1000000       // wall cooling per tick
};

const RENDER = {
    cellSize: 20,       // height and width of each cell
    nSize: 10,          // diameter of each neutron
    gLayers: 5,         // number of layers for glow effect
    gSize: 60,          // diameter of glow effect
    canvasWidth: 300,   // width of canvas
    canvasHeight: 300   // height of canvas
};

const TILE_MAP = {
    'C': ControlRod,
    'F': Fuel,
    'M': Moderator,
    'H': HorizontalReflector,
    'V': VerticalReflector,
    'W': Wall

};

// Variables
var canvas;

var nCols;
var nRows;

var grid;
var neutrons;

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
    nRows = floor(RENDER.canvasHeight / RENDER.cellSize);
    nCols = floor(RENDER.canvasWidth / RENDER.cellSize);

    grid = new Array(nCols);
    for (var i = 0; i < nCols; i++) {
        grid[i] = new Array(nRows);
    }
}

function initNeutrons() {
    neutrons = [];
}

// Fill board with moderator
function fillModerator() {
    for (var x = 0; x < nCols; x++) {
        for (var y = 0; y < nRows; y++) {
            grid[x][y] = new Moderator(x, y);
        }
    }
}

// Fill edges with walls
function fillEdges() {
    for (var x = 0; x < nCols; x++) {
        grid[x][0] = new Wall(x, 0);
        grid[x][nRows-1] = new Wall(x, nRows-1);
    }

    for (var y = 1; y < nRows-1; y++) {
        grid[0][y] = new Wall(0, y);
        grid[nCols-1][y] = new Wall(nCols-1, y);
    }
}

// Create reactor from genome's data
function createReactor(genome) {
    for (var x = 0; x < nCols; x++) {
        for (var y = 0; y < nRows; y++) {
            grid[x][y] = new TILE_MAP[genome.grid[x][y]](x, y);
        }
    }

    fillEdges();
}


//////////////////////////
//   Utility functions  //
//////////////////////////


// Random choice from array
function choose(choices) {
    var index = floor(random() * choices.length);
    return choices[index];
}

// Returns the reactor's heat
function getTotalHeat() {
    totalHeat = 0;
    for (var x = 0; x < nCols; x++) {
        for (var y = 0; y < nRows; y++) {
            totalHeat += grid[x][y].heat;
        }
    }

    return totalHeat;
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
function updateStats() {
    ncount = document.getElementById("ncount");
    ncount.innerHTML = "Neutron count: " + neutrons.length;

    meanHeat = document.getElementById("meanHeat");
    meanHeat.innerHTML = "Mean heat: " + getTotalHeat() / nRows*nCols;
}


//////////////////////////////////
//  p5.js built-in functions    //
//////////////////////////////////


function setup() {
    params = document.getElementById("params");
    params.innerHTML = "";
    
    for (var param in CONFIG) {
      newItem = document.createElement("li");
      newItem.innerHTML = param + ": " + CONFIG[param];
      newItem.setAttribute("class", "param");
      params.appendChild(newItem);
    }

    if (visualize) {
        initCanvas();
    }
    initGrid();
    initNeutrons();

    genome = new Genome(nRows, nCols);
    console.log(genome.grid)
    createReactor(genome);
}

function draw() {
    if (visualize) {
        background(0, 0, 0);
    }

    for (var x = 0; x < nCols; x++) {
        for (var y = 0; y < nRows; y++) {
            grid[x][y].update();

            if (visualize) {
                grid[x][y].display();
            }
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

        if (visualize) {
            neutrons[i].display();
        }
    }

    updateStats();
}
