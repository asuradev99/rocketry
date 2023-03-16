"use strict";

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var ctx, world, player, mousePos; 

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

      newx.updateDisplay();
      newy.updateDisplay();
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
      case "e":
         world.add(new Planet(ctx, world.newPlanetX, world.newPlanetY, world.newPlanetMass))
         break;
      case "ArrowRight":
         uiState.rocketDir = keyDir.rightDown;
         //player.changeAngle(10)
         break;
      case "ArrowLeft":
         uiState.rocketDir = keyDir.leftUp;
        // player.changeAngle(-10)
         break;
      case "ArrowUp":
         uiState.accelDir = keyDir.leftUp;
         //player.changeAngle(10)
         break;
      case "r":
         let cameraSave = world.camera;

         world.reset();
         setup();

         world.camera = cameraSave; 

         break;
      case " ":
         world.play = !world.play;
         break;
   }
   
 })

 window.addEventListener('keyup', function (event) {
   console.log(event)
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
   }
   
 })
//setup world
var gui = new dat.GUI({name: 'My GUI'});
var person = {name: 'Sam'};
gui.addFolder("Simulation Parameters");
gui.add(world, 'gravitationalConstant', 10);
gui.add(world, 'deltaT', 0, 1)
gui.show();

gui.addFolder("Planet");
let newx = gui.add(world, 'newPlanetX');
let newy = gui.add(world, 'newPlanetY')
gui.add(world, 'newPlanetMass')

var obj = { add:function(){
   world.add(new Planet(ctx, world.newPlanetX, world.newPslanetY, world.newPlanetMass))
 }};

gui.add(obj,'add');

gui.addFolder("Camera");
let camerax = gui.add(world.camera, 'x');
let cameray = gui.add(world.camera, 'y')
var cameraLock = { add:function(){
   world.cameraLockPlayer = !world.cameraLockPlayer;
 }};

gui.add(cameraLock, 'add');
function setup() {

   ctx = canvas.getContext('2d');
   world = new World(ctx);
   player = new Rocket(ctx, world, -800, 0, 100)

   mousePos = 0; 
   world.add(new Planet(ctx, 1000, 0, 1600000))
   world.add(player)
   //world.entities[1].v.y = -100;
}


function animate() {
  // call again next time we can draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
 // x = x + 1;
  world.camera.apply()
  if(world.cameraLockPlayer) {

      world.camera.x = player.p.x; 
      world.camera.y = player.p.y;
  }

  ctx.fillStyle = "Black";
  ctx.lineWidth = 9 +  1 / Math.pow(world.camera.zoom, 1.2);
  //ctx.translate(-x, -y);
   if(uiState.accelDir == keyDir.leftUp && player.currentFuel > 0) {
      player.applyBooster(20000)

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

