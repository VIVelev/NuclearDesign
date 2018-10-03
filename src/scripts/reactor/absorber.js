class Absorber extends Tile {
    constructor(col, row) {
        super(col, row);
        this.cool = CONFIG.absorberCool;
        this.color = {
            r: 108,
            g: 122,
            b: 137
        };
    }

    // Randomly absorb a neutron
    onReact(n) {
        if (random(100) < CONFIG.absorberChance) {
            glow(n.pos.x, n.pos.y, {
                r: 255,
                g: 255,
                b: 255
            });
            removeNeutron(n);
            this.heat += CONFIG.absorberHeat;
            return true;
        }
    }

    update() {
        this.spreadHeat();
    }
}
