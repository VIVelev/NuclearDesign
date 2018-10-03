class Tile {
    constructor(col, row) {
        this.pos = new p5.Vector(col, row);
        this.heat = 0;
        this.cool = 0;
        this.color = {
            r: 255,
            g: 255,
            b: 255
        };
    }

    // Display tile on the screen
    display() {
        // Show heat overlay
        if (heatOverlay) {
            fill(this.heat/CONFIG.heatMax*255, 0, 0);
            stroke(0);
            rect(this.pos.x*RENDER.cellSize, this.pos.y*RENDER.cellSize,
                 RENDER.cellSize-1, RENDER.cellSize-1);
        } else {
            fill(this.color.r, this.color.g, this.color.b);
            stroke(0);
            rect(this.pos.x*RENDER.cellSize, this.pos.y*RENDER.cellSize,
                 RENDER.cellSize-1, RENDER.cellSize-1);
        }
    }

    // Get array of adjacent tiles
    adjacent() {
        var arr = [];

        if (!(this.pos.x === 0)) {
            arr.push(grid[this.pos.x-1][this.pos.y]);
        }
        if (!(this.pos.y === 0)) {
            arr.push(grid[this.pos.x][this.pos.y-1]);
        }
        if (!(this.pos.x === (cols-1))) {
            arr.push(grid[this.pos.x+1][this.pos.y]);
        }
        if (!(this.pos.y === (rows-1))) {
            arr.push(grid[this.pos.x+1][this.pos.y]);
        }

        return shuffle(arr);
    }

    // Find center of tile
    center() {
        var x = this.pos.x*RENDER.cellSize + RENDER.cellSize/2;
        var y = this.pos.y*RENDER.cellSize + RENDER.cellSize/2;
        return {x: x, y: y};
    }

    // Ensure heat doesn't exceed max or min value
    checkHeat() {
        if (this.heat < 0) {
            this.heat = 0;
            return true;
        }
        if (this.heat > CONFIG.heatMax) {
            this.heat = CONFIG.heatMax;
        }
    }

    // Behavior for collision with neutron
    // Override
    onReact(n) {}

    // Cooling and distributing heat
    spreadHeat() {
        this.heat -= this.cool;

        // Spread heat to adjacent tiles
        if (!(this.checkHeat())) {
            var adj = this.adjacent();

            for (var i = 0; i < adj.length; i++) {
                var heat = this.heat * CONFIG.heatTransfer;

                if (heat < 1) {
                    this.heat = 0;
                    adj[i].heat += this.heat;
                    break;
                }

                this.heat -= heat;
                adj[i].heat += heat;
            }
        }
    }

    // Behavior for each cycle of the simulation
    // Override
    update() {}
}
