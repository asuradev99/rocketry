class Camera {
    constructor() {
      this.camX = 0;
      this.camY = 0;
      this.zoom = 1;
      this.targetZoom = 1;
      this.startX = 0;
      this.startY = 0;
    }
  
    mousePressed() {
      if (mouseButton === RIGHT) {
        this.startX = this.camX + mouseX / this.zoom;
        this.startY = this.camY + mouseY / this.zoom;
      }
    }
  
    mouseDragged() {
      if (mouseButton === RIGHT) {
        this.camX = this.startX - mouseX / this.zoom;
        this.camY = this.startY - mouseY / this.zoom;
      }
    }
  
    mouseWheel(event) {
      const mouseXWorld = (mouseX - width / 2) / this.zoom + this.camX;
      const mouseYWorld = (mouseY - height / 2) / this.zoom + this.camY;
  
      this.targetZoom += event.delta * 0.001 * this.zoom;
      this.targetZoom = constrain(this.targetZoom, 0.01, 10);
  
      const newMouseXWorld = (mouseX - width / 2) / this.zoom + this.camX;
      const newMouseYWorld = (mouseY - height / 2) / this.zoom + this.camY;
  
      this.camX += mouseXWorld - newMouseXWorld;
      this.camY += mouseYWorld - newMouseYWorld;
    }
  
    update() {
      // Interpolate zoom towards targetZoom
      const zoomSpeed = 0.5 * sqrt(this.zoom);
      this.zoom += (this.targetZoom - this.zoom) ;
    }
  
    apply() {
      translate(width / 2, height / 2);
      scale(this.zoom);
      translate(-this.camX, -this.camY);
    }

  }
