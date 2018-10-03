class Genome {
    constructor(nRows, nCols) {
        this.grid = new Array(nRows)
        for (var i = 0;i < nRows; i++) {
            this.grid[i] = new Array(nCols)
        }

        for (var x = 0; x < nRows; x++) {
            for (var y = 0; y < nCols; y++) {
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
