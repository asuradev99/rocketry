"use strict";

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);


var ctx = canvas.getContext('2d');
var camera = new Camera(ctx, canvas.width, canvas.height);
var mousePos= 0; 

function getMouseWorld(mouseX, mouseY) {
   return {
      x: ((mouseX - canvas.width / 2)  / camera.zoom) + camera.x,
      y: ((mouseY - canvas.height / 2) / camera.zoom) + camera.y, 
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


// animation : always running loop.
canvas.addEventListener('mousedown', function (event) {
    if(uiState.mousedown == false) {
      mousePos = getMousePos(canvas, event);
      camera.mouseDown(mousePos.x, mousePos.y);
    }
    uiState.mousedown = true;
 });

 canvas.addEventListener('mouseup', function (event) {
    uiState.mousedown = false;

 });


 canvas.addEventListener('mousemove', function (event) {
   mousePos = getMousePos(canvas, event);

   if(uiState.mousedown) {
      camera.mouseDrag(mousePos.x, mousePos.y);
   }
 });

 window.addEventListener('keydown', function (event) {
   switch(event.key) {
      case "w": 
         camera.Zoom(mousePos.x, mousePos.y, 1);
         break;
      case "s": 
         camera.Zoom(mousePos.x, mousePos.y, -1);
         break;
   }

   console.log(camera.zoom);
 })


function animate() {
  // call again next time we can draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
 // x = x + 1;
  camera.apply()
  ctx.fillStyle = "Black";

  //ctx.translate(-x, -y);
  for(let i = 0; i < 1; i++) {
      ctx.fillRect(i, i, 100, 100);
  }
  camera.unapply();

  ctx.fillStyle = "Red";
  ctx.font      = "normal 16pt Arial";

  ctx.fillText( camera.zoom, 10, 26);
  ctx.fillText( " Camera coords: " + camera.x + " " + camera.y, 10, 46);
  ctx.fillText( " Mouse coords: " + mousePos.x + " " + mousePos.y, 10, 66);
  let worldCoords = getMouseWorld(mousePos.x, mousePos.y);
  ctx.fillText( " World Coords: " + worldCoords.x + " " + worldCoords.y, 10, 86 );
  ctx.fillRect(canvas.width / 2, canvas.height / 2, 10, 10);
  // clear canvas
  //ctx.rotate(x);

  //ctx.translate(x, y);
  requestAnimationFrame(animate);

}

animate();

