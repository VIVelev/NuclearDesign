////////////////////////////
//   Generation Session   //
///////////////////////////


function runGenerationSession(maxGeneration=10000) {
    pop = new Population(
        new Simulation(visualize=false)
    );
    pop.initRandomPopulation()

    while (pop.generation < maxGeneration) {
        pop.evaluatePopulation();
        pop.printStatistics();
        pop.generateNewPopulation();
    }
}


//////////////////////////////////
//  p5.js built-in functions    //
//////////////////////////////////


function displayConfig() {
    config = document.getElementById("config");
    config.innerHTML = "";
    
    for (var item in CONFIG) {
      newItem = document.createElement("li");
      newItem.innerHTML = item + ": " + CONFIG[item];
      newItem.setAttribute("class", "param");
      config.appendChild(newItem);
    }
}

function setup() {
    displayConfig();
}

function draw() {
    // TODO
}
