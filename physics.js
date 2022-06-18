import { PhysicsSettings as PS } from "./settings.js";
// every tick:
// solve for semi-major axis to get period
// solve for mean anamoly using mean anomaly at epoch
// solve kepler eqn for eccentric anomaly using bessel series or newton method
// solve for true anomaly theta (actual angle of planet from sun)

// Main funcitons
export function calcPeriod(semiMajorLength) {
    // return Math.sqrt(semiMajorLength**3) / spacetimeBalancer
    return Math.sqrt(semiMajorLength ** 3) * PS.timeScale;
}

export function calcMeanAnomaly(percentThruEpoch) {
    return 2 * Math.PI * percentThruEpoch;
}

export function calcTrueAnomaly(eccentricity, eccentricAnomaly) {
    return (
        2 *
        Math.atan(
            Math.sqrt((1 + eccentricity) / (1 - eccentricity)) *
                Math.tan(eccentricAnomaly / 2)
        )
    );
}

// DEPRECATED: Having issues with signs on this only ranging from [0,pi]
export function calcTA2(eccentricity, eccentricAnomaly) {
    let beta = eccentricity / (1 + Math.sqrt(1 - eccentricity ** 2));
    return (
        eccentricAnomaly +
        2 *
            Math.atan(
                (beta * Math.sin(eccentricAnomaly)) /
                    (1 - Math.cos(eccentricAnomaly))
            )
    );
}

export function newtonRootFinder(
    f,
    fprime,
    initialGuess,
    tolerance,
    maxIterations
) {
    let x0 = initialGuess;
    for (var i = 0; i < maxIterations; i++) {
        if (Math.abs(f(x0)) > tolerance) {
            let y = f(x0);
            let yprime = fprime(x0);
            let x1 = x0 - y / yprime;
            x0 = x1;
        } else {
            break;
        }
    }
    return x0;
}

export function calcEccentricAnomaly(meanAnomaly, eccentricity) {
    let keplerEqn = (E) => E - eccentricity * Math.sin(E) - meanAnomaly;
    let keplerDeriv = (E) => 1 - eccentricity * Math.cos(E);
    return newtonRootFinder(
        keplerEqn,
        keplerDeriv,
        meanAnomaly,
        PS.tolerance,
        PS.maxIterations
    );
}

export function calcRadialDistance(angle, semiMajorLength, eccentricity) {
    return (
        (semiMajorLength * (1 - eccentricity ** 2)) /
        (1 + eccentricity * Math.cos(angle))
    );
}

// For converting between real screen-size pixels and dimensionless astronomical unit, set via cosmicScale parameter
export function auToPixels(au) {
    return au * PS.cosmicScale;
}
export function pixelsToAU(pixels) {
    return pixels / PS.cosmicScale;
}

export function findFramesPerEpoch(semiMajorLength, eccentricity) {
    // calc frames per epoch by multiplying period * frame rate ex:
    // 10 sec * 10 fps = 100 frames
    // so count 100 ticks til restart of epoch
    return calcPeriod(semiMajorLength, eccentricity) * PS.FR;
}

export function getPercentThruEpoch(currentFrame, totalFrames) {
    // solve for mean anamoly M=n(t-t_0):[0,2pi] -> M=2*pi * (% thru orbit)
    // eg: period = 400frames, currentFrame=100 -> M=2pi*25% = pi/2
    return currentFrame / totalFrames;
}
