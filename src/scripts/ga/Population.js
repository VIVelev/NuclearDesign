class Population {
    constructor(simulation) {
        this.simulation = simulation;
        this.population = new Array(POP_SIZE);
        this.generation = 0;

        this.parents = new Array(2);

        this.bestGenome = null;
        this.bestFitness = 0;
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

        this.updateBestGenome();
    }

    parentSelection() {
        for (var i = 0; i < this.parents.length; i++) {
            var fitnessSum = this.getFitnessSum();
            var k = random(fitnessSum);
            var j = 0;

            while (k > 0) {
                k -= this.population[j].fitness;
                j++;
            }
            j--;

            this.parents[i] = this.population[j];
        }
    }

    generateNewPopulation() {
        var newPopulation = new Array(POP_SIZE);

        // Directly transfer the top individuals to the next generation
        for (var i = 0; i < ELITISM; i++) {
            newPopulation[i] = this.population[i];
        }
        
        // Crossover between parents and mutation
        for (var i = ELITISM; i < POP_SIZE; i++) {
            this.parentSelection()
            var offspring = this.parents[0].crossover(this.parents[1]);
            offspring.mutate(MUTATION_RATE);
            newPopulation[i] = offspring;
        }

        this.population = newPopulation;
        this.generation++;
    }

    printStatistics() {
        console.log(`******************** Generation ${this.generation} ********************`);
        console.log(`Mean Fitness: ${this.getMeanFitness()}`);
        console.log(`Best Fitness: ${this.bestFitness}`);
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

    updateBestGenome() {
        for (var i = 0; i < POP_SIZE; i++) {
            if (this.bestFitness < this.population[i].fitness) {
                this.bestFitness = this.population[i].fitness;
                this.bestGenome = this.population[i];
            }
        }
    }
}
