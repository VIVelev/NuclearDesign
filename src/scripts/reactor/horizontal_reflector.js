class HorizontalReflector extends Tile {
    constructor(col, row) {
        super(col, row);
        this.cool = CONFIG.reflectorCool;
        this.color = {
            r: 242,
            g: 121,
            b: 53
        };
    }

    // Reflect the neutron
    onReact(n) {
        n.vel.x *= -1;
        
        this.heat += CONFIG.reflectorHeat;
    }

    update() {
        this.spreadHeat();
    }
}
