"use strict";

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var ctx, world, backupWorld, player, mousePos, gui, playButton, stopButton, resetButton;
backupWorld = null;
gui = null; 
//mutable gui contorls
var scFolder, pFolder;

var camerax, cameray;

ctx = canvas.getContext('2d');
world = new World(ctx);
player = new Rocket(ctx, world, -800, -100, 100)

mousePos = 0;

const keyDir = {
   none: 0,
   leftUp: 1,
   rightDown: 2
}

const uiState = {
   mousedown: false,
   rocketDir: keyDir.none,
   accelDir: keyDir.none,

}



function getMouseWorld(mouseX, mouseY) {
   return {
      x: ((mouseX - canvas.width / 2) / world.camera.zoom) + world.camera.x,
      y: ((mouseY - canvas.height / 2) / world.camera.zoom) + world.camera.y,
   }
}


function getMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect();
   return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
   };
}


// animation : always running loop.
canvas.addEventListener('mousedown', function (event) {
   world.selectedEntity = false;
   if (world.selectedGui) {
      world.selectedGui.destroy();
      world.selectedGui = false;
   }
   if (uiState.mousedown == false) {
      mousePos = getMousePos(canvas, event);
      world.camera.mouseDown(mousePos.x, mousePos.y);
   }
   uiState.mousedown = true;
});

canvas.addEventListener('mouseup', function (event) {
   uiState.mousedown = false;

});


canvas.addEventListener('mousemove', function (event) {
   mousePos = getMousePos(canvas, event);


   if (uiState.mousedown) {
      world.camera.mouseDrag(mousePos.x, mousePos.y);
   }


});

window.addEventListener('keydown', function (event) {

   switch (event.key) {
      case "w":
         if (document.activeElement.id == "body" || world.play != gameModes.editor) {

            world.camera.Zoom(mousePos.x, mousePos.y, 1);
         }
         break;

      case "s":
         if (document.activeElement.id == "body" || world.play != gameModes.editor) {
            world.camera.Zoom(mousePos.x, mousePos.y, -1);
         }
         break;

      case "ArrowRight":
         if (world.play != gameModes.editor) {
            uiState.rocketDir = keyDir.rightDown;
         }
         //player.changeAngle(10)
         break;
      case "ArrowLeft":
         if (world.play != gameModes.editor) {
            uiState.rocketDir = keyDir.leftUp;
         }
         // player.changeAngle(-10)
         break;
      case "ArrowUp":
         if (world.play != gameModes.editor) {
            uiState.accelDir = keyDir.leftUp;
         }
         //player.changeAngle(10)
         break;
      case "r":
         let cameraSave = world.camera;

         world.reset();
         setup();
         world.camera = cameraSave;
         break;

   }
}

)


function pauseGame() {

}

window.addEventListener('keyup', function (event) {
   switch (event.key) {
      case "ArrowRight":
         uiState.rocketDir = keyDir.none;
         //player.changeAngle(10)
         break;
      case "ArrowLeft":
         uiState.rocketDir = keyDir.none;
         // player.changeAngle(-10)
         break;
      case "ArrowUp":
         uiState.accelDir = keyDir.none;
         player.fuelVel = 0;
         break;

      case " ":
         if (world.play == gameModes.rtPlay) {
            world.play = gameModes.rtPaused;
            playButton.innerText = "Play";
         } else if (world.play == gameModes.rtPaused) {
            world.play = gameModes.rtPlay;
            playButton.innerText = "Pause";

         }
         break;
   }
})

