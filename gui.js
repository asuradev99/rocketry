class GuiElement {
    constructor() {
        if(this.constructor == GuiElement) {
            throw new Error("GuiElement cannot be instantiated");
        }
    }
}

