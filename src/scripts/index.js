////////////////////////////
//   Generation Session   //
////////////////////////////


pop = null;
function runGenerationSession() {
    pop = new Population(
        new Simulation(visualize=false)
    );

    pop.initRandomPopulation();
    while (pop.generation <= CONFIG.maxGeneration) {
        pop.evaluatePopulation();
        pop.printStatistics();
        pop.generateNewPopulation();
    }
}


//////////////////////////////////
//           helpers            //
//////////////////////////////////


function displayCONFIG() {
    config = document.getElementById("config");
    config.innerHTML = "";
    
    for (var item in CONFIG) {
      newItem = document.createElement("li");
      newItem.innerHTML = item + ": " + CONFIG[item];
      newItem.setAttribute("class", "param");
      config.appendChild(newItem);
    }
}

function preview() {
    canPreview = true;

    sim = new Simulation();
    sim.createReactorFromGenome(pop.bestGenome);
}


//////////////////////////////////
//  p5.js built-in functions    //
//////////////////////////////////


function setup() {
    canPreview = false;
    sim = null;
}

function draw() {
    if (canPreview) {
        sim.update();
    }
}
