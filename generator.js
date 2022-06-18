import Planet from "./planet.js";
import { GeneratorSettings as GS } from "./settings.js";
import { randomBetween } from "./tools.js";

export function GeneratePlanets(numPlanets, solarSystem) {
    solarSystem.planets = [];

    for (var n = 0; n < numPlanets; n++) {
        // Adding planet orbiting around parent sun and setting orbital parameters
        let planet = new Planet(solarSystem.sun);
        planet.setOrbit(
            randomBetween(GS.minDist, GS.maxDist),
            randomBetween(GS.minEccentricity, GS.maxEccentricity),
            randomBetween(GS.minAngle, GS.maxAngle)
        );
        // Adjusting so highly eccentric orbits stay on screen
        if (
            planet.eccentricity > GS.eccThreshold &&
            planet.semiMajorLength > GS.distThreshold * GS.minDist
        ) {
            planet.setOrbit(planet.semiMajorLength * GS.reductionMultiplier, planet.eccentricity, planet.argumentofPeriapsis)
        }
        // Randomizing color and pushing to system
        planet.color = randomColorForPlanets(GS.colorOptions);
        solarSystem.planets.push(planet);
    }
}

function randomColorForPlanets(colorArray) {
    return colorArray[Math.floor(Math.random() * colorArray.length)];
}
