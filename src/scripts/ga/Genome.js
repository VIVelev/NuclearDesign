class Genome {
    constructor(simulation) {
        this.simulation = simulation;
        this.grid = new Array(this.simulation.nCols);
        
        for (var i = 0; i < this.simulation.nCols; i++) {
            this.grid[i] = new Array(this.simulation.nRows);
        }
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
    }

    crossover(other) {
        for (var x = 0; x < this.simulation.nCols; x++) {
            for (var y = 0; y < this.simulation.nRows; y++) {
                this.grid[x][y] = choose([this.grid[x][y], other.grid[x][y]]);
            }
        }
    }

    mutate(mutation_rate) {
        // TODO
    }
}
