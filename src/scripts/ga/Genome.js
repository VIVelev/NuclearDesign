class Genome {
    constructor(simulation, genotype=null) {
        this.simulation = simulation;

        if (is(genotype, null)) {
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
                this.grid[x][y] = choose(['C', 'F', 'M', 'H', 'V', 'W']);
            }
        }
    }

    evaluate() {
        // TODO: Come up with a good fitness metric!
        this.fitness = 0;
    }

    crossover(other) {
        newGrid = new Array(this.simulation.nCols);
        for (var i = 0; i < this.simulation.nCols; i++) {
            newGrid[i] = new Array(this.simulation.nRows);
        }

        for (var x = 0; x < this.simulation.nCols; x++) {
            for (var y = 0; y < this.simulation.nRows; y++) {
                newGrid[x][y] = choose([this.grid[x][y], other.grid[x][y]]);
            }
        }

        return Genome(this.simulation, genotype=newGrid)
    }

    mutate(mutationRate) {
        if (mutationRate > floor(random(100)) / 100) {
            var x = floor(random(this.simulation.nCols+1));
            var y = floor(random(this.simulation.nRows+1));

            this.grid[x][y] = choose(['C', 'F', 'M', 'H', 'V', 'W']);
        }
    }
}
