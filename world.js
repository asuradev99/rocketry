class World {
    constructor(ctx) {
        this.ctx = ctx;
        this.camera = new Camera(ctx, window.innerWidth, window.innerHeight);
        this.entities = [];
        this.play = true;
        this.gravitationalConstant = 50;
        this.ppm = 100;
        this.deltaT = 0.01;

        //gui variables
        this.newPlanetX = 0;
        this.newPlanetY = 0;
        this.newPlanetMass = 10000;
        
    }
    update() {
        let deleteIndeces = [];
        if(this.play) {
            this.entities.forEach(function (item, index) {
               let status = item.update();
               if(status == "delete") {
                    //this.entities.splice(index, index)
                    deleteIndeces.push(index)
                }
            }, this)
               ctx.fillStyle = "Red";
              ctx.font      = "normal 16pt Arial";

              ctx.fillText(deleteIndeces.toString(), 10, 26);
             for(var i = deleteIndeces.length - 1; i >= 0; i--) {
                this.entities.splice(deleteIndeces[i],1);
             }
        }
    }
    updateGui() {
        this.newPlanetX = this.camera.x; 
        this.newPlanetY = this.camera.y; 
    }
    add(a) {
        this.entities.push(a)
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