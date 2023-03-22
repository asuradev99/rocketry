//base class off of which all other game objects inherit from
class Entity {
    constructor(ctx, x, y, _m) {
        this.ctx = ctx;
        this.p = Victor(x, y);
        this.m = _m;
        this.name = ""
        this.isSelected = false;
        this.delete = false;
    }

    //template functions created to be overriden
    render() {
    }

    update() {
    }

    //determines if the mouse is within the hitbox of the entity
    mouseIn(pworldmouseX, pworldmouseY) {
        if(this.p.distance(new Victor(pworldmouseX, pworldmouseY)) < massToRad(this.m)) {
            return true;
        } else {
            return false;
        }
    }
 
}

//Dynamic entities can experience forces and move around
class DynamicEntity extends Entity{
    
    constructor(ctx, x, y, m) {
        super(ctx, x, y, m);
        this.v = Victor(0,0);
        this.a = Victor(0,0);
        this.maxCrashVelocity = 300;
        this.crashed = false; 
        this.showForces = false;
        this.showVelocity = false;
        this.trace = false;
        this.traceVar = 0;
        this.traceVarMax = 5; 
    }
    
    //update function - runs every frame, designed to update the internal state of the object
    update(pworld) {
        let collisionBuffer = new Victor(0, 0);
        if(pworld.play == gameModes.rtPlay) {

            if(this.trace && this.traceVar >= this.traceVarMax) {
                this.traceVar = 0;
                pworld.add(new Tracer(this.ctx, this.p.x, this.p.y, 500 * this.traceVarMax, new Victor(0, 0), 0))
            } else {
                if(this.trace) {
                    this.traceVar += 1;
                }
            }

            //collision detection algorithm
            pworld.entities.forEach(entity => {
                if((entity instanceof Planet || entity instanceof DynamicEntity) && entity != this) {
                    this.a.add(this.calculateAcceleration(entity, pworld));
                    if(this.p.distance(entity.p) < (massToRad(this.m) + massToRad(entity.m))) {
                        collisionBuffer.add(entity.p.clone().subtract(this.p).normalize().multiplyScalar( this.p.distance(entity.p) - (massToRad(this.m) + massToRad(entity.m)) ))
                        let disp = entity.p.clone().subtract(this.p).normalize();
                        let normalComponent = disp.clone().multiplyScalar(this.v.clone().dot(disp) / (Math.pow(disp.length(), 2)))
                    
                        if(this.v.length() > this.maxCrashVelocity && this instanceof Rocket) {
                            this.crashed = true; 
                        }

                        this.v.subtract(normalComponent);
                        this.v.multiplyScalar(0.99);
                    }
                }
            });
        }

        //Leapfrog integration technique
        let newv = this.v.clone().add(this.a.clone().multiplyScalar(pworld.deltaT));

        if(pworld.play == gameModes.rtPlay) {
            this.p.add(this.v.clone().add(newv).multiplyScalar(pworld.deltaT / 2));
            this.p.add(collisionBuffer);
        }
        
        this.v = newv;
        this.a = Victor(0,0);

    }

    //calculate the gravitational acceleration between this object and another object, b
    calculateAcceleration(b, pworld) {

        const distance = this.p.distance(b.p);

        const disp = b.p.clone().subtract(this.p).normalize();
        
        // Calculate the magnitude of the gravitational force
        const force = pworld.gravitationalConstant * (b.m / Math.pow(distance, 2));
        
        const acceleration = disp.multiplyScalar(force); 
        
        return acceleration;
    }


