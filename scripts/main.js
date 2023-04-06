"use strict";

//setup canvas vars
const canvas = document.getElementById("mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext('2d');


//initialize global variables
var ctx, world, backupWorld, player, gui, playButton, stopButton, resetButton;

//mutable gui controls
var scFolder, pFolder, isDynamic;


//vars for storing the camera
var camerax, cameray;



//global object that stores the state of the UI 
const uiState = {
   mousedown: false,
   rocketDir: keyDir.none,
   accelDir: keyDir.none,
   mousePos: 0
}


//gets the position of the mouse, in world coordinates
function getMouseWorld(mouseX, mouseY) {
   return {
      x: ((mouseX - canvas.width / 2) / world.camera.zoom) + world.camera.x,
      y: ((mouseY - canvas.height / 2) / world.camera.zoom) + world.camera.y,
   }
}

//gets the position of the mouse relative to the canvas
function getMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect();
   return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
   };
}

//Callback that handles when the mouse is pressed down
canvas.addEventListener('mousedown', function (event) {
   world.selectedEntity = false;
   if (world.selectedGui) {
      //hide this gui if mouse is clicked outside of the selected object
      world.selectedGui.destroy();
      world.selectedGui = false;
   }
   if (uiState.mousedown == false) {

      //tell the camera object the mouse has just been pressed down
      uiState.mousePos = getMousePos(canvas, event);
      world.camera.mouseDown(uiState.mousePos.x, uiState.mousePos.y);
   }

   uiState.mousedown = true;
});


//Callback that handles when the mouse is pressed up
canvas.addEventListener('mouseup', function (event) {
   uiState.mousedown = false;

});

//Callback that handles when the mouse is moved
canvas.addEventListener('mousemove', function (event) {
   uiState.mousePos = getMousePos(canvas, event);
   if (uiState.mousedown) {
      world.cameraLockPlayer = false;
      world.camera.mouseDrag(uiState.mousePos.x, uiState.mousePos.y);
   }
});

//Callback that handles when a key is pressed down
window.addEventListener('keydown', function (event) {
   switch (event.key) {
      case "w":
         if (document.activeElement.id == "body" || world.play != gameModes.editor) {
            world.camera.Zoom(uiState.mousePos.x, uiState.mousePos.y, 1);
         }
         break;

      case "s":
         if (document.activeElement.id == "body" || world.play != gameModes.editor) {
            world.camera.Zoom(uiState.mousePos.x, uiState.mousePos.y, -1);
         }
         break;

      case "ArrowRight":
         if (world.play != gameModes.editor) {
            uiState.rocketDir = keyDir.rightDown;
         }
         break;
      case "ArrowLeft":
         if (world.play != gameModes.editor) {
            uiState.rocketDir = keyDir.leftUp;
         }
         break;
      case "ArrowUp":
         if (world.play != gameModes.editor) {
            uiState.accelDir = keyDir.leftUp;
         }
         break;

      case "c":
         if (world.play != gameModes.editor) {
            world.cameraLockPlayer = !world.cameraLockPlayer;
         }

      case "f":
         world.toggleForces()
         world.toggleVelocities()

      case "x":
         if (world.play == gameModes.editor) {
            world.selectedEntity.delete = true;
         }
   }
}

)

//Callback that handles when a key is released
window.addEventListener('keyup', function (event) {
   switch (event.key) {
      case "ArrowRight":
         uiState.rocketDir = keyDir.none;
         break;

      case "ArrowLeft":
         uiState.rocketDir = keyDir.none;
         break;

      case "ArrowUp":
         uiState.accelDir = keyDir.none;
         player.fuelVel = 0;
         break;

      case " ":
         if (world.play == gameModes.rtPlay) {
            pauseGame()
         } else if (world.play == gameModes.rtPaused) {
            playGame()

         }
         break;
   }
})


