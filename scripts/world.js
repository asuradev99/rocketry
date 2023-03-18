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
                    let status = item.update();
                    
                
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
            item.render();
        })
    }
    reset() {
        this.entities = [];
    }
}