    //TODO: use ternary operators
    //render: designed to graphically display the object onto the canvas
    render(pworld) {
        if(this.isSelected) {
            this.ctx.strokeStyle = '#fcbe03';
        } else {
            this.ctx.strokeStyle = '#000000';
        }

        //draw main circle using utility functions
        this.ctx.fillStyle = '#ff0000';
        this.ctx.lineWidth = 10; 

        drawCircle(this.ctx, this.p.x, this.p.y, massToRad(this.m))
        drawCircleFilled(this.ctx, this.p.x, this.p.y, massToRad(this.m))
        
        this.ctx.lineWidth = 5; 
        this.ctx.strokeStyle = '#0000ff';
        
        //draw extra stuff like property vectors 
        if(this.showForces) {

            pworld.entities.forEach(entity => {
                if(entity instanceof Planet || entity instanceof DynamicEntity) {
                var a = this.calculateAcceleration(entity, pworld);
                                // Calculate the acceleration of object a
                    this.ctx.beginPath(); // Start a new path
                    this.ctx.moveTo(this.p.x, this.p.y); // Move the pen to (30, 50)
                    this.ctx.lineTo(this.p.x + a.x, this.p.y + a.y); // Draw a line to (150, 100)
                    this.ctx.stroke(); // Render the path
                    
                    this.ctx.font = `10px Verdana`;

                    this.ctx.fillText(a.magnitude().toFixed(2), this.p.x + a.x, this.p.y + a.y)
                }
                
            });
        }
       
        if(this.showVelocity) {
            this.ctx.strokeStyle = '#00ff00';

            ctx.beginPath(); // Start a new path
            ctx.moveTo(this.p.x, this.p.y); // Move the pen to (30, 50)
            ctx.lineTo(this.p.x + this.v.x, this.p.y + this.v.y); // Draw a line to (150, 100)
            ctx.stroke(); // Render the path

            this.ctx.font = `10px Verdana`;

            this.ctx.fillText(this.v.magnitude().toFixed(2), this.p.x + this.v.x, this.p.y + this.v.y)
        }
    }
}

//This kind of entity is static, but can exert gravitational force on dynamic entities. 
class Planet extends Entity {

    constructor(ctx, x, y, m) {
        super(ctx, x, y, m);
        this.surfaceFriction = 1; 
    }

    //render function
    render() {
        if(this.isSelected) {
            this.ctx.strokeStyle = '#fcbe03';
        } else {
            this.ctx.strokeStyle = '#5c5c5c';
        }

        drawCircle(this.ctx, this.p.x, this.p.y, massToRad(this.m));
        this.ctx.fillStyle = '#bfbfbf';

        drawCircleFilled(this.ctx, this.p.x, this.p.y, massToRad(this.m));

        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.font = `${massToRad(this.m) / 5}px Verdana`;
        this.ctx.fillText(this.name, this.p.x, this.p.y + massToRad(this.m) / 15);

    }
}

//Tracer: designed for particle effects and to track the position of the player
class Tracer extends Entity {
    constructor(ctx, x, y, l, v, dt) {
        super(ctx, x, y);
        this.l = l;
        this.lc = 0;
        this.v = v; 
        this.dt = dt;
    }

    //update function
    update() {
        this.p.add(this.v.clone().multiplyScalar(this.dt))
        this.lc += 1;
        if(this.lc == this.l) {
            return "delete"
        }
    }

    //render function
    render(world) {
        let gradient = this.lc / this.l * 255; 
        this.ctx.fillStyle = ` rgb(${gradient},${gradient},${gradient} )`;
        drawCircleFilled(this.ctx, this.p.x, this.p.y, 5 + 1/ world.camera.zoom);
    }
}

//Fuel: a special kind of tracer to mimic particles of fuel coming out of the rocket
class Fuel extends Tracer {

    constructor(ctx, x, y, l, v, dt) {
       super(ctx, x, y, l, v, dt)
    }

    //update function
    update() {
        return super.update()
    }

    //render function
    render() {
        let gradient = this.lc / this.l * 130; 
        this.ctx.fillStyle = `rgb(254,${90 + gradient},${gradient / 5} )`;
        drawCircleFilled(this.ctx, this.p.x, this.p.y, 5);
    }
}


