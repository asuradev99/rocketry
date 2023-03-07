// function newton(a, b) {
    
// }

class Entity {
    constructor(x, y, _m) {
        this.p = createVector(x, y);
        this.m = _m;
                
    }

    render() {
        //pass
    }

    update() {
        //pass
    }
}


class DynamicEntity extends Entity{
    constructor(world, x, y, m) {
        super(x, y, m);
        this.world = world;
        this.v = createVector(0,0);
        this.a = createVector(0,0);
    }
    
    update() {
        this.world.entities.forEach(entity => {
            if(entity instanceof Planet) {
                this.a.add(this.calculateAcceleration(entity));
            }
        });

        this.v.add(this.a.copy().mult(this.world.deltaT));
        this.p.add(this.v.copy().mult(this.world.deltaT));

    }

    calculateAcceleration(b) {

        const distance = p5.Vector.dist(this.p, b.p);
        const disp = p5.Vector.sub(b.p, this.p).normalize();
        // Universal gravitational constant
        
        // Calculate the magnitude of the gravitational force
        const force = this.world.gravitationalConstant * (b.m / Math.pow(distance, 2));
        
        const acceleration = disp.mult(force); 
        // Calculate the acceleration of object a
        
        drawArrow(this.p, acceleration, 'blue');
        return acceleration;
    }

    render() {
        ellipse(this.p.x, this.p.y, 100, 100)
    }
}

class Planet extends Entity {
    constructor(x, y, m) {
        super(x, y, m);
        //this.r = 
    }

    render() {
        strokeWeight(4);
        stroke(255);
        fill(135, 135, 135)
        ellipse(this.p.x, this.p.y, Math.sqrt(this.m), Math.sqrt(this.m));
    }
}

function drawArrow(base, vec, myColor) {
    push()
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    
    pop()
}
// class Rocket extends DynamicEntity {
//     constructor(x, y)
// }