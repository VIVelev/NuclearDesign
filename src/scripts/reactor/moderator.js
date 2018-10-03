class Moderator extends Tile {
    constructor(row, col) {
        super(row, col);
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
