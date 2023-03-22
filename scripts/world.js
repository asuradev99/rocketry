//World implementation
//main World class implementation
class World {
    constructor(ctx) {

        //main variables
        this.ctx = ctx;
        this.camera = new Camera(ctx, window.innerWidth, window.innerHeight);
        this.entities = [];
        this.play = gameModes.editor;
        this.gravitationalConstant = 100;
        this.ppm = 100;
        this.deltaT = 0.02;

        //main GUI variables
        this.newPlanetX = 0;
        this.newPlanetY = 0;
        this.newPlanetMass = 10000;
        this.cameraLockPlayer = false;

        //selected GUI variables
        this.selectedEntity = null;
        this.selectedGui = null;
        this.testFolder = null;
    }

    //update function - runs every animation frame
    update() {
        let deleteIndeces = [];

        //for-loop that runs for each entity
        this.entities.forEach(function (item, index) {
            if (item.delete) {
                deleteIndeces.push(index)
            }

            item.isSelected = false;
            let mouseWorld = getMouseWorld(uiState.mousePos.x, uiState.mousePos.y);

            if (uiState.mousedown && item.mouseIn(mouseWorld.x, mouseWorld.y) && this.selectedEntity != item && (item instanceof DynamicEntity || item instanceof Planet)) {
                this.selectedEntity = item;
                this.generateSelectedGui(item);
            }

            if ((item instanceof Tracer || item instanceof Rocket) || (this.play != gameModes.editor)) {
                let status = item.update(this);
                if (status == "delete") {
                    deleteIndeces.push(index)
                }
            }
        }, this)

        if (this.selectedEntity) {
            this.selectedEntity.isSelected = true;
        }

        //delete marked entities using a reversed iterator
        for (var i = deleteIndeces.length - 1; i >= 0; i--) {
            this.entities.splice(deleteIndeces[i], 1);
        }

    }

    //TODO: redunant; merge with other updateGui function
    updateGui() {
        this.newPlanetX = this.camera.x;
        this.newPlanetY = this.camera.y;
        if (this.play != gameModes.editor && this.selectedEntity) {
            disableGuiExcept(this.testFolder, ["angle"])
        }
    }

    //add an entity to the world
    add(a) {
        this.entities.push(a)
    }

    //generate a GUI based on the selected item's properties TODO: move this outside of world
    generateSelectedGui() {
        console.log(this.selectedEntity)
        if (this.selectedGui) {
            this.selectedGui.removeFolder(this.testFolder)

        } else {
            this.selectedGui = new dat.GUI({ name: "myGui" });
            this.selectedGui.domElement.id = 'testgui';
        }


        this.testFolder = this.selectedGui.addFolder("Properties");
        this.testFolder.add(this.selectedEntity, 'name')
        this.testFolder.add(this.selectedEntity.p, 'x');
        this.testFolder.add(this.selectedEntity.p, 'y')
        this.testFolder.add(this.selectedEntity, 'm');
        //this.selectedGui.__folders["Test"].__controllers[0].domElement.hidden = true

        if (this.selectedEntity instanceof Rocket) {
            this.testFolder.add(this.selectedEntity, 'angle');
            this.testFolder.add(this.selectedEntity, 'fuelMaxJ');
            this.testFolder.add(this.selectedEntity, 'boosterForce');
        }

        this.testFolder.open()
        this.selectedGui.show();
        console.log(this.selectedEntity.p.x)
    }

    //Toggle functions for force, velocity, and trace visualizations
    toggleForces() {
        this.entities.forEach(function (item, index) {
            if ((item instanceof DynamicEntity || item instanceof Rocket)) {
                item.showForces = !item.showForces;
            }
        }, this)
    }

    toggleTrace() {
        this.entities.forEach(function (item, index) {
            if ((item instanceof DynamicEntity || item instanceof Rocket)) {
                item.trace = !item.trace;
            }
        }, this)
    }

    toggleVelocities() {
        this.entities.forEach(function (item, index) {
            if ((item instanceof DynamicEntity || item instanceof Rocket)) {
                item.showVelocity = !item.showVelocity;
            }
        }, this)
    }


    //render all the elements in the world
    render() {
        this.entities.forEach(function (item, index) {
            item.render(this);
        }, this)
    }

    //reset the world TODO: delete
    reset() {
        this.play = gameModes.editor;
        this.entities = [];
    }

}