//sets up the main GUI each time the game is reset
let setupGui = function (lworld) {

   if (gui) {
      gui.destroy();
   }

   gui = new dat.GUI({ name: 'Main' });


   //simulation parameters folder setup
   scFolder = gui.addFolder("Simulation Parameters");
   scFolder.add(lworld, 'gravitationalConstant', 10);
   scFolder.add(lworld, 'deltaT', 0, 1)

   //add new planet folder 
   pFolder = gui.addFolder("Add Planet");
   pFolder.add(lworld, 'newPlanetMass')
   isDynamic = { isDynamic: false };
   pFolder.add(isDynamic, 'isDynamic')

   //button to add new planet/dynamic entity
   var obj = {
      Add_Planet: function () {
         if (lworld.play == gameModes.editor) {
            if (!(isDynamic.isDynamic)) {
               lworld.add(new Planet(ctx, lworld.newPlanetX, lworld.newPlanetY, lworld.newPlanetMass))
            } else {
               lworld.add(new DynamicEntity(ctx, lworld.newPlanetX, lworld.newPlanetY, lworld.newPlanetMass))
            }
         }
      }
   };

   pFolder.add(obj, 'Add_Planet');

   //Camera folder stuff
   gui.addFolder("Camera");
   camerax = gui.add(lworld.camera, 'x');
   cameray = gui.add(lworld.camera, 'y')
   var cameraLock = {
      Toggle_Follow_Player: function () {
         lworld.cameraLockPlayer = !lworld.cameraLockPlayer;
      }
   };

   gui.add(cameraLock, 'Toggle_Follow_Player');

   //PLayer folder, visualization stuff
   var plFolder = gui.addFolder("Player")
   var togForces = {
      Toggle_Show_Forces: function () {
         lworld.toggleForces();
      }
   }
   var togVel = {
      Toggle_Show_Velocity: function () {
         lworld.toggleVelocities();
      }
   }
   var togTrace = {
      Toggle_Trace_Positions: function () {
         lworld.toggleTrace();
      }
   }
   plFolder.add(togVel, 'Toggle_Show_Velocity');
   plFolder.add(togForces, 'Toggle_Show_Forces');
   plFolder.add(togTrace, 'Toggle_Trace_Positions');

   //display the gui
   gui.show();
}

//main control buttons
stopButton = document.getElementById('stop');
playButton = document.getElementById('play');
resetButton = document.getElementById('reset');

//save button pressed callback
let savePressed = function () {
   if (world.play == gameModes.editor) {
      world.selectedEntity = null;
      world.selectedGui = null;
      world.testFolder = null;

      var jsonWorld = JSON.stringify(world)

      download(jsonWorld, "config.txt", ".txt")
   }
}

//read a given input file, parse it, and load it into the world
function readFile(input) {

   let file = input.files[0];
   let fileReader = new FileReader();
   fileReader.readAsText(file);
   fileReader.onload = function () {
      var jsonWorld = fileReader.result;
      backupWorld = saveClone(JSON.parse(jsonWorld), ctx)
    
      setup();

      enableGui(pFolder);
      enableGui(scFolder);

   };

   //alert the user of parsing errors
   fileReader.onerror = function () {
      alert(fileReader.error);
   };

};


//the stop button is pressed
let stopPressed = function () {

   world.play = gameModes.editor;
   world.selectedEntity = false;
   world.cameraLockPlayer = false;

   if (world.selectedGui) {
      world.selectedGui.destroy();
      world.selectedGui = false;
   }

   setup();

   enableGui(pFolder);
   enableGui(scFolder);
}


//the game needs to be played, thus triggering state updates
function playGame() {
   world.selectedEntity = false;

   //save a clone of the editor world so that the editor contents are saved
   if (world.play == gameModes.editor) {
      backupWorld = saveClone(world, ctx)
      console.log(backupWorld)
      if (world.selectedGui) {
         world.selectedGui.destroy();
         world.selectedGui = false;
      }
   }
   world.cameraLockPlayer = true;

   world.play = gameModes.rtPlay;
   player.currentFuel = player.fuelMaxJ;
}

