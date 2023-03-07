class World {
    constructor() {
        this.camera = new Camera();
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
    render() {
        this.entities.forEach(function (item, index) {
            item.render();
        })
    }
}