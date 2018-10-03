class Coolant extends Tile {
    constructor(col, row) {
        super(col, row);
        this.cool = CONFIG.coolantCool;
        this.color = {
            r: 25,
            g: 181,
            b: 254
        };
    }

    update() {
        this.spreadHeat();
    }
}
