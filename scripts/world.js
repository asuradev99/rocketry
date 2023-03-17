const gameModes = {
    editor: "editor", 
    rtPlay: "rtPlay",
    rtPaused: "rtPaused",
}

class World {
    constructor(ctx) {
        this.ctx = ctx;
        this.camera = new Camera(ctx, window.innerWidth, window.innerHeight);
        this.entities = [];
        this.play = gameModes.editor;
        this.gravitationalConstant = 100;
        this.ppm = 100;
        this.deltaT = 0.02;
        this.selectedObject = false;
        //gui variables
        this.newPlanetX = 0;
        this.newPlanetY = 0;
        this.newPlanetMass = 10000;
        this.cameraLockPlayer = false; 
        
    }
    update() {
        let deleteIndeces = [];
       
            this.entities.forEach(function (item, index) {
                if((item instanceof Tracer || item instanceof Rocket)  || (this.play != gameModes.editor)) {
                    let status = item.update();
               if(status == "delete") {
                    //this.entities.splice(index, index)
                    deleteIndeces.push(index)
                }
            }
            }, this)
               ctx.fillStyle = "Red";
              ctx.font      = "normal 16pt Arial";

              ctx.fillText(deleteIndeces.toString(), 10, 26);
             for(var i = deleteIndeces.length - 1; i >= 0; i--) {
                this.entities.splice(deleteIndeces[i],1);
             }
        
    }
    updateGui() {
        this.newPlanetX = this.camera.x; 
        this.newPlanetY = this.camera.y; 
    }
    add(a) {
        this.entities.push(a)
    }
    toggleForces() {
        this.entities.forEach(function (item, index) {
            if((item instanceof DynamicEntity || item instanceof Rocket)) {
                item.showForces = !item.showForces;
            }
        }, this)
    }

    toggleVelocities() {
        this.entities.forEach(function (item, index) {
            if((item instanceof DynamicEntity || item instanceof Rocket)) {
                item.showVelocity = !item.showVelocity;
            }
        }, this)
    }


    render() {
        //
        this.entities.forEach(function (item, index) {
            item.render();
        })
    }
    reset() {
        this.entities = [];
    }
}