//the game is paused 
function pauseGame() {
   world.play = gameModes.rtPaused;
}

//the play button is pressed
let playPressed = function () {
   if (world.play == gameModes.rtPlay) {
      pauseGame()
   } else if (world.play == gameModes.rtPaused || world.play == gameModes.editor) {
      playGame()
   }
}

//set up the game before the update loop is started
function setup() {

   //already a backup world, meaning the game was in editor mode before
   if (backupWorld) {
      world = saveClone(backupWorld, ctx);
      world.camera.x = 0; 
      world.camera.y = 0;
      console.log(world.camera.x)
      player = world.entities[0];
      uiState.mousePos = 0;

      setupGui(world);
      enableGui(pFolder)
      enableGui(scFolder)

   } else {

      //this is the first time creating the world
      uiState.mousePos = 0;

      world = new World(ctx);
      player = new Rocket(ctx, 0, 0, 100)
      world.add(player)
      world.add(new Planet(ctx, 0, 500, 160000))

      world.entities[1].name = "Lambert IV"
      world.play = gameModes.editor;

      setupGui(world);
   }

}

//draws the grid using the canvas API
function drawGrid() {
   let step = 100;

   if (world.camera.zoom < 0.5) {
      step *= 4;
   }

   //calculate starting and ending coordinates of the grid based on the position of the camera and the zoom level
   let left = -step + Math.ceil((world.camera.x - 1.5 * (canvas.width / 2 / world.camera.zoom)) / step) * step;
   let top = -step + Math.ceil((world.camera.y - 1.5 * (canvas.height / 2 / world.camera.zoom)) / step) * step;
   let right = world.camera.x + 1.5 * (canvas.width / 2 / world.camera.zoom);
   let bottom = world.camera.y + 1.5 * (canvas.height / 2 / world.camera.zoom);

   ctx.clearRect(left, top, right - left, bottom - top);
   ctx.beginPath();

   for (let x = left; x < right; x += step) {
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
   }

   for (let y = top; y < bottom; y += step) {
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
   }

   ctx.strokeStyle = "#BEBEBE";
   ctx.lineWidth = 5 + 1 / Math.pow(world.camera.zoom, 1.1);
   ctx.stroke();

}


//function to update releevant GUI elements each frame
function updateGui() {

   //disable maniulating certain GUI properties while the game is in Play mode
   if (world.play != gameModes.editor) {
      disableGuiExcept(pFolder, []);
      disableGuiExcept(scFolder, ["deltaT"]);
   }

   //update UI display
   if (world.play == gameModes.rtPlay) {
      playButton.innerText = "Pause";
   } else {
      playButton.innerText = "Play";
   }
   camerax.updateDisplay();
   cameray.updateDisplay();


   //render preview of planet to be placed
   if (!pFolder.closed && world.play == gameModes.editor) {

      console.log(world)
      world.ctx.strokeStyle = '#5c5c5c';
      ctx.globalAlpha = 0.5;

      drawCircle(world.ctx, world.camera.x, world.camera.y, massToRad(world.newPlanetMass));
      world.ctx.fillStyle = '#bfbfbf';

      drawCircleFilled(world.ctx, world.camera.x, world.camera.y, massToRad(world.newPlanetMass));
      ctx.globalAlpha = 1.0;
   }

   
}

//helper function to parse world as JSON and download file
function download(data, filename, type) {
   var file = new Blob([data], { type: type });
   if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
   else { // Others
      var a = document.createElement("a"),
         url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
         document.body.removeChild(a);
         window.URL.revokeObjectURL(url);
      }, 0);
   }
}

//handles FPS counter
const times = [];
let fps;

