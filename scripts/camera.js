class Camera {
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
  
    
    mouseDrag(mouseX, mouseY) {
      this.x = this.startX - (mouseX - this.width / 2) / this.zoom;
      this.y = this.startY - (mouseY - this.height / 2) / this.zoom;
    }
  
    mouseDown(mouseX, mouseY) {

      this.startX =  this.x + (mouseX - this.width / 2) / this.zoom;
      this.startY =  this.y + (mouseY - this.height / 2) / this.zoom;
    }

    Zoom(mouseX, mouseY, dir) {
      //const mouseXWorld = (mouseX) / this.zoomTarget + this.x;
      //const mouseYWorld = (mouseY) / this.zoomTarget + this.y;
      
      this.zoomTarget *= Math.pow(this.zoomFactor, dir);
      this.zoomTarget = Math.max(Math.min(this.zoomTarget, 8), 0.125);

      // const newMouseXWorld = (mouseX) / this.zoomTarget + this.x;
      // const newMouseYWorld = (mouseY) / this.zoomTarget + this.y;
      
      // // console.log(mouseX)
      // this.x += mouseXWorld - newMouseXWorld;
      // this.y += mouseYWorld - newMouseYWorld;
      
    }

    // mouseWheel(event) {
    //   const mouseXWorld = (mouseX - width / 2) / this.zoom + this.camX;
    //   const mouseYWorld = (mouseY - height / 2) / this.zoom + this.camY;
  
    //   this.targetZoom += event.delta * 0.001 * this.zoom;
    //   this.targetZoom = constrain(this.targetZoom, 0.01, 10);
  
    //   const newMouseXWorld = (mouseX - width / 2) / this.zoom + this.camX;
    //   const newMouseYWorld = (mouseY - height / 2) / this.zoom + this.camY;
  
    //   this.camX += mouseXWorld - newMouseXWorld;
    //   this.camY += mouseYWorld - newMouseYWorld;
    // }
  
    apply() {
      // Interpolate zoom towards targetZoom
      //const zoomSpeed = 0.5 * Math.sqrt(this.zoom);
      //this.zoom += (this.targetZoom - this.zoom) ;
    //  this.ctx.translate(this.width / 2, this.height / 2);
     // this.ctx.scale(this.zoom, this.zoom);
      this.ctx.translate(this.width / 2, this.height / 2);
      this.ctx.scale(this.zoom, this.zoom);
      this.ctx.translate(-this.x, -this.y);
      this.zoom += (this.zoomTarget - this.zoom) * 0.2;

    }

    unapply() {
      // this.ctx.translate(-this.width / 2, -this.height / 2);
      // this.ctx.scale(1 / this.zoom, 1 / this.zoom);
      // this.ctx.translate(this.x, this.y);
      this.ctx.resetTransform();
    }

    // clone() {
    //   let newCamera = new Camera(this.ctx, this.width, this.height);

    //   newCamera.x = this.x;
    //   newCamera.y = this.y;
    //   newCamera.zoom = this.zoom;
    //   newCamera.zoomFactor = this.zoomFactor;
    //   newCamera.zoomTarget = this.zoomTarget; 
    //   newCamera.startX = this.startX;
    //   newCamera.startY = this.startY;

    //   return newCamera

    // }
  }