let setupGui = function (lworld) {
   if(gui) {
      gui.destroy();
   }
   gui = new dat.GUI({ name: 'My GUI' });

   scFolder = gui.addFolder("Simulation Parameters");
   scFolder.add(lworld, 'gravitationalConstant', 10);
   scFolder.add(lworld, 'deltaT', 0, 1)

   pFolder = gui.addFolder("Add Planet");
   pFolder.add(lworld, 'newPlanetMass')

   var obj = {
      Add_Planet: function () {
         if (lworld.play == gameModes.editor) {
            lworld.add(new Planet(ctx, lworld.newPlanetX, lworld.newPlanetY, lworld.newPlanetMass))
         }
      }
   };

   pFolder.add(obj, 'Add_Planet');

   pFolder.close();

   gui.addFolder("Camera");
   camerax = gui.add(lworld.camera, 'x');
   cameray = gui.add(lworld.camera, 'y')
   var cameraLock = {
      Toggle_Follow_Player: function () {
         lworld.cameraLockPlayer = !lworld.cameraLockPlayer;
      }
   };

   gui.add(cameraLock, 'Toggle_Follow_Player');

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


   plFolder.add(togVel, 'Toggle_Show_Velocity');
   plFolder.add(togForces, 'Toggle_Show_Forces');


   gui.show();
}

stopButton = document.getElementById('stop');
playButton = document.getElementById('play');
resetButton = document.getElementById('reset');

resetButton.onclick = function () {
   
}
let savePressed = function () {
   var jsonWorld = JSON.stringify(world)

   download(jsonWorld, "config.txt", ".txt")
   
   // // world.entities.forEach(item => {
   // //    console.log(JSON.stringify(item))
   // // });
}

function readFile(input){
  
   let file = input.files[0]; 
   let fileReader = new FileReader(); 
   fileReader.readAsText(file); 
   fileReader.onload = function() {
     var jsonWorld = fileReader.result;
     backupWorld = saveClone(JSON.parse(jsonWorld), ctx)
     setup();
         
      enableGui(pFolder);
      enableGui(scFolder);
   
   }; 
   fileReader.onerror = function() {
     alert(fileReader.error);
   }; 

 };



let stopPressed = function () {

   world.play = gameModes.editor;
   playButton.innerText = "Play";
   world.selectedEntity = false;
   if (world.selectedGui) {
      world.selectedGui.destroy();
      world.selectedGui = false;
   }
   world.cameraLockPlayer = false;

   world.reset();
   setup();

   enableGui(pFolder);
   enableGui(scFolder);
}


let playPressed = function () {
   console.log("onclick function")

   if (world.play == gameModes.rtPlay) {
      world.play = gameModes.rtPaused;
   } else if (world.play == gameModes.rtPaused || world.play == gameModes.editor) {
      world.selectedEntity = false;
      if (world.selectedGui && world.play == gameModes.editor) {
         world.selectedGui.destroy();
         world.selectedGui = false;
      }
      if (world.play == gameModes.editor) {
         backupWorld = world.saveClone();
      }
      world.cameraLockPlayer = true;

      world.play = gameModes.rtPlay;

   }
}

function setup() {

   ctx = canvas.getContext('2d');

   if (backupWorld) {
      world = backupWorld.saveClone();
      player = world.entities[0];


      setupGui(world);

      mousePos = 0;

      enableGui(pFolder)
      enableGui(scFolder)


   } else {

      //world = new World(ctx);
      player = new Rocket(ctx, 0, 0, 100)
      world.add(player)

      mousePos = 0;
      //world.add(new Planet(ctx, 1000, 0, 1600000))
      world.add(new DynamicEntity(ctx, -500, -500, 1000))
      world.add(new DynamicEntity(ctx, -500, -700, 1000))

      //world.add(new DynamicEntity(ctx, world, -500, -300, 1000))


      world.play = gameModes.editor;

      setupGui(world);
   }
   //world.entities[1].v.y = -100;
}

