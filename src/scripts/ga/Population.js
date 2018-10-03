class Population {
    constructor(simulation) {
        this.simulation = simulation;
        this.population = new Array(POP_SIZE);
        this.generation = 0;

        this.parents = new Array(2);
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
        for (var i = 0; i < this.parents.length; i++) {
            fitnessSum = this.getFitnessSum();
            k = floor(random(fitnessSum));
            j = 0;

            while (k > 0) {
                k -= this.population[j].fitness;
                j++;
            }
            j--;

            this.parents[i] = this.population[j];
        }
    }

    generateNewPopulation() {
        // TODO
    }

    printStatistics() {
        console.log(`******************** ${this.generation} ********************`);
        console.log(`Mean Fitness: ${this.getMeanFitness()}`);
        console.log(`Best Fitness: ${this.getBestFitness()}`);
        console.log("\n");
    }

    getFitnessSum() {
        var fitnessSum = 0;
        for (var i = 0; i < POP_SIZE; i++) {
            fitnessSum += this.population[i].fitness;
        }

        return fitnessSum;
    }

    getMeanFitness() {
        return this.getFitnessSum() / POP_SIZE;
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
