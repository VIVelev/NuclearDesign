class Genome {
    constructor(simulation, genotype=null) {
        this.simulation = simulation;

        if (genotype === null) {
            this.grid = new Array(this.simulation.nCols);
            for (var i = 0; i < this.simulation.nCols; i++) {
                this.grid[i] = new Array(this.simulation.nRows);
            }
        }else {
            this.grid = genotype;
        }

        this.fitness = 0;
    }

    randomInit() {
        for (var x = 0; x < this.simulation.nCols; x++) {
            for (var y = 0; y < this.simulation.nRows; y++) {
                this.grid[x][y] = choose(CONFIG.tileOptions);
            }
        }
    }

    evaluate() {
        this.fitness = this.simulation.evaluateGenome(this);
    }

    crossover(other) {
        if (CONFIG.crossoverType == "byTile") {
            return this.crossoverByTile(other);
        }

        if (CONFIG.crossoverType == "byBlock") {
            return this.crossoverByBlock(other);
        }
    }

    crossoverByBlock(other) {
        var x, y, xStop, yStop, baseGrid, sourceGrid;

        x = floor(random(this.simulation.nCols));
        y = floor(random(this.simulation.nRows));
        xStop = x + CONFIG.blockWidth;
        yStop = y + CONFIG.blockHeight;

        if (floor(random(2))) {
            baseGrid = Array.from(this.grid);
            sourceGrid = Array.from(other.grid);
        }else {
            sourceGrid = Array.from(this.grid);
            baseGrid = Array.from(other.grid);
        }

        for (; x <= xStop; x++) {
            for (; y <= yStop; y++) {
                baseGrid[x][y] = sourceGrid[x][y];
            }
        }

        return new Genome(this.simulation, baseGrid);
    }

    crossoverByTile(other) {
        var newGrid = new Array(this.simulation.nCols);
        for (var i = 0; i < this.simulation.nCols; i++) {
            newGrid[i] = new Array(this.simulation.nRows);
        }

        for (var x = 0; x < this.simulation.nCols; x++) {
            for (var y = 0; y < this.simulation.nRows; y++) {
                newGrid[x][y] = choose([this.grid[x][y], other.grid[x][y]]);
            }
        }

        return new Genome(this.simulation, newGrid);
    }

    mutate() {
        if (CONFIG.mutationRate > random(100) / 100) {
            var x = floor(random(this.simulation.nCols));
            var y = floor(random(this.simulation.nRows));
            
            this.grid[x][y] = choose(CONFIG.tileOptions);
        }
    }
}
