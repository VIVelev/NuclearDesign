class Wall extends Tile {
    constructor(col, row) {
        super(col, row);
        this.cool = CONFIG.wallCool;
        this.color = {
            r: 0,
            g: 0,
            b: 0
        };
    }

    // Absorb a neutron 100% of the time
    onReact(n) {
        glow(n.pos.x, n.pos.y, {
            r: 255,
            g: 255,
            b: 255
        });
        removeNeutron(n);
        return true;
    }

    update() {
        this.heat = 0;
    }
}
