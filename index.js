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

function setup() {
  createCanvas(windowWidth, windowHeight);
  canvas.addEventListener('contextmenu', event => event.preventDefault());

  camera = new Camera();
}

function draw() {
  background(220);

  camera.update();
  camera.apply();

  // Draw your content here, e.g.
  rect(100, 100, 50, 50);
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