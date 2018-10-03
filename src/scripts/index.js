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
