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

    toggleControlRods() {
        this.controlRods = !this.controlRods;
    }

    toggleHeatOverlay() {
        this.heatOverlay = !this.heatOverlay;
    }

    // Fill board with moderator
    fillModerator(grid) {
        for (var x = 0; x < this.nCols; x++) {
            for (var y = 0; y < this.nRows; y++) {
                grid[x][y] = new Moderator(x, y, this);
            }
        }
    }

    // Fill edges with walls
    fillEdges(grid) {
        for (var x = 0; x < this.nCols; x++) {
            grid[x][0] = new Wall(x, 0, this);
            grid[x][this.nRows-1] = new Wall(x, this.nRows-1, this);
        }

        for (var y = 1; y < this.nRows-1; y++) {
            grid[0][y] = new Wall(0, y, this);
            grid[this.nCols-1][y] = new Wall(this.nCols-1, y, this);
        }
    }

    // Create reactor from genome's data
    createReactorFromGenome(genome) {
        for (var x = 0; x < this.nCols; x++) {
            for (var y = 0; y < this.nRows; y++) {
                this.grid[x][y] = new TILE_MAP[genome.grid[x][y]](x, y, this);
            }
        }

        this.fillEdges(this.grid);
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
        if (this.visualize) {
            var ncount = document.getElementById("ncount");
            ncount.innerHTML = "Neutron count: " + this.neutrons.length;

            var meanHeat = document.getElementById("meanHeat");
            meanHeat.innerHTML = "Mean heat: " + this.getMeanHeat();
        }
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
                this.removeNeutron(this.neutrons[i]);
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

    getTilesCount() {
        var x, y, tilesCount;

        tilesCount = {
            controlRods: 0,
            fuels: 0,
            moderators: 0,
            walls: 0,
            horizontalReflectors: 0,
            verticalReflectors: 0
        };

        for (x = 0; x < this.nCols; x++) {
            for (y = 0; y < this.nRows; y++) {
                switch (this.grid[x][y].__proto__.constructor) {
                    case ControlRod:
                        tilesCount.controlRods++;
                        break;

                    case Fuel:
                        tilesCount.fuels++;
                        break;

                    case Moderator:
                        tilesCount.moderators++;
                        break;

                    case Wall:
                        tilesCount.walls++;
                        break;

                    case HorizontalReflector:
                        tilesCount.horizontalReflectors++;
                        break;

                    case VerticalReflector:
                        tilesCount.verticalReflectors++;
                        break;

                    default:
                        break;
                }
            }
        }
        
        return tilesCount;
    }

    getMeanNeutronPos() {
        var meanPos, i;

        meanPos = new p5.Vector(0, 0);
        for (i = 0; i < this.neutrons.length; i++) {
            meanPos.add(this.neutrons[i].pos);
        }

        return meanPos.div(this.neutrons.length+pow(10, -9));
    }

    getStdDevNeutrons() {
        var meanPos, sumSqDiff, i, diffVec;        
        meanPos = this.getMeanNeutronPos();
        sumSqDiff = 0;

        for (i = 0; i < this.neutrons.length; i++) {
             diffVec = this.neutrons[i].pos.sub(meanPos);
             sumSqDiff += diffVec.magSq();
        }

        return sqrt(sumSqDiff/(this.neutrons.length+pow(10, -9)));
    }

    evaluateGenome(genome) {
        this.createReactorFromGenome(genome);
        var t, sumStdDev;
        t = sumStdDev = 0;

        while (t < CONFIG.evaluationLength) {
            this.update();
            t++;
            sumStdDev += this.getStdDevNeutrons();
        }
        
        return pow(this.evaluateTilesPosition(), 2) + this.neutrons.length / sumStdDev;
    }

    evaluateTilesPosition() {
        var score, targetGrid, x, y,
        score = 0;
        targetGrid = this.getTargetGrid();

        for (x = 0; x < this.nCols; x++) {
            for (y = 0; y < this.nRows; y++) {
                if (this.grid[x][y].__proto__.constructor == targetGrid[x][y].__proto__.constructor) {
                    score++;
                }
            }
        }

        return score;
    }

    getTargetGrid() {
        var grid, x, y;

        grid = new Array(this.nCols);
        for (var i = 0; i < this.nCols; i++) {
            grid[i] = new Array(this.nRows);
        }

        this.fillModerator(grid);
        
        // Main diagonal
        for (x = 0; x < this.nCols; x++) {
            grid[x][x] = new Fuel(x, x, this);
        }

        // Other diagonal
        for (x = this.nCols-1; x >= 0; x--) {
            grid[x][this.nRows-1-x] = new Fuel(x, this.nRows-1-x, this);
        }

        // Top right corner
        x = floor(this.nCols / 2);
        while (x < this.nCols) {
            y = floor(this.nRows / 2);
            while (y > 0) {
                grid[x][y] = new Fuel(x, y, this);
                y -= 4;
            }
            
            x += 4;
        }

        // Top left corner
        x = floor(this.nCols / 2);
        while (x > 0) {
            y = floor(this.nRows / 2);
            while (y > 0) {
                grid[x][y] = new Fuel(x, y, this);
                y -= 4;
            }

            x -= 4;
        }

        // Bottom right corner
        x = floor(this.nCols / 2);
        while (x < this.nCols) {
            y = floor(this.nRows / 2);
            while (y < this.nRows) {
                grid[x][y] = new Fuel(x, y, this);
                y += 4;
            }

            x += 4;
        }
        
        // Bottom left corner
        x = floor(this.nCols / 2);
        while (x > 0) {
            y = floor(this.nRows / 2);
            while (y < this.nRows) {
                grid[x][y] = new Fuel(x, y, this);
                y += 4;
            }

            x -= 4;
        }
        
        this.fillEdges(grid);
        return grid;
    }
}
