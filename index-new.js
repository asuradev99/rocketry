"use strict";

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);


var ctx = canvas.getContext('2d');
var world = new World(ctx);
let player = new Rocket(ctx, world, -800, -100, 100)

var mousePos = 0; 

function getMouseWorld(mouseX, mouseY) {
   return {
      x: ((mouseX - canvas.width / 2)  / world.camera.zoom) + world.camera.x,
      y: ((mouseY - canvas.height / 2) / world.camera.zoom) + world.camera.y, 
   }
}

const uiState = {
    mousedown: false,
}

function getMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect();
   return {
     x: evt.clientX - rect.left,
     y: evt.clientY - rect.top
   };
 }

 let v = new Victor(5, 5);

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
   console.log(event)
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
         player.changeAngle(10)
         break;
      case "ArrowLeft":
         player.changeAngle(-10)
         break;

      

   }
   
   console.log(world.camera.zoom);
 })


//setup world
var gui = new dat.GUI({name: 'My GUI'});
var person = {name: 'Sam'};
gui.addFolder("Simulation Parameters");
gui.add(world, 'gravitationalConstant', 10);
gui.add(world, 'deltaT', 0, 1)
gui.add(world, 'play')
gui.show();

gui.addFolder("Planet");
let newx = gui.add(world, 'newPlanetX');
let newy = gui.add(world, 'newPlanetY')
gui.add(world, 'newPlanetMass')
var obj = { add:function(){
   world.add(new Planet(ctx, world.newPlanetX, world.newPslanetY, world.newPlanetMass))
 }};

gui.add(obj,'add');

function setup() {
   world.add(new Planet(ctx, 0, 0, 160000))
   world.add(player)
   world.entities[1].v.y = -100;
}


function animate() {
  // call again next time we can draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
 // x = x + 1;
  world.camera.apply()
  ctx.fillStyle = "Black";
  ctx.lineWidth = 9 +  1 / Math.pow(world.camera.zoom, 1.2);
  //ctx.translate(-x, -y);
  
  world.render()
  world.update()
  //world.deleteMarked()
  world.updateGui()
  
  world.camera.unapply();

//   ctx.fillStyle = "Red";
//   ctx.font      = "normal 16pt Arial";

//   ctx.fillText( world.camera.zoom, 10, 26);
//   ctx.fillText( " Camera coords: " + world.camera.x + " " + world.camera.y, 10, 46);
//   ctx.fillText( " Mouse coords: " + mousePos.x + " " + mousePos.y, 10, 66);
//   let worldCoords = getMouseWorld(mousePos.x, mousePos.y);
//   ctx.fillText( " World Coords: " + worldCoords.x + " " + worldCoords.y, 10, 86 );
  ctx.fillRect(canvas.width / 2, canvas.height / 2, 10, 10);
  // clear canvas
  //ctx.rotate(x);

  //ctx.translate(x, y);
  requestAnimationFrame(animate);

}
setup()
animate();

