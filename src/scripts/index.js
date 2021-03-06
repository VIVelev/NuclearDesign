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
    for (var prop in CONFIG) {
        newRow = document.createElement("tr")
        newTextCell = document.createElement("td");
        newTextCell.innerHTML = prop;
        newInputCell = document.createElement("td");
        newInput = document.createElement("input");
        newInput.defaultValue = CONFIG[prop];
        newInput.setAttribute("class", "param");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("id", prop);
        newInputCell.appendChild(newInput);
        newRow.appendChild(newTextCell);
        newRow.appendChild(newInputCell);
        config.appendChild(newRow);
    }
}

function update_config(){
    params = document.getElementsByClassName("param");
    var  len = params.length;
    for(var i =0;i<len;i++){
        inputs = params[i].getAttribute("id");
        var type = typeof(CONFIG[inputs]);
        if (type == "number") CONFIG[inputs] = parseFloat(params[i].value);
        else if (type == "boolean") CONFIG[inputs] = (params[i].value == "true");
        else if (type == "object") {
            CONFIG[inputs] = params[i].value.split(",").map(parseFloat);
        }
        else CONFIG[inputs] = params[i].value;
    }
    displayCONFIG();
}

function preview() {
    canPreview = true;

    sim = new Simulation();
    sim.createReactorFromGenome(pop.bestGenome);
    // sim.grid = sim.getTargetGrid();
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
