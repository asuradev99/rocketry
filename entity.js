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
        this.world.entities.forEach(entity => {
            if(entity instanceof Planet) {
                this.a.add(this.calculateAcceleration(entity));
            }
        });

        this.v.add(this.a.clone().multiplyScalar(this.world.deltaT));
        this.p.add(this.v.clone().multiplyScalar(this.world.deltaT));
       // if(!(this instanceof Rocket)) {
       // }
        this.a = Victor(0,0);
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
    constructor(ctx, x, y, l, v, dt) {
        super(ctx, x, y);
        this.l = l;
        this.lc = 0;
        this.v = v; 
        this.dt = dt;
    }
    update() {
        this.p.add(this.v.clone().multiplyScalar(this.dt))
        this.lc += 1;
        if(this.lc == this.l) {
            return "delete"
        }
    }
    render() {
        let gradient = this.lc / this.l * 130; 
        this.ctx.fillStyle = `rgb(254,${90 + gradient},${gradient / 5} )`;
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
    constructor(ctx, world, x, y, m) {
        super(ctx, world, x, y, m);
        this.fuelMaxJ = 100000;
        this.currentFuel = this.fuelMaxJ;
        this.angle = 90; 
        this.boosterOffset = 20;
        console.log(this.world)
    }

    changeAngle(deltaAngle) {
        this.angle += deltaAngle;
    }

    render() {
        this.ctx.save() 
        this.ctx.translate(this.p.x, this.p.y);
        this.ctx.rotate(this.angle * Math.PI / 180);
        var path=new Path2D();
       // var this.boosterOffset = 20;
        path.moveTo( 0 - this.boosterOffset, 0 - this.boosterOffset / 2 );
        path.lineTo( 0 -  this.boosterOffset, 0 + this.boosterOffset / 2 );
        path.lineTo( 0 + this.boosterOffset / 2, 0);
        ctx.fill(path);
        this.ctx.restore();
        super.render();

    }
    applyForce(F) {
        this.a.add(F.divideScalar(this.m))
    }

    applyBooster(M) {
        let f = new Victor(M * Math.cos(this.angle * Math.PI / 180), M * Math.sin(this.angle * Math.PI / 180));
        this.applyForce(f)
        let rand = new Victor((Math.random() * 2 - 1) * 30, (Math.random() * 2 - 1) * 30);
        
        this.world.add(new Tracer(this.ctx, this.p.x, this.p.y, 25, this.v.clone().add(f.multiplyScalar(-1)).add(rand), this.world.deltaT));

    }
}