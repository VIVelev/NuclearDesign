class VerticalReflector extends Tile {
    constructor(col, row, simulation) {
        super(col, row, simulation);
        this.cool = CONFIG.reflectorCool;
        this.color = {
            r: 249,
            g: 191,
            b: 59
        };
    }

    // Reflect the neutron
    onReact(n) {
        n.vel.y *= -1;
        
        this.heat += CONFIG.reflectorHeat;
    }

    update() {
        this.spreadHeat();
    }
}
