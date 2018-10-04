const CONFIG = {


    ///////////////////////////////////////
    ///     Simulation Configuration    ///
    //////////////////////////////////////


    controlRodChance: 0.5,  // chance for control rod to absorb a neutron
    controlRodCool: 1,      // control rod cooling per tick
    controlRodHeat: 200,    // heat generated per collision

    fuelChance: 0.07,       // chance for fuel rod to absorb a neutron
    fuelCool: 1,            // fuel rod cooling per tick
    fuelHeat: 400,          // heat generated per reaction
    fuelSpontChance: 0.05,  // chance for spontaneous neutron emission
    fuelSpontHeat: 2,       // heat generated per spontaneous neutron emission

    heatMax: -1,            // maximum allowed heat or -1 for unlimited
    heatTransfer: 0.05,     // percent of heat transferred to adjacent tiles

    moderatorCool: 2,       // moderator cooling per tick

    nCardDir: false,        // neutrons only travel in cardinal directions
    nSpawnMin: 1,           // min number of neutrons per reaction
    nSpawnMax: 3,           // max number of neutrons per reaction
    nSpeedMin: 1,           // min neutron speed
    nSpeedMax: 10,          // max neutron speed

    reflectorCool: 1,       // reflector cooling per tick
    reflectorHeat: 100,     // heat generated per reflection

    renderGlow: false,      // render glow effect
    wallCool: 1000000,      // wall cooling per tick


    ///////////////////////////////////////
    /// Genetic Algorithm Configuration ///
    //////////////////////////////////////


    popSize: 150,           // the size of the population in the GA
    mutationRate: 0.25,     // chance for a random change in a genome's genotype
    elitism: 2,             // the number of genome's to directly pass to the new generation

    evaluationLength: 100,  // how many ticks an evaluation takes
    maxGeneration: 60,      // the maximum generation

    tileOptions: [          // the possible tile types to be used
        'C',
        'F',
        'M',
        'W'
    ] 
};


///////////////////////////////////////
///     Rendering Configuration     ///
//////////////////////////////////////


const RENDER = {
    cellSize: 20,       // height and width of each cell
    nSize: 10,          // diameter of each neutron
    gLayers: 5,         // number of layers for glow effect
    gSize: 60,          // diameter of glow effect
    canvasWidth: 300,   // width of canvas
    canvasHeight: 300   // height of canvas
};


///////////////////////////////////////
///    Char to Tile Type mapping    ///
//////////////////////////////////////


const TILE_MAP = {
    'C': ControlRod,
    'F': Fuel,
    'M': Moderator,
    'H': HorizontalReflector,
    'V': VerticalReflector,
    'W': Wall
};
