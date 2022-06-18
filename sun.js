export default class Sun {
    constructor(x, y, scale) {
        this.position = {
            x: x,
            y: y,
        };
        this.scale =  scale;
        this.color = "#ffff00";
    }

    draw() {
        noStroke();
        fill(this.color);
        circle(this.position.x, this.position.y, this.scale);
    }
}
