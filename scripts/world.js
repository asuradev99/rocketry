const gameModes = {
    editor: "Editing", 
    rtPlay: "Playing",
    rtPaused: "Paused",
}
var disableGuiExcept = function(igui, except) {
    igui.__controllers.forEach(function(setting, index){
        if(!except.includes(setting.property)) {
            setting.updateDisplay();
            setting.domElement.style.pointerEvents = "none"
            setting.domElement.style.opacity = .5;
        }
    })
}


var enableGui = function(igui) {
    igui.__controllers.forEach(function(setting, index){
            setting.updateDisplay();
            setting.domElement.style.pointerEvents = ""
            setting.domElement.style.opacity = 1;
        
    })
}





var copyInto = function(a, b) {
     for(var property in b) {
        if(Object.prototype.hasOwnProperty.call(b, property) && Object.prototype.hasOwnProperty.call(a, property)) {
            if(property == "world" || property == "ctx") {
                if(!a[property]) {
                    console.log("found epxiec")

                    a[property] = b[property];

                }
            } else {
                if(property != "a" && property != "v" && property != "p") {
                    a[property] = _.cloneDeep(b[property]);
                } else {
                    console.log(b[property])
                    a[property] = Victor.fromObject(b[property])
                }
            }
        }
    }


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
        //gui variables
        this.newPlanetX = 0;
        this.newPlanetY = 0;
        this.newPlanetMass = 10000;
        this.cameraLockPlayer = false; 

        //gui variables
        this.selectedEntity = null;
        this.selectedGui = null;
        this.testFolder = null;
    }


    update() {
        let deleteIndeces = [];

            this.entities.forEach(function (item, index) {
                item.isSelected = false;
                let mouseWorld = getMouseWorld(mousePos.x, mousePos.y);
                if(uiState.mousedown && item.mouseIn(mouseWorld.x, mouseWorld.y) && this.selectedEntity != item && (item instanceof DynamicEntity || item instanceof Planet)) {
                    this.generateSelectedGui(item);
                }

                if((item instanceof Tracer || item instanceof Rocket)  || (this.play != gameModes.editor)) {
                    let status = item.update(this);
                    
                
               if(status == "delete") {
                    //this.entities.splice(index, index)
                    deleteIndeces.push(index)
                }
            }
            }, this)
            if(this.selectedEntity) {
                this.selectedEntity.isSelected = true;
            }
            // if(this.selectedEntity) {
            //     this.selectedGui = new dat.GUI({name: 'MyGUI'});
                
            //     this.selectedGui = gui.addFolder("Test");
            //     this.selectedGui.add(this.selectedEntity.p, 'x');
            //     this.selectedGui.add(this.selectedEntity.p, 'y')

            // } 
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
        if(this.play != gameModes.editor && this.selectedEntity) {
            disableGuiExcept(this.testFolder, ["angle"])
        }
    }
    add(a) {
        this.entities.push(a)
    }


    generateSelectedGui(item) {
        if(this.selectedEntity) {
            this.selectedEntity = item;
            this.selectedGui.removeFolder(this.testFolder) 

        } else {
            this.selectedEntity = item;
            this.selectedGui = new dat.GUI({name: "myGui"});
            this.selectedGui.domElement.id = 'testgui';
        }

        this.testFolder = this.selectedGui.addFolder("Test");
        var test = this.testFolder.add(this.selectedEntity, 'name')
        this.testFolder.add(this.selectedEntity.p, 'x');
        this.testFolder.add(this.selectedEntity.p, 'y')
        this.testFolder.add(this.selectedEntity, 'm');
       //this.selectedGui.__folders["Test"].__controllers[0].domElement.hidden = true

        if(this.selectedEntity instanceof Rocket) {
            this.testFolder.add(this.selectedEntity, 'angle');
        }

        

        this.testFolder.open()
        this.selectedGui.show();
        console.log(this.selectedEntity.p.x)
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
            item.render(this);
        }, this)
    }
    reset() {
        this.play = gameModes.editor;
        this.entities = [];
    }

    saveClone() {
        let newWorld = new World(this.ctx);
        copyInto(newWorld.camera, this.camera);
        console.log("newworld camera" + newWorld.camera);
        this.entities.forEach(function(item) {
            var newEntity; 
            if(item.surfaceFriction) {
                newEntity = new Planet(); 
                console.log("Found a planet")
            } else if(item.fuelMaxJ) {
                newEntity = new Rocket();
                console.log("Found a rocket")

            } else {
                newEntity = new DynamicEntity(); 
                console.log("Found a dyanmic entity")

            }
            copyInto(newEntity, item)

            newWorld.entities.push(newEntity)
        });

        newWorld.play = gameModes.editor;
        newWorld.gravitationalConstant = this.gravitationalConstant;
        newWorld.ppm = this.ppm;
        newWorld.deltaT = this.deltaT;
        //gui variables
        newWorld.newPlanetX = 0;
        newWorld.newPlanetY = 0;
        newWorld.newPlanetMass = 10000;
        newWorld.cameraLockPlayer = false; 

        //gui variables
        newWorld.selectedEntity = this.selectedEntity;
        newWorld.selectedGui = this.selectedGui;
        newWorld.testFolder = this.testFolder;

        return newWorld;
    }
    
    generateSaveFile() {

    }

}

var saveClone = function(oworld, ctx) {
    let newWorld = new World(ctx);
        copyInto(newWorld.camera, oworld.camera);
     //   console.log("newworld camera" + newWorld.camera);
        oworld.entities.forEach(function(item) {
            var newEntity; 
            if(item.surfaceFriction) {
                newEntity = new Planet(ctx); 
                console.log("Found a planet")
            } else if(item.fuelMaxJ) {
                newEntity = new Rocket(ctx);
                console.log("Found a rocket")

            } else {
                newEntity = new DynamicEntity(ctx); 
                console.log("Found a dyanmic entity")

            }
            copyInto(newEntity, item)

            newWorld.entities.push(newEntity)
        });

        newWorld.play = gameModes.editor;
        newWorld.gravitationalConstant = oworld.gravitationalConstant;
        newWorld.ppm = oworld.ppm;
        newWorld.deltaT = oworld.deltaT;
        //gui variables
        newWorld.newPlanetX = 0;
        newWorld.newPlanetY = 0;
        newWorld.newPlanetMass = 10000;
        newWorld.cameraLockPlayer = false; 

        //gui variables
        newWorld.selectedEntity = null; //oworld.selectedEntity;
        newWorld.selectedGui = null; //oworld.selectedGui;
        newWorld.testFolder = null; //oworld.testFolder;

        return newWorld;
}