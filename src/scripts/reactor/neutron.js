class Neutron {
    constructor(x, y, simulation) {
        this.pos = new p5.Vector(x, y);
        this.simulation = simulation
        this.counter = 0;

        if (CONFIG.nCardDir) {
            // Give neutron random cardinal direction velocity
            this.vel = new p5.Vector(0, 0);
            if (round(random(1))) {
                this.vel.x = randVelocity();
            } else {
                this.vel.y = randVelocity();
            }
        } else {
            this.vel = new p5.Vector(randVelocity(), randVelocity());
        }

        this.color = {
            r: 31,
            g: 58,
            b: 147
        }
    }

    // Display neutron on the screen
    display() {
        if (this.simulation.heatOverlay) {
            fill(255, 0, 0, 100);
            noStroke();
        } else {
            fill(this.color.r, this.color.g, this.color.b);
            stroke(255);
        }

        ellipse(this.pos.x, this.pos.y, RENDER.nSize, RENDER.nSize);
    }

    // Ensure neutrons that go off the screen are deleted
    checkEdges() {
        return ((this.pos.x < 0) || (this.pos.y < 0) ||
                (this.pos.x > (this.simulation.nCols * RENDER.cellSize)) ||
                (this.pos.y > (this.simulation.nRows * RENDER.cellSize)));
    }

    // Update position of neutron
    update() {
        this.pos.add(this.vel);
        this.counter++;
    }
}
