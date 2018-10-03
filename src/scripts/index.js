//////////////////////////
//   Utility functions  //
//////////////////////////


// Random choice from array
function choose(choices) {
    var index = floor(random() * choices.length);
    return choices[index];
}

// Find the nearest tile
function currentTile(x, y) {
    return {
        x: floor(x / RENDER.cellSize),
        y: floor(y / RENDER.cellSize)
    };
}

// Returns 1 or -1
function plusOrMinus() {
    return round(random()) * 2 - 1;
}

// Returns random neutron velocity
function randVelocity() {
    return random(CONFIG.nSpeedMin, CONFIG.nSpeedMax) * plusOrMinus();
}


//////////////////////////////////
//  p5.js built-in functions    //
//////////////////////////////////

var sim = null;

function setup() {
    params = document.getElementById("params");
    params.innerHTML = "";
    
    for (var param in CONFIG) {
      newItem = document.createElement("li");
      newItem.innerHTML = param + ": " + CONFIG[param];
      newItem.setAttribute("class", "param");
      params.appendChild(newItem);
    }

    sim = new Simulation(visualize=true)
    genome = new Genome(sim)
    sim.createReactor(genome)
}

function draw() {
    sim.update()
}