function drawGrid() {
   let step = 100;
   let left = -step + Math.ceil((world.camera.x - (canvas.width / 2 / world.camera.zoom)) / step) * step;
   let top = -step + Math.ceil((world.camera.y - (canvas.height / 2 / world.camera.zoom)) / step) * step;
   let right = world.camera.x + (canvas.width / 2 / world.camera.zoom);
   let bottom = world.camera.y + (canvas.height / 2 / world.camera.zoom);
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


function animate() {
   if (world.play != gameModes.editor) {
      disableGuiExcept(pFolder, []);
      disableGuiExcept(scFolder, ["deltaT"]);
   }

   if (world.play == gameModes.rtPlay) {
      playButton.innerText = "Pause";
   } else {
      playButton.innerText = "Play";
   }
   camerax.updateDisplay();
   cameray.updateDisplay();

   // call again next time we can draw
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   // x = x + 1;
   world.camera.apply()
   drawGrid();

   if (world.cameraLockPlayer) {

      world.camera.x = player.p.x;
      world.camera.y = player.p.y;
   }

   ctx.fillStyle = "Black";
   ctx.lineWidth = 9 + 1 / Math.pow(world.camera.zoom, 1.2);
   //ctx.translate(-x, -y);
   if (uiState.accelDir == keyDir.leftUp && player.currentFuel > 0) {
      if (world.play == gameModes.rtPaused) {
         player.applyBooster(2000, world)

      } else if (world.play == gameModes.rtPlay) {
         player.applyBooster(20000, world)

      }

   }

   if (!pFolder.closed) {
      world.ctx.strokeStyle = '#5c5c5c';
      ctx.globalAlpha = 0.5;
      drawCircle(world.ctx, world.camera.x, world.camera.y, massToRad(world.newPlanetMass));
      world.ctx.fillStyle = '#bfbfbf';

      drawCircleFilled(world.ctx, world.camera.x, world.camera.y, massToRad(world.newPlanetMass));
      ctx.globalAlpha = 1.0;

   }

   world.render()
   world.update()
   //world.deleteMarked()
   world.updateGui()

   world.camera.unapply();


   if (uiState.rocketDir == keyDir.rightDown) {
      player.changeAngle(3)
   } else if (uiState.rocketDir == keyDir.leftUp) {
      player.changeAngle(-3)
   }
   //   ctx.fillText( " Mouse coords: " + mousePos.x + " " + mousePos.y, 10, 66);
   //   let worldCoords = getMouseWorld(mousePos.x, mousePos.y);
   //   ctx.fillText( " World Coords: " + worldCoords.x + " " + worldCoords.y, 10, 86 );
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
   ctx.fillText(" Fuel:  " + player.currentFuel / 1000 + " kJ ", 125, 40);

   ctx.fillStyle = '#ccc'
   ctx.fillRect((canvas.width / 2) - (0.075 * canvas.width), 0, canvas.width * 0.17, 70);
   ctx.strokeStyle = '#5c5c5c'
   ctx.strokeRect((canvas.width / 2) - (0.075 * canvas.width), 0, canvas.width * 0.17, 70);

   ctx.textAlign = 'center'
   ctx.fillStyle = '#5c5c5c'
   ctx.font = `20px Verdana`;

   ctx.fillText(world.play, canvas.width / 2 + 15, 60);

   if (player.crashed) {
      alert("You Crashed!")
      uiState.rocketDir = keyDir.none;
      uiState.accelDir = keyDir.none;
      world.reset()
      setup()
   }
   // clear canvas
   //ctx.rotate(x);

   //ctx.translate(x, y);
   requestAnimationFrame(animate);

}

setup()

animate();

function download(data, filename, type) {
   var file = new Blob([data], {type: type});
   if (window.navigator.msSaveOrOpenBlob) // IE10+
       window.navigator.msSaveOrOpenBlob(file, filename);
   else { // Others
       var a = document.createElement("a"),
               url = URL.createObjectURL(file);
       a.href = url;
       a.download = filename;
       document.body.appendChild(a);
       a.click();
       setTimeout(function() {
           document.body.removeChild(a);
           window.URL.revokeObjectURL(url);  
       }, 0); 
   }
}
