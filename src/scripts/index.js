var pop, canPreview, sim;


////////////////////////////
//  Optimization Session  //
////////////////////////////


function optimize() {
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


////////////////////////////
//     Visualization      //
////////////////////////////


function displayCONFIG() {
    config = document.getElementById("tableConfig");
    config.innerHTML = "";
    keys = Object.keys(CONFIG);
    var len = keys.length;
    for (var i = 0; i < 5; i++) {
        newRow = document.createElement("tr");
        for (var j = i; j < len - 1; j += 5) {
            newTextCell = document.createElement("td");
            newTextCell.innerHTML = keys[j];
            newInputCell = document.createElement("td");
            newInput = document.createElement("input");
            newInput.defaultValue = CONFIG[keys[j]];
            newInput.setAttribute("class", "param");
            newInput.setAttribute("type", "text");
            newInput.setAttribute("id", keys[j]);
            newInputCell.appendChild(newInput);
            newRow.appendChild(newTextCell);
            newRow.appendChild(newInputCell);
        }
        config.appendChild(newRow);
    }
}

function update_config(){
    params = document.getElementsByClassName("param");
    var  len = params.length;
    for(var i =0;i<len;i++){
        inputs = params[i].getAttribute("id");
        CONFIG[inputs] = params[i].value;

    }
    displayCONFIG();
}

function preview() {
    canPreview = true;

    sim = new Simulation();
    sim.createReactorFromGenome(pop.bestGenome);
}


//////////////////////////////////
//  p5.js built-in functions    //
//////////////////////////////////


function setup() { }

function draw() {
    if (canPreview) {
        sim.update();
    }
}
