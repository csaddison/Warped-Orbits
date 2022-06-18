// General helper functions and drawing tools

// Importing settings
import { BackgroundSettings as BS } from "./settings.js";

// Helper function for randomizing orbits
export function randomBetween(min, max) {
    return (max - min) * Math.random() + min;
}

// LINEAR INTERPOLATION FOR HEX COLORS
// Taken (with edits) from https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
// lerpColor('#000000', '#ffffff', 0.5)
// returns '#7F7F7F'
export function lerpColor(a, b, amount) {
    var ah = +a.replace("#", "0x"),
        ar = ah >> 16,
        ag = (ah >> 8) & 0xff,
        ab = ah & 0xff,
        bh = +b.replace("#", "0x"),
        br = bh >> 16,
        bg = (bh >> 8) & 0xff,
        bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return (
        "#" +
        (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
    );
}

// Radial Gradient drawing class
export class RadialGradient {
    constructor(posX, posY, diameter) {
        this.pos = {
            x: posX,
            y: posY,
        };
        this.diameter = diameter;
    }

    setColors(color1, color2, steps) {
        this.steps = steps;
        this.colors = [];
        for (var step = 1; step - 1 < steps; step++) {
            this.colors.push(lerpColor(color1, color2, 1 / step));
        }
    }

    draw() {
        noStroke()
        for (var step = 0; step < this.steps; step++) {
            fill(this.colors[step] + String(BS.transparency));
            circle(
                this.pos.x,
                this.pos.y,
                (this.diameter * (this.steps - step)) / this.steps
            );
        }
    }
}

// For orbit path stroke generator
export class LinearFade {

    constructor(color, segments) {
        this.colorSet = this.fade(color, segments)
        this.segments = segments
    }

    splitStroke(vertexArray, segments) {
        var vertexSets = [];
        var sliceSize = Math.floor(vertexArray.length / segments);
        for (var seg = 0; seg < segments - 1; seg++) {
            vertexSets.push(
                vertexArray.slice(seg * sliceSize, (seg + 1) * sliceSize + 1)
            );
        }
        // Last segment split seperately to ensure all vertex point end up in it
        vertexSets.push(vertexArray.slice((segments - 1) * sliceSize));
    
        return vertexSets;
    }

    fade(color, segments) {
        var colors = []
        for (var s=0; s<segments; s++) {
            // adjusts the transparency of each segment, works only with hex color strings (maybe?)
            var transparency = Math.floor(99 * s / segments)
            transparency<10 ? transparency = '0' + String(transparency) : transparency = String(transparency)
            colors.push(color + transparency)
        }
        return colors
    }

    draw(path) {
        this.vertexSet = this.splitStroke(path, this.segments)
        noFill();
        var i=0;
        for (set of this.vertexSet) {
            stroke(this.colorSet[i])
            beginShape();
            for (var vert of set) {
                vertex(vert[0], vert[1]);
            }
            endShape();
            i++
        }
    }
}

export function updatePotenialSelection(planet, potential) {
    if (planet.mouseOver && !potential) {
        return planet
    } else {
        planet.mouseOver = false
        return potential
    }
}

export function selectPlanet(newSelection, oldSelection) {
    // When mouse is clicked, new selection is activated, old selection is deactivated, with logic to ensure the commands are only run if they exist
    if (mouseIsPressed) {
        if (newSelection) {
            newSelection.isSelected = true
            if (oldSelection) {
                oldSelection.isSelected = false;
            }
            return newSelection
        }
    }
}

export function warpToCenter(planet) {
    // Finding inverse transform of planet and applying to parent
    planet.parent.position.x -= planet.position.relative.x
    planet.parent.position.y -= planet.position.relative.y
}

export function applyPositionTranslation(object, translation) {
    object.position.x += translation.x
    object.position.y += translation.y
}

export function findTranslation(object, target) {
    return {
        x: target.x - object.x,
        y: target.y - object.y,
    }
}