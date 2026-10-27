import { CAR_SCALE } from './Car.js';
import * as track from './track/track.js';

function createCar(name, color, placement, mass) {
	return {
		name: name,
		color: color,
		gear: 'forwards',
		// Kept at the original size so handling is unchanged by CAR_SCALE
		wheelBase: 40,
		steerInput: 0,
		wheel_rotation: 0,
		x: placement.x,
		y: placement.y,
		angle: placement.angle,
		enginePower: 0,
		velocityVector: {
			x: 0,
			y: 0
		},
		angularVelocity: 0,
		spin: 0,
		// Collision footprint, matching the body plus wheels drawn in Car.js
		halfLength: 27 * CAR_SCALE,
		halfWidth: 16.5 * CAR_SCALE,
		mass: mass,
		collisionRadius: 14 * CAR_SCALE,
		lap: 0,
		trackProgress: placement.progress,
		raceDistance: placement.progress,
		distanceFromCenter: 0,
		place: 1
	};
}

function Store(){
	var raceTrack = track.createTrack();
	var playerPlacement = track.createPlacement(raceTrack, 0, -18);
	var cpuPlacement = track.createPlacement(raceTrack, raceTrack.totalLength * 0.08, 18);

	this.state = {
		track: raceTrack,
		cars : [
			createCar('You', '#999999', playerPlacement, 100),
			createCar('CPU', '#cccccc', cpuPlacement, 120)
		],
		stats:{
			time_usage_percentage: 5,
			leader: 'You'
		}
	};
}

Store.prototype.getCurrentState = function() {
	return this.state;
}

Store.prototype.preserveState = function(newState) {
	this.state = newState;
}

export default Store;
