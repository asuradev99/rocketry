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
  world.entities.push(new Planet(20000,0, 8000000));

  world.entities.push(new DynamicEntity(world, 0, 0, 1))
  world.entities[1].v = createVector(0, 200);
}

function draw() {
  background(0);

  push();
  // Draw your content here, e.g.
 
  
  camera.update();
  camera.apply();
  
  world.render();
  world.update();
  pop(); 
  fill(255, 0, 0);
  text(camera.camX + " " + camera.camY + " " + camera.zoom, 10, 10, 70, 80);

  
  rect(-5 + w/2, -5 + h/2, 5, 5);
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