function updateFPS() {
   const now = performance.now();
   while (times.length > 0 && times[0] <= now - 1000) {
     times.shift();
   }
   times.push(now);
   fps = times.length;
}
//renders the basic elements of the UI system
function renderMainUI() {

   updateFPS(); 

   ctx.font = `20px Verdana`;
   ctx.fillText("FPS: " + fps, 40, canvas.height - 10);

   if (!world.cameraLockPlayer) {

      ctx.fillStyle = "#000000"
      ctx.fillRect(canvas.width / 2 - 2.5, canvas.height / 2 + 2.5, 5, 10);
      ctx.fillRect(canvas.width / 2 - 2.5, canvas.height / 2 - 12.5, 5, 10);
      ctx.fillRect(canvas.width / 2 + 2.5, canvas.height / 2 - 2.5, 10, 5);
      ctx.fillRect(canvas.width / 2 - 12.5, canvas.height / 2 - 2.5, 10, 5);

      ctx.font = `20px Verdana`;
      ctx.textAlign = 'center';
      ctx.fillText(world.camera.x.toFixed(0) + ", " + world.camera.y.toFixed(0), canvas.width / 2, canvas.height / 2 - 20)
      ctx.textAlign = 'left';
   }


   ctx.fillStyle = "Red"
   ctx.fillRect(10, 10, player.currentFuel / player.fuelMaxJ * 100, 50)
   ctx.strokeStyle = '#000000';
   ctx.lineWidth = 5;
   ctx.strokeRect(10, 10, 100, 50)

   ctx.textAlign = 'left';
   ctx.fillStyle = "Black"
   ctx.font = `40px Verdana`;

   ctx.fillText(" Fuel:  " + (player.currentFuel / 1000).toFixed(0) + " kJ ", 125, 40);

   ctx.fillStyle = '#ccc'
   ctx.fillRect((canvas.width / 2) - (0.155 * canvas.width), 0, canvas.width * 0.34, 70);
   ctx.strokeStyle = '#5c5c5c'
   ctx.strokeRect((canvas.width / 2) - (0.155 * canvas.width), 0, canvas.width * 0.34, 70);

   ctx.textAlign = 'center'
   ctx.fillStyle = '#5c5c5c'
   ctx.font = `20px Verdana`;

   ctx.fillText(world.play, canvas.width / 2 + 15, 60);
}

//this is the main update loop of the game, which loops continually after the simulation starts
function animate() {

   //TODO: fix resizing bug this creates
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;


   // clear the canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   //apply camera transformation
   world.camera.apply()

   //draw the grid
   drawGrid();
   updateGui() 

   //update camera position to player position if locked
   if (world.cameraLockPlayer) {
      world.camera.x = player.p.x;
      world.camera.y = player.p.y;
   }

   //update player angle
   if (uiState.rocketDir == keyDir.rightDown) {
      player.changeAngle(3)
   } else if (uiState.rocketDir == keyDir.leftUp) {
      player.changeAngle(-3)
   }


   //set global fill settings
   ctx.fillStyle = "Black";
   ctx.lineWidth = 9 + 1 / Math.pow(world.camera.zoom, 1.2);

   //apply rocket booster if the correct keys are being held down (TODO: make booster force an editable property)
   if (uiState.accelDir == keyDir.leftUp && player.currentFuel > 0) {
      if (world.play == gameModes.rtPaused) {
         player.applyBooster(player.boosterForce / 10, world)

      } else if (world.play == gameModes.rtPlay) {
         player.applyBooster(player.boosterForce, world)
      }
   }


   //main update loop code, render, update physically, and update the gui as well
   world.render()
   world.update()
   world.updateGui() //TODO: redundant to have two separate gui update functions
   
   //unapply camera transformation
   world.camera.unapply();

   //update UI elements
   renderMainUI()

   //handle player crash scenario
   if (player.crashed) {
      alert("You Crashed!")
      uiState.rocketDir = keyDir.none;
      uiState.accelDir = keyDir.none;
      stopPressed()
   }

   requestAnimationFrame(animate);
}

setup()
animate();
