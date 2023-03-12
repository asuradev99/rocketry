class World {
    constructor(ctx) {
        this.ctx = ctx;
        this.camera = new Camera(ctx, window.innerWidth, window.innerHeight);
        this.entities = [];
        this.play = true;
        this.gravitationalConstant = 1;
        this.ppm = 100;
        this.deltaT = 0.005;

    }
    update() {
        if(this.play) {
            this.entities.forEach(function (item, index) {
                item.update();
            })
        }
    }
    add(a) {
        this.entities.push(a)
    }
    render() {
        //
        this.entities.forEach(function (item, index) {
            item.render();
        })
    }
}