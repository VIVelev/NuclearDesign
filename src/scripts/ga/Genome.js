class Genome {
    constructor() {
        this.grid = new Array(nCols)
        for (var i = 0; i < nCols; i++) {
            this.grid[i] = new Array(nRows)
        }

        for (var x = 0; x < nCols; x++) {
            for (var y = 0; y < nRows; y++) {
                this.grid[x][y] = choose(['C', 'F', 'M'])
            }
        }

    }

    evaluate() {
        // TODO
    }

    crossover(other) {
        // TODO
    }

    mutate(mutation_rate) {
        // TODO
    }
}
