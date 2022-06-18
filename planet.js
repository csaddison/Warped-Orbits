import * as phys from "./physics.js";
import { TrailSettings as TS, PhysicsSettings as PS, SolarSystemSettings as SSS } from "./settings.js";
import { LinearFade } from "./tools.js";

export default class Planet {
    constructor(parent) {
        this.parent = parent;
        this.scale = parent.scale / 2;

        this.position = {
            r: 0,
            theta: 0,
            x: 0,
            y: 0,
            // for keeping track of the position relative to the parent. Normal position tracks in pixel space
            relative: {
                x: 0,
                y: 0,
            },
        };

        this.trailPath = [];
        this.trailGradient = new LinearFade(TS.trailColor, TS.segments)
        this.color = "#0077ff";
        this.frame = 0;
        this.isSelected = false;
    }

    setOrbit(semiMajorLength, eccentricity, argumentofPeriapsis) {
        this.semiMajorLength = semiMajorLength;
        this.eccentricity = eccentricity;
        this.argumentofPeriapsis = argumentofPeriapsis;
        this.framesPerEpoch = phys.findFramesPerEpoch(
            semiMajorLength,
            eccentricity
        );
    }

    getCarteseanPosition() {
        // getting the position relative to parent
        this.position.relative.x =
            phys.auToPixels(
                this.position.r *
                    Math.cos(this.position.theta + this.argumentofPeriapsis)
            );
        this.position.relative.y =
            phys.auToPixels(
                this.position.r *
                    Math.sin(this.position.theta + this.argumentofPeriapsis)
            );
        // Combining in screen space
        this.position.x = this.parent.position.x + this.position.relative.x
        this.position.y = this.parent.position.y + this.position.relative.y
    }

    updateOrbit() {
        // solve for semi-major axis to get period
        // with mean motion (average speed) n (only for derivation, not used in code):
        // solve for mean anamoly M=n(t-t_0):[0,2pi] -> M=2*pi * (% thru orbit)
        // eg: period = 400frames, currentFrame=100 -> M=2pi*25% = pi/2
        // solve kepler eqn for eccentric anomaly using newton method
        // solve for true anomaly  (actual angle of planet from sun)
        // get radial dstance as position of theta
        // convert to x,y for draw
        var eccentricAnomaly = phys.calcEccentricAnomaly(
            phys.calcMeanAnomaly(
                phys.getPercentThruEpoch(this.frame, this.framesPerEpoch)
            ),
            this.eccentricity
        );
        // this.position.theta = phys.calcTrueAnomaly(this.eccentricity, eccentricAnomaly) % (2*Math.PI)
        this.position.theta =
            phys.calcTrueAnomaly(this.eccentricity, eccentricAnomaly) %
            (2 * Math.PI);
        this.position.r = phys.calcRadialDistance(
            this.position.theta,
            this.semiMajorLength,
            this.eccentricity
        );
        this.getCarteseanPosition();
        this.frame += 1;
    }

    draw() {
        // if moused over or selected, outline white
        this.mouseOver || this.isSelected ? stroke('white') : noStroke();
        fill(this.color);
        circle(this.position.x, this.position.y, this.scale);
    }

    calcTrailLength() {
        // Checking if trailLength is set to 1 revolution or to a set time (using a ternary operator, sweet)
        // Set to max currently to get persitent trails. hacky, remove soon
        TS.trailLength ?  this.trailLength = Math.max(TS.trailLength*PS.FR, this.framesPerEpoch) : this.trailLength = this.framesPerEpoch
    }

    drawTrails() {
        // Adding current position to trail
        this.trailPath.push([this.position.x, this.position.y]);
        if (this.trailPath.length > this.trailLength) {
            this.trailPath.shift();
        }
        if (TS.trailsEnabled) {

            this.trailGradient.draw(this.trailPath)
        }
    }

    // To check if current planet is highlighted
    checkForMouseover(userX, userY) {
        this.mouseOver = false
        const dx = this.position.x - userX;
        const dy = this.position.y - userY;
        Math.sqrt(dx**2 + dy**2) < (this.scale/2) + SSS.selectionThreshold  ?  this.mouseOver=true :  this.mouseOver=false;
    }

}
