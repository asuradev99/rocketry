// function newton(a, b) {
    
// }
function drawCircle(ctx, x, y, r) {

   // 
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawCircleFilled(ctx, x, y, r) {

    // 
     ctx.beginPath();
     ctx.arc(x, y, r, 0, 2 * Math.PI);
     ctx.fill();
 }
 

function massToRad(m) {
    return Math.sqrt(Math.abs(m))
}

class Entity {
    constructor(ctx, x, y, _m) {
        this.ctx = ctx;
        this.p = Victor(x, y);
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
    constructor(ctx, world, x, y, m) {
        super(ctx, x, y, m);
        this.world = world;
        this.v = Victor(0,0);
        this.a = Victor(0,0);
        
    }
    
    update() {
        this.a = Victor(0,0);
        this.world.entities.forEach(entity => {
            if(entity instanceof Planet) {
                this.a.add(this.calculateAcceleration(entity));
            }
        });

        this.v.add(this.a.clone().multiplyScalar(this.world.deltaT));
        this.p.add(this.v.clone().multiplyScalar(this.world.deltaT));
        this.world.add(new Tracer(this.ctx, this.p.x, this.p.y, 255));

    }

    calculateAcceleration(b) {

        const distance = this.p.distance(b.p);

      //  console.log("hello")
        const disp = b.p.clone().subtract(this.p).normalize();
        // Universal gravitational constant
        
        // Calculate the magnitude of the gravitational force
        const force = this.world.gravitationalConstant * (b.m / Math.pow(distance, 2));
        
        const acceleration = disp.multiplyScalar(force); 
        // Calculate the acceleration of object a
        
        //drawArrow(this.p, acceleration, 'blue');
        return acceleration;
    }

    render() {
        this.ctx.strokeStyle = '#ff0000';
        drawCircle(this.ctx, this.p.x, this.p.y, massToRad(this.m))
    }
}

class Planet extends Entity {
    constructor(ctx, x, y, m) {
        super(ctx, x, y, m);
        //this.r = 
    }


    render() {
       // strokeWeight(4);
        //stroke(255);
        //fill(135, 135, 135)
        this.ctx.strokeStyle = '#000000';

        drawCircle(this.ctx, this.p.x, this.p.y, massToRad(this.m));
    }
}

class Tracer extends Entity {
    constructor(ctx, x, y, l) {
        super(ctx, x, y);
        this.l = l;
        this.lc = 0;
    }
    update() {
        this.lc += 1;
        if(this.lc == this.l) {
            return "delete"
        }
    }
    render() {
        let gradient = 100 + this.lc / this.l * 155; 
        this.ctx.fillStyle = `rgb(${gradient},${gradient},${gradient} )`;
        drawCircleFilled(this.ctx, this.p.x, this.p.y, 5);
    }
}
// function drawArrow(base, vec, myColor) {
//     push()
//     stroke(myColor);
//     strokeWeight(3);
//     fill(myColor);
//     translate(base.x, base.y);
//     line(0, 0, vec.x, vec.y);
//     rotate(vec.heading());
//     let arrowSize = 7;
//     translate(vec.mag() - arrowSize, 0);
//     triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    
//     pop()
// }



class Rocket extends DynamicEntity {
    constructor(x, y, m)
}