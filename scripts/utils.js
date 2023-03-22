function drawCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawCircleFilled(ctx, x, y, r) {
     ctx.beginPath();
     ctx.arc(x, y, r, 0, 2 * Math.PI);
     ctx.fill();
 }
 

function massToRad(m) {
    return Math.sqrt(Math.abs(m))
}


//enum for storing the different posssible game modes
const gameModes = {
    editor: "Editing",
    rtPlay: "Playing",
    rtPaused: "Paused",
}


//enum that stores the states of keys that need to be held down
const keyDir = {
    none: 0,
    leftUp: 1,
    rightDown: 2
 }


//disable part of a GUI; useful when in modes that should not allow editing of objects
var disableGuiExcept = function (igui, except) {
    igui.__controllers.forEach(function (setting, index) {
        if (!except.includes(setting.property)) {
            setting.updateDisplay();
            setting.domElement.style.pointerEvents = "none"
            setting.domElement.style.opacity = .5;
        }
    })
}

//re-enable a gui element
var enableGui = function (igui) {
    igui.__controllers.forEach(function (setting, index) {
        setting.updateDisplay();
        setting.domElement.style.pointerEvents = ""
        setting.domElement.style.opacity = 1;

    })
}

//Hack function that creates a deepcopy of an object given that the type of the destination object is already known (This is why javascript sucks), copies b into a
var copyInto = function (a, b) {
    for (var property in b) {
        if (Object.prototype.hasOwnProperty.call(b, property) && Object.prototype.hasOwnProperty.call(a, property)) {
            if (property == "world" || property == "ctx") {
                if (!a[property]) {
                    a[property] = b[property];
                }
            } else {
                if (property != "a" && property != "v" && property != "p") {
                    a[property] = _.cloneDeep(b[property]);
                } else {
                    a[property] = Victor.fromObject(b[property])
                }
            }
        }
    }


}


//utility function that deepcopies the current world
var saveClone = function (oworld, ctx) {
    let newWorld = new World(ctx);
    copyInto(newWorld.camera, oworld.camera);

    oworld.entities.forEach(function (item) {
        var newEntity;
        if (item.surfaceFriction) {
            newEntity = new Planet(ctx);
        } else if (item.fuelMaxJ) {
            newEntity = new Rocket(ctx);
        } else {
            newEntity = new DynamicEntity(ctx);
        }
        copyInto(newEntity, item)
        newWorld.entities.push(newEntity)
    });

    newWorld.ctx = ctx;
    newWorld.play = gameModes.editor;
    newWorld.gravitationalConstant = oworld.gravitationalConstant;
    newWorld.ppm = oworld.ppm;
    newWorld.deltaT = oworld.deltaT;
    newWorld.newPlanetX = 0;
    newWorld.newPlanetY = 0;
    newWorld.newPlanetMass = 10000;
    newWorld.cameraLockPlayer = false;
    newWorld.selectedEntity = null;
    newWorld.selectedGui = null;
    newWorld.testFolder = null;

    return newWorld;
}

