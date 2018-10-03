class Population {
    constructor(simulation) {
        this.simulation = simulation;
        this.population = new Array(POP_SIZE);
        this.generation = 0;
    }

    initRandomPopulation() {
        for (var i = 0; i < POP_SIZE; i++) {
            this.population[i] = new Genome(this.simulation);
            this.population[i].randomInit();
        }
    }

    evaluatePopulation() {
        for (var i = 0; i < POP_SIZE; i++) {
            this.population[i].evaluate();
        }
    }

    selection() {
        // TODO
    }

    generateNewPopulation() {
        // TODO
    }

    printStatistics() {
        console.log(`******************** ${this.generation} ********************`);
        console.log(`Mean Fitness: ${this.getMeanFitness()}`);
        console.log(`Best Fitness: ${this.getBestFitness()}`);
    }

    getMeanFitness() {
        var meanFitness = 0;
        for (var i = 0; i < POP_SIZE; i++) {
            meanFitness += this.population[i].fitness;
        }

        return meanFitness / POP_SIZE;
    }

    getBestFitness() {
        var bestFitness = 0;
        for (var i = 0; i < POP_SIZE; i++) {
            if (bestFitness < this.population[i].fitness) {
                bestFitness = this.population[i].fitness;
            }
        } 

        return bestFitness;
    }

}
