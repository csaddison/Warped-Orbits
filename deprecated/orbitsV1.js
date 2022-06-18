// Warped Orbits
// 9/18/21

/////////////////////////////////////////////////////////////////////////////////////////


const margin = .9
let w = margin * window.innerWidth;
let h = margin * window.innerHeight;
var solarSystem = {
    sun: null,
    planets: []
}
const defaultScale = 20;

let solarParams = {
    Planets: 1,
    PlanetsMin: 1,
    PlanetsMax: 3,
    PlanetsStep: 1
}

var guiSystem;
var guiPlanets;

let speed = 3
let timeout = 300

var selectedPlanet;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



class Sun {

    constructor(x, y) {
        this.position = {
            x: x,
            y: y
        }
        this.rotation = 1

        this.sunParams = {
            Color: '#ffff00',
            Scale: 2 * defaultScale,
            ScaleMin: 2 * defaultScale,
            ScaleMax: 150,
            ScaleStep: 1,
        }
        guiSystem.addObject(this.sunParams)
    }

    draw() {
        fill(this.sunParams.Color)
        noStroke()
        circle(this.position.x, this.position.y, this.sunParams.Scale)
    }
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



class Planet {

    constructor(parent) {
        this.planetParams = {
            Albedo: '#8a2be2',
            Scale: defaultScale,
            Distance: defaultScale,
            Eccentricity: 0,
            EccentricityMin: 0,
            EccentricityMax: .95,
            EccentricityStep: .05,
            Argument: 0,
            ArgumentMax: 360,
            ArgumentStep:1
        }
        guiPlanets.addObject(this.planetParams)

        this.parent = parent;

        this.position = {
            r: null,
            theta: 0,
            x: null,
            y: null
        }

        this.positionTrail = []
        
    }

    _KeplerEqn(a, e, theta) {
        var r = a * (1 - e**2) / (1 + e * Math.cos(theta))
        return r
    }

    updateOrbit() {
        this._calcSemiMajorLength()
        let angle = this.position.theta + this.parent.rotation + degreeToRad(this.planetParams.Argument)
        this.position.r = this._KeplerEqn(this.semiMajorLength, this.planetParams.Eccentricity, angle)
        this.position.x = this.parent.position.x + (this.position.r * Math.cos(this.position.theta))
        this.position.y = this.parent.position.y + (this.position.r * Math.sin(this.position.theta))
        this.position.theta += speed/100
    }

    _calcSemiMajorLength() {
        this.semiMajorLength = defaultScale * Math.cbrt(Math.pow(this.planetParams.Distance, 2))
    }


    drawTrails(timeout) {
        this.positionTrail.push([this.position.x, this.position.y])
        if (this.positionTrail.length > timeout) {
            this.positionTrail.shift()
        }
        noFill()
        stroke('white')
        beginShape()
        for (var  vert of this.positionTrail) {
            vertex(vert[0], vert[1])
        }
        endShape()
    }

    draw() {
        fill(this.planetParams.Albedo)
        noStroke()
        circle(this.position.x, this.position.y, this.planetParams.Scale)
    }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function degreeToRad(angle) {
    return angle * Math.PI / 180
}


function checkForNewPlanets() {
    if (solarSystem.planets.length != solarParams.Planets) {
        guiPlanets.hide()
        generatePlanets()
    }
}


function generatePlanets() {
    guiPlanets = createGui('Edit Orbits')
    guiPlanets.setPosition(20, 250)

    solarSystem.planets = [];

    for (var n=0; n<solarParams.Planets; n++) {
        solarSystem.planets.push(new Planet(solarSystem.sun))
        solarSystem.planets[n].planetParams.Distance = (n+1) * defaultScale
    }
}


var mouseOverPlanet = {
    in: function _mIn() {selectedPlanet = }
}

/////////////////////////////////////////////////////////////////////////////////////////////




function setup() {
    createCanvas(w, h);

    guiSystem = createGui('Warped Orbits')
    guiSystem.addObject(solarParams)

    solarSystem.sun = new Sun(w/2, h/2)
    generatePlanets()
    if (solarSystem[0]) {
        console.log('true')
    } else {
        console.log('no')
    }

}



function draw() {
    background(0)

    checkForNewPlanets()

    solarSystem.sun.draw()
    for (planet of solarSystem.planets) {
        planet.updateOrbit()
        planet.drawTrails(timeout)
        planet.draw()
    
    }

}



function windowResized() {
    resizeCanvas(margin * window.innerWidth, margin * window.innerHeight);
    generatePlanets()
}