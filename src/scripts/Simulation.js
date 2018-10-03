// Configuration
const CONFIG = {
    controlRodChance: 0.5,  // chance for control rod to absorb a neutron
    controlRodCool: 1,      // control rod cooling per tick
    controlRodHeat: 200,    // heat generated per collision

    fuelChance: 0.07,       // chance for fuel rod to absorb a neutron
    fuelCool: 1,            // fuel rod cooling per tick
    fuelHeat: 400,          // heat generated per reaction
    fuelSpontChance: 0.05,     // chance for spontaneous neutron emission
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

    renderGlow: false,       // render glow effect
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

class Simulation {
    constructor(visualize=true) {
        this.visualize = visualize
        
        if (this.visualize) {
            this.canvas = createCanvas(RENDER.canvasWidth, RENDER.canvasHeight);
            this.canvas.parent("reactor-container");
        }

        this.nRows = floor(RENDER.canvasHeight / RENDER.cellSize);
        this.nCols = floor(RENDER.canvasWidth / RENDER.cellSize);
    
        this.grid = new Array(this.nCols);
        for (var i = 0; i < this.nCols; i++) {
            this.grid[i] = new Array(this.nRows);
        }

        this.neutrons = [];

        this.controlRods = true;
        this.heatOverlay = false;
    }

    // Fill board with moderator
    fillModerator() {
        for (var x = 0; x < this.nCols; x++) {
            for (var y = 0; y < this.nRows; y++) {
                this.grid[x][y] = new Moderator(x, y, this);
            }
        }
    }

    // Fill edges with walls
    fillEdges() {
        for (var x = 0; x < this.nCols; x++) {
            this.grid[x][0] = new Wall(x, 0, this);
            this.grid[x][this.nRows-1] = new Wall(x, this.nRows-1, this);
        }

        for (var y = 1; y < this.nRows-1; y++) {
            this.grid[0][y] = new Wall(0, y, this);
            this.grid[this.nCols-1][y] = new Wall(this.nCols-1, y, this);
        }
    }

    // Create reactor from genome's data
    createReactorFromGenome(genome) {
        for (var x = 0; x < this.nCols; x++) {
            for (var y = 0; y < this.nRows; y++) {
                this.grid[x][y] = new TILE_MAP[genome.grid[x][y]](x, y, this);
            }
        }

        this.fillEdges();
    }

    // Returns the reactor's heat
    getTotalHeat() {
        var totalHeat = 0;
        for (var x = 0; x < this.nCols; x++) {
            for (var y = 0; y < this.nRows; y++) {
                totalHeat += this.grid[x][y].heat;
            }
        }

        return totalHeat;
    }

    getMeanHeat() {
        return this.getTotalHeat() / this.nCols * this.nRows;
    }

    // Create a glowing effect
    glow(x, y, color) {
        if ((CONFIG.renderGlow) && !(this.heatOverlay)) {
            for (var i = 0; i < RENDER.gLayers; i++) {
                fill(color.r, color.g, color.b, round(255/RENDER.gLayers));
                noStroke();
                ellipse(x, y, (RENDER.gSize/RENDER.gLayers)*(i+1),
                        (RENDER.gSize/RENDER.gLayers)*(i+1));
            }
        }
    }

    // Deletes a neutron
    removeNeutron(n) {
        var index = this.neutrons.indexOf(n);

        if (index > -1) {
            this.neutrons.splice(index, 1);
        }
    }

    // Updates the monitor with information
    updateStats() {
        var ncount = document.getElementById("ncount");
        ncount.innerHTML = "Neutron count: " + this.neutrons.length;

        var meanHeat = document.getElementById("meanHeat");
        meanHeat.innerHTML = "Mean heat: " + this.getMeanHeat();
    }

    update() {
        if (this.visualize) {
            background(0, 0, 0);
        }
    
        for (var x = 0; x < this.nCols; x++) {
            for (var y = 0; y < this.nRows; y++) {
                this.grid[x][y].update();
    
                if (this.visualize) {
                    this.grid[x][y].display();
                }
            }
        }
    
        for (var i = 0; i < this.neutrons.length; i++) {
            this.neutrons[i].update();
            if (this.neutrons[i].checkEdges()) {
                this.removeNeutron(neutrons[i]);
                continue;
            }
    
            var c = currentTile(this.neutrons[i].pos.x, this.neutrons[i].pos.y);
            if (this.grid[c.x][c.y].onReact(this.neutrons[i])) {
                continue;
            }
    
            if (this.visualize) {
                this.neutrons[i].display();
            }
        }
    
        this.updateStats();
    }

    evaluateGenome(genome, TICKS=100) {
        this.createReactorFromGenome(genome);

        var t = 1;
        var fitness = 0;

        while (t < TICKS) {
            this.update();

            fitness += this.getMeanHeat();
            t++;
        }

        return fitness / TICKS;
    }
}
