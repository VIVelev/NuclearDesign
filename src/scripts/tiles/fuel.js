class Fuel extends Tile {
    constructor(col, row, simulation) {
        super(col, row, simulation);
        this.cool = CONFIG.fuelCool;
        this.color = {
            r: 0,
            g: 255,
            b: 0
        };
    }

    // Randomly absorb a single neutron and spawn a random number of neutrons
    onReact(n) {
        if (random(100) < CONFIG.fuelChance) {
            this.simulation.removeNeutron(n);

            // Glow
            var c = this.center();
            this.simulation.glow(c.x, c.y, this.color);

            // Spawn neutrons
            var spawnCount = round(random(CONFIG.nSpawnMin,
                                          CONFIG.nSpawnMax));
            for (var i = 0; i < spawnCount; i++) {
                this.simulation.neutrons.push(new Neutron(c.x, c.y, this.simulation));
            }

            this.heat += CONFIG.fuelHeat;

            return true;
        }
    }

    // Randomly spontaneously generate a neutron
    update() {
        if (random(100) < CONFIG.fuelSpontChance) {
            var c = this.center();
            this.simulation.glow(c.x, c.y, this.color);
            this.simulation.neutrons.push(new Neutron(c.x, c.y, this.simulation));
            this.heat += CONFIG.fuelSpontHeat;
        }
        
        this.spreadHeat();
    }
}
