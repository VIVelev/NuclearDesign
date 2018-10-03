//////////////////////////////////
//  p5.js built-in functions    //
//////////////////////////////////

var sim = null;

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
    displayConfig()

    sim = new Simulation(visualize=true)
}

function draw() {
    pop = Population(sim);
    pop.run()
}
