class Population {
    constructor(simulation) {
        this.simulation = simulation;
        this.population = new Array(CONFIG.popSize);
        this.generation = 0;

        this.parents = new Array(2);

        this.bestGenome = null;
        this.bestFitness = 0;
    }

    initRandomPopulation() {
        for (var i = 0; i < CONFIG.popSize; i++) {
            this.population[i] = new Genome(this.simulation);
            this.population[i].randomInit();
        }
    }

    evaluatePopulation() {
        for (var i = 0; i < CONFIG.popSize; i++) {
            this.population[i].evaluate();
        }

        this.updateBestGenome();
    }

    parentSelection() {
        for (var i = 0; i < this.parents.length; i++) {
            var fitnessSum = this.getFitnessSum();
            var k = random(fitnessSum);
            var j = 0;

            while (k >= 0) {
                k -= this.population[j].fitness;
                j++;
            }
            j--;

            this.parents[i] = this.population[j];
        }
    }

    generateNewPopulation() {
        var newPopulation = new Array(CONFIG.popSize);

        // Directly transfer the top individuals to the next generation
        for (var i = 0; i < CONFIG.elitism; i++) {
            newPopulation[i] = this.population[i];
        }
        
        // Crossover between parents and mutation
        for (var i = CONFIG.elitism; i < CONFIG.popSize; i++) {
            this.parentSelection();
            var offspring = this.parents[0].crossover(this.parents[1]);
            offspring.mutate();
            newPopulation[i] = offspring;
        }

        this.population = newPopulation;
        this.generation++;
    }

    printStatistics() {
        console.log(`******************** Generation ${this.generation} ********************`);
        console.log(`Mean Fitness: ${this.getMeanFitness()}`);
        console.log(`Best Fitness: ${this.getCurrentBestFitness()}`);
        console.log(`Standard Deviation: ${this.getStandardDeviation()}`);
        console.log("\n");
    }

    getFitnessSum() {
        var fitnessSum = 0;
        for (var i = 0; i < CONFIG.popSize; i++) {
            fitnessSum += this.population[i].fitness;
        }

        return fitnessSum;
    }

    getMeanFitness() {
        return this.getFitnessSum() / CONFIG.popSize;
    }

    getCurrentBestFitness() {
        var currentBestFitness = 0;
        for (var i = 0; i < CONFIG.popSize; i++) {
            if (currentBestFitness < this.population[i].fitness) {
                currentBestFitness = this.population[i].fitness;
            }
        }

        return currentBestFitness;
    }

    getStandardDeviation() {
        var meanFitness = this.getMeanFitness();
        var sumOfSquaredDifferences = 0;

        for (var i = 0; i < CONFIG.popSize; i++) {
            sumOfSquaredDifferences += pow(this.population[i].fitness - meanFitness, 2);
        }

        return sqrt(sumOfSquaredDifferences/CONFIG.popSize);
    }

    updateBestGenome() {
        for (var i = 0; i < CONFIG.popSize; i++) {
            if (this.bestFitness < this.population[i].fitness) {
                this.bestFitness = this.population[i].fitness;
                this.bestGenome = this.population[i];
            }
        }
    }
}
