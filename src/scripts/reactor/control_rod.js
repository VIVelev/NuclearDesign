class ControlRod extends Tile {
    constructor(col, row, simulation) {
        super(col, row, simulation);
        this.cool = CONFIG.controlRodCool;
        this.color = {
            r: 154,
            g: 18,
            b: 179
        };
    }

    // Randomly absorb a neutron if control rod is down
    onReact(n) {
        if ((random(100) < CONFIG.controlRodChance) && (this.simulation.controlRods)) {
            glow(n.pos.x, n.pos.y, {
                r: 255,
                g: 255,
                b: 255
            });
            this.simulation.removeNeutron(n);
            this.heat += CONFIG.controlRodHeat;
            return true;
        }
    }

    update() {
        if (this.simulation.controlRods) {
            this.color = {
                r: 108,
                g: 122,
                b: 137
            };
        } else {
            this.color = {
                r: 154,
                g: 18,
                b: 179
            };
        }

        this.spreadHeat();
    }
}
