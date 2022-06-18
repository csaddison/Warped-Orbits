// Warped Orbits
// 9/18/21

// Imports
import Sun from "./sun.js";
import { GeneratePlanets } from "./generator.js";
import { updatePotenialSelection, selectPlanet, applyPositionTranslation, findTranslation } from "./tools.js";
import { SolarSystemSettings as S, PhysicsSettings as PS } from "./settings.js";
import Starfield from "./stars.js";

// Window variables
let margin = 0.9;
let w = margin * window.innerWidth;
let h = margin * window.innerHeight;
var center = {x: w/2, y: h/2,}

// Initializing empty solar system
var solarSystem = {
    sun: null,
    planets: [],
    stars: null,
};

var backgroundStars = new Starfield(w, h);
var selectedPlanet;
var transformation = {
    x: 0,
    y: 0,
}


// Once:
// sun constructed at center of universe
// planets get constructed with parent, r_min, eccentricity

// Every tick:
// solve for semi-major axis to get period
// solve for mean anamoly using mean anomaly at epoch
// solve kepler eqn for eccentric anomaly using bessel series or newton method
// solve for true anomaly theta (actual angle of planet from sun)

// When a planet is picked:
// find inverse translation to move to selected planet to center
// apply same tranform to other bodies (universe moves rigidly)

// Main loop

function setup() {
    frameRate(PS.FR);
    createCanvas(w, h);
    solarSystem.sun = new Sun(center.x, center.y, S.planetScale);
    GeneratePlanets(S.numPlanets, solarSystem);
    for (var planet of solarSystem.planets) {
        planet.calcTrailLength();
    }
    // Resizing sun slightly
    solarSystem.sun.scale *= S.sunSizeMultiplier
}

function draw() {
    var potentialSelection = null;

    // Drawing background material
    background(0);
    backgroundStars.draw();
    applyPositionTranslation(solarSystem.sun, transformation)
    solarSystem.sun.draw();

    // Planet drawing and logic loop
    for (var planet of solarSystem.planets) {
        // Planet logic
        planet.updateOrbit();
        planet.drawTrails();
        // Checking if user is mousing over a selectable planet
        planet.checkForMouseover(mouseX, mouseY)
        potentialSelection = updatePotenialSelection(planet, potentialSelection)
        // Dwawing planet
        planet.draw();
    }

    console.log('POTENITAL SELECTION:')
    console.log(potentialSelection)

    // Selecting a planet to focus on
    if (potentialSelection) {
        selectedPlanet = selectPlanet(potentialSelection, selectedPlanet)
    }

    console.log('SELECTION:')
    console.log(selectedPlanet)

    if (selectedPlanet) {
        transformation = findTranslation(selectedPlanet.position, center)
    }
}

// GUI
function windowResized() {
    resizeCanvas(margin * window.innerWidth, margin * window.innerHeight);
}

// Exposing to scope
window.setup = setup;
window.draw = draw;


// For the inverse transform:
// every tick:
// if a planet is selected, find transform -x, -y from that planet
// apply that transform to the parent
// let future physics run normally