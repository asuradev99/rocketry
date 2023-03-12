"use strict";

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);


var ctx = canvas.getContext('2d');
var world = new World(ctx);

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
   }

   console.log(world.camera.zoom);
 })


//setup world

function setup() {
   world.entities.push(new Planet(ctx, 0, 0, 160000))
   world.entities.push(new DynamicEntity(ctx, world, -800, -100, 100))
   world.entities[1].v.y = -100;
}


function animate() {
  // call again next time we can draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
 // x = x + 1;
  world.camera.apply()
  ctx.fillStyle = "Black";
  ctx.lineWidth = 10 - world.camera.zoom;
  //ctx.translate(-x, -y);
  for(let i = 0; i < 1; i++) {
      ctx.fillRect(100 , 100, 10, 10);
  }

  world.render()
  world.update()
  world.camera.unapply();

  ctx.fillStyle = "Red";
  ctx.font      = "normal 16pt Arial";

  ctx.fillText( world.camera.zoom, 10, 26);
  ctx.fillText( " Camera coords: " + world.camera.x + " " + world.camera.y, 10, 46);
  ctx.fillText( " Mouse coords: " + mousePos.x + " " + mousePos.y, 10, 66);
  let worldCoords = getMouseWorld(mousePos.x, mousePos.y);
  ctx.fillText( " World Coords: " + worldCoords.x + " " + worldCoords.y, 10, 86 );
  ctx.fillRect(canvas.width / 2, canvas.height / 2, 10, 10);
  // clear canvas
  //ctx.rotate(x);

  //ctx.translate(x, y);
  requestAnimationFrame(animate);

}
setup()
animate();

