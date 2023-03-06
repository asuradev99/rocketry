function newton(a, b) {
    
}

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
    constructor(x, y, m) {
        super(x, y, m);
        this.v = createVector(0,0);
        this.a = createVector(0,0);
    }
    
    update(entities) {
        entities.forEach(entity => {
            
        });
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

class Rocket extends DynamicEntity {
    constructor(x, y)
}