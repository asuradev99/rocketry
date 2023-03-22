//Camera - controls the in-game camera 
class Camera {

    //main instantiation
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.x = 0;
      this.y = 0;
      this.zoom = 1;
      this.zoomFactor = 2;
      this.zoomTarget = 1; 
      this.startX = 0;
      this.startY = 0;

      this.width = width; 
      this.height = height;
    }
  
    //mouse is being dragged function
    mouseDrag(mouseX, mouseY) {
      this.x = this.startX - (mouseX - this.width / 2) / this.zoom;
      this.y = this.startY - (mouseY - this.height / 2) / this.zoom;
    }
  
    //the mouse is pressed
    mouseDown(mouseX, mouseY) {
      this.startX =  this.x + (mouseX - this.width / 2) / this.zoom;
      this.startY =  this.y + (mouseY - this.height / 2) / this.zoom;
    }

    //zoom in / zoom out
    Zoom(mouseX, mouseY, dir) {
      this.zoomTarget *= Math.pow(this.zoomFactor, dir);
      this.zoomTarget = Math.max(Math.min(this.zoomTarget, 8), 0.125);
      
    }
  
    //apply the camera transformation to make all rendered objects appear at the correct position relative to the camera
    apply() {
      this.ctx.translate(this.width / 2, this.height / 2);
      this.ctx.scale(this.zoom, this.zoom);
      this.ctx.translate(-this.x, -this.y);
      this.zoom += (this.zoomTarget - this.zoom) * 0.2;

    }

    //unapply the camera transformation
    unapply() {
      this.ctx.resetTransform();
    }
  }
