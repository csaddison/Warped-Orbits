// Parameters

export const SolarSystemSettings = {
    // Solar system variables
    planetScale: 40, // size of planets and stars
    numPlanets: 4,
    selectionThreshold: 20, //extra space around planets that count as hit box, affects radius
    sunSizeMultiplier: 1.7,
};

export const TrailSettings = {
    trailsEnabled: true,
    trailLength: 1000, // if 0 it maps the full revolution, else it measures the length of trail in seconds
    trailColor: "#29e9b9",
    segments: 10, // for gradient
};

export const BackgroundSettings = {
    numStars: 250,
    starScaleMin: 1,
    starScaleMax: 2,
    scaleFactor: 8,
    twinkleSpeed: 1.5,
    starColor: "#ffffff",
    minOpacity: 60,
    maxOpacity: 90,
    bgColorA: "#130c21",
    bgColorB: "#000000",
    gradientSteps: 40,
    transparency: "10",
};

export const PhysicsSettings = {
    cosmicScale: 60, // size of 1au

    // sets speed of the system
    // period proportional only to smajor axis
    // timeScale=period at minimum allowed orbit of 1au
    // eg timeScale=1, cosmicScale=70 -> period of 1sec at a radius of r=1au=70px
    timeScale: 1,
    FR: 30,
    // for root solver
    maxIterations: 5,
    tolerance: 0.001,
};

// Settings for the generation algorithm--these affect the behavior of the orbits
export const GeneratorSettings = {
    // Color options for planets
    colorOptions: ["#BDB76B", "#00BFFF", "#32CD32", "#C71585", "#FF4500"],

    // Orbital parameters
    // distance corresponds to semi-major length and are measured in au (multiples of minimum orbit in this case)
    maxEccentricity: 0.7,
    minEccentricity: 0.05,
    maxDist: 4,
    minDist: 1,
    minAngle: 0,
    maxAngle: 2 * Math.PI,

    // Threshold for reducing large orbits
    // eg threshold=1.5 for e=.6 means SML>1.5*minDist must be true for orbits with eccentricity over .6
    // if false, SML=SML*multiplier
    distThreshold: 2,
    eccThreshold: 0.6,
    reductionMultiplier: 4,
};
