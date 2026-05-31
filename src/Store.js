import * as track from './track/track.js';

function createCar(name, color, placement, mass) {
	return {
		name: name,
		color: color,
		gear: 'forwards',
		wheelBase: 40,
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
		mass: mass,
		collisionRadius: 14,
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
			createCar('You', '#e76f51', playerPlacement, 100),
			createCar('CPU', '#2a9d8f', cpuPlacement, 120)
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