//Rocket - this is the class the player belongs to, a dynamic entity that can be controlled by the user
class Rocket extends DynamicEntity {
    constructor(ctx, x, y, m) {
        super(ctx, x, y, m);
        this.fuelMaxJ =  1000000 * 1000;
        this.currentFuel = this.fuelMaxJ;
        this.fuelVel = 0;
        this.angle = 90; 
        this.boosterOffset = 20;
        this.boosterForce = 20000; 
    }

    //change the angle of the rocket
    changeAngle(deltaAngle) {
        this.angle += deltaAngle;
    }

    //render function
    render(pworld) {
        if(this.currentFuel > this.fuelMaxJ) {
            this.currentFuel = this.fuelMaxJ;
        }
        this.boosterOffset = massToRad(this.m) * 2;
        this.ctx.save() 

        if(this.isSelected) {
            this.ctx.fillStyle = '#fcbe03';
        } else {
            this.ctx.fillStyle = '#000000';
        }

        this.ctx.translate(this.p.x, this.p.y);
        this.ctx.rotate(this.angle * Math.PI / 180);
        var path=new Path2D();
       // var this.boosterOffset = 20;
        path.moveTo( 0 - this.boosterOffset, 0 - this.boosterOffset / 2 );
        path.lineTo( 0 -  this.boosterOffset, 0 + this.boosterOffset / 2 );
        path.lineTo( 0 + this.boosterOffset / 2, 0);
        ctx.fill(path);
        this.ctx.restore();
        super.render(pworld);


    }

    //apply a force vector to the rocket
    applyForce(F) {
        this.a.add(F.divideScalar(this.m))
    }

    //apply a booster force to the rocket
    applyBooster(M, pworld) {
        let mag = M;
        let fuelUsed = M * ( (this.fuelVel * pworld.deltaT) +  M  / (2 * this.m)  * Math.pow(pworld.deltaT, 2))

        //estimate amount of fuel used in irregular amounts
        if(this.currentFuel >= fuelUsed) {
            this.currentFuel -= fuelUsed; 
            this.fuelVel += (M / this.m) * pworld.deltaT;
        } else {
            console.log(this.currentFuel + " " + fuelUsed);
            mag = ((this.currentFuel / fuelUsed)) * M; 

            this.currentFuel = 0; 
            this.fuelVel = 0;
        }

        //calculate force due to the fuel used
        let f = new Victor(mag * Math.cos(this.angle * Math.PI / 180), mag * Math.sin(this.angle * Math.PI / 180));
        let fa = f.clone().divideScalar(this.m); 

        //render booster force: TODO: merge with other force functions
        if(this.showForces) {
            this.ctx.lineWidth = 5; 
            this.ctx.strokeStyle = '#0000ff';
            this.ctx.beginPath(); // Start a new path
            this.ctx.moveTo(this.p.x, this.p.y); // Move the pen to (30, 50)
            this.ctx.lineTo(this.p.x + fa.x, this.p.y + fa.y); // Draw a line to (150, 100)
            this.ctx.stroke(); // Render the path
            
            this.ctx.font = `10px Verdana`;

            this.ctx.fillText(f.magnitude().toFixed(2), this.p.x + fa.x, this.p.y + fa.y)
        }

        this.applyForce(f)
        let rand = new Victor((Math.random() * 2 - 1) * 30, (Math.random() * 2 - 1) * 30);
        let startingVelocity = this.v.clone().add(f.clone().multiplyScalar(-1/5).add(rand));

        if(pworld.play == gameModes.rtPaused) {
            startingVelocity = f.clone().multiplyScalar(-5).add(rand);
        }

        //add Fuel particle
        pworld.add(new Fuel(this.ctx, this.p.x - this.boosterOffset * Math.cos(this.angle * Math.PI / 180), this.p.y - this.boosterOffset * Math.sin(this.angle * Math.PI / 180), 50, startingVelocity , pworld.deltaT));
    }
}