// Background Star Renderer

import { BackgroundSettings as BS } from "./settings.js";
import { RadialGradient, randomBetween } from "./tools.js";

class Star {
    constructor(posX, posY) {
        this.pos = {
            x: posX,
            y: posY,
        };

        this.color = BS.starColor;
        this.size = randomBetween(BS.starScaleMin, BS.starScaleMax);
        this.t = Math.random() * 2 * Math.PI;
    }

    draw() {
        var opacity =
            BS.minOpacity + sin(this.t) * (BS.maxOpacity - BS.minOpacity);
        fill(this.color + String(opacity));
        var rescaledSize =
            this.size + sin(this.t / this.size) * (BS.scaleFactor / 10);
        circle(this.pos.x, this.pos.y, rescaledSize);
        this.t += BS.twinkleSpeed / 10;
    }
}

export default class Starfield {
    constructor(width, height) {
        // Generating radial background gradient
        this.field = {
            background: new RadialGradient(
                width / 2,
                height / 2,
                Math.sqrt(width ** 2 + height ** 2)
            ),
            stars: [],
        };
        this.field.background.setColors(
            BS.bgColorA,
            BS.bgColorB,
            BS.gradientSteps
        );
        for (var n = 0; n < BS.numStars; n++) {
            this.field.stars.push(
                new Star(Math.random() * width, Math.random() * height)
            );
        }
    }

    draw() {
        this.field.background.draw();
        for (var star of this.field.stars) {
            star.draw();
        }
    }
}
