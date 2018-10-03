class Moderator extends Tile {
    constructor(col, row) {
        super(col, row);
        this.cool = CONFIG.moderatorCool;
        this.color = {
            r: 218,
            g: 223,
            b: 225
        };
    }

    update() {
        this.spreadHeat();
    }
}
