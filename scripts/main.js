"use strict";

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var ctx, world, player, mousePos, gui, playButton, stopButton, resetButton; 

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
      x: ((mouseX - canvas.width / 2)  / world.camera.zoom) + world.camera.x,
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
    if(uiState.mousedown == false) {
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
   

   if(uiState.mousedown) {
      world.camera.mouseDrag(mousePos.x, mousePos.y);
   }


 });

 window.addEventListener('keydown', function (event) {
   switch(event.key) {
      case "w": 
         world.camera.Zoom(mousePos.x, mousePos.y, 1);
         break;
      case "s": 
         world.camera.Zoom(mousePos.x, mousePos.y, -1);
         break;

      case "ArrowRight":
         if(world.play != gameModes.editor) {
            uiState.rocketDir = keyDir.rightDown;
         }
         //player.changeAngle(10)
         break;
      case "ArrowLeft":
         if(world.play != gameModes.editor) {
            uiState.rocketDir = keyDir.leftUp;
         }
        // player.changeAngle(-10)
         break;
      case "ArrowUp":
         if(world.play != gameModes.editor) {
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
   
 })
function pauseGame() {

}

window.addEventListener('keyup', function (event) {
   switch(event.key) {
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
         if(world.play == gameModes.rtPlay) {
            world.play = gameModes.rtPaused;
            playButton.innerText = "Play";
         } else if(world.play == gameModes.rtPaused) {
            world.play = gameModes.rtPlay;
            playButton.innerText = "Pause";
      
         }
         break;
   }
   
 })

gui = new dat.GUI({name: 'My GUI'});

scFolder = gui.addFolder("Simulation Parameters");
scFolder.add(world, 'gravitationalConstant', 10);
scFolder.add(world, 'deltaT', 0, 1)

pFolder = gui.addFolder("Add Planet");
pFolder.add(world, 'newPlanetMass')

var obj = { Add_Planet:function(){
   if(world.play == gameModes.editor) {
      world.add(new Planet(ctx, world.newPlanetX, world.newPlanetY, world.newPlanetMass))
   }
   }};

pFolder.add(obj,'Add_Planet');

pFolder.close();

gui.addFolder("Camera");
camerax = gui.add(world.camera, 'x');
cameray = gui.add(world.camera, 'y')
var cameraLock = { Toggle_Follow_Player:function(){
   world.cameraLockPlayer = !world.cameraLockPlayer;
   }};

gui.add(cameraLock, 'Toggle_Follow_Player');

var plFolder = gui.addFolder("Player")

var togForces = { Toggle_Show_Forces:function(){
   world.toggleForces(); 
}}

var togVel = { Toggle_Show_Velocity:function(){
   world.toggleVelocities(); 
}}


plFolder.add(togVel, 'Toggle_Show_Velocity');
plFolder.add(togForces, 'Toggle_Show_Forces');


gui.show();

stopButton = document.getElementById('stop'); 
playButton = document.getElementById('play');
resetButton = document.getElementById('reset');

resetButton.onclick = function() {
   world.reset();
   setup();
 }

let stopPressed = function() {
   world.play = gameModes.editor;
   playButton.innerText = "Play";
   
}


let playPressed = function() {
   console.log("onclick function")
   if(world.play == gameModes.rtPlay) {
      world.play = gameModes.rtPaused;
      playButton.innerText = "Play";
   } else if(world.play == gameModes.rtPaused || world.play == gameModes.editor) {
      world.play = gameModes.rtPlay;
      playButton.innerText = "Pause";
   }
}

function setup() {

   ctx = canvas.getContext('2d');
   //world = new World(ctx);
   player = new Rocket(ctx, world, -800, 0, 100)

   mousePos = 0; 
   world.add(new Planet(ctx, 1000, 0, 1600000))
   world.add(player)

   world.play = gameModes.editor;
   //world.entities[1].v.y = -100;
}

function drawGrid() {
   let step = 100 / world.camera.zoom;
   let left = 0.5 + Math.ceil((world.camera.x - canvas.width / (2 * world.camera.zoom)) * 10  / step) * step;
   let top = 0.5 + Math.ceil((world.camera.y - canvas.height / (2 * world.camera.zoom)) * 10 / step) * step;
   let right = canvas.width / (2 * world.camera.zoom) * 10;
   let bottom = canvas.height / (2 * world.camera.zoom) * 10;
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
   ctx.lineWidth = 5 +  1 / Math.pow(world.camera.zoom, 1.1);
   ctx.stroke();
}


function animate() {
   if(world.play != gameModes.editor) {
      pFolder.close();
      scFolder.close();
   }

   camerax.updateDisplay();
   cameray.updateDisplay();

  // call again next time we can draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);

 // x = x + 1;
  world.camera.apply()
  drawGrid();

  if(world.cameraLockPlayer) {

      world.camera.x = player.p.x; 
      world.camera.y = player.p.y;
  }

  ctx.fillStyle = "Black";
  ctx.lineWidth = 9 +  1 / Math.pow(world.camera.zoom, 1.2);
  //ctx.translate(-x, -y);
   if(uiState.accelDir == keyDir.leftUp && player.currentFuel > 0) {
      if(world.play == gameModes.rtPaused) {
         player.applyBooster(2000)

      } else if(world.play == gameModes.rtPlay) {
         player.applyBooster(20000)

      }

   }
  
  world.render()
  world.update()
  //world.deleteMarked()
  world.updateGui()
  
  world.camera.unapply();
  

  if(uiState.rocketDir == keyDir.rightDown) {
      player.changeAngle(3)
  } else if(uiState.rocketDir == keyDir.leftUp) {
      player.changeAngle(-3)
  }
//   ctx.fillText( " Mouse coords: " + mousePos.x + " " + mousePos.y, 10, 66);
//   let worldCoords = getMouseWorld(mousePos.x, mousePos.y);
//   ctx.fillText( " World Coords: " + worldCoords.x + " " + worldCoords.y, 10, 86 );
  if(!world.cameraLockPlayer) {

   ctx.fillStyle = "#000000"
   ctx.fillRect(canvas.width / 2 - 2.5, canvas.height / 2 + 2.5, 5, 10);
   ctx.fillRect(canvas.width / 2 - 2.5, canvas.height / 2 - 12.5, 5, 10);
   ctx.fillRect(canvas.width / 2 + 2.5 , canvas.height / 2 - 2.5, 10, 5);
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

  
  ctx.fillStyle = "Black"
  ctx.fillText( " Fuel:  " + player.currentFuel / 1000 + " kJ ", 125, 40);

  ctx.font = `40px Verdana`;
  ctx.fillText(player.currentFuel, 10, 106);
  ctx.fillText(player.v.length(), 10, 126);
  

  ctx.fillStyle = "Black"
  ctx.fillText( " Mode:  " + world.play, 500, 40);
  
  if(player.crashed) {
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

