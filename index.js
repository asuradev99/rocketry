console.log("Hello World")

var w = window.innerWidth;
var h = window.innerHeight;  


window.onresize = function() {
  // assigns new values for width and height variables
  console.log("Hello World")
  w = window.innerWidth;
  h = window.innerHeight;  
  resizeCanvas(w,h);
}
let camera;
let world; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  canvas.addEventListener('contextmenu', event => event.preventDefault());

  camera = new Camera();
  world = new World();
  world.entities.push(new Planet(0, 0, 50000));
}

function draw() {
  background(0);


  // Draw your content here, e.g.
 
  
  camera.update();
  camera.apply();
  
  world.render();
}

function mousePressed() {
  camera.mousePressed();
}

function mouseDragged() {
  camera.mouseDragged();
}

function mouseWheel(event) {
  camera.mouseWheel(event);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}