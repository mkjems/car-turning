import Store from './Store.js';
import Keys from './Keys.js';
import getAIControls from './ai/getAIControls.js';
import stepVehicle from './physics/stepVehicle.js';
import * as track from './track/track.js';
import * as View from './View.js';

import * as timer from './timer.js';

var store = new Store();
var keys = new Keys();
var FIXED_TIMESTEP = 1 / 120;
var MAX_FRAME_TIME = 0.1;
var accumulator = 0;
var previousTimestamp;

function updateRaceOrder(state) {
	var orderedCars = state.cars.slice().sort(function(a, b) {
		return b.raceDistance - a.raceDistance;
	});
	var index;

	for (index = 0; index < orderedCars.length; index += 1) {
		orderedCars[index].place = index + 1;
	}

	state.stats.leader = orderedCars[0].name;
}

function updateWorld(state, dt) {
	stepVehicle(state.cars[0], keys.getControls(), dt);
	track.syncCarToTrack(state.cars[0], state.track);

	stepVehicle(state.cars[1], getAIControls(state.cars[1], state.track), dt);
	track.syncCarToTrack(state.cars[1], state.track);

	updateRaceOrder(state);
}

/* Game loop */
function step(timestamp) {
	var state = store.getCurrentState();
	var frameTime;

	if (previousTimestamp === undefined) {
		previousTimestamp = timestamp;
	}

	timer.FrameBegin();
	frameTime = Math.min((timestamp - previousTimestamp) / 1000, MAX_FRAME_TIME);
	previousTimestamp = timestamp;
	accumulator += frameTime;

	while (accumulator >= FIXED_TIMESTEP) {
		updateWorld(state, FIXED_TIMESTEP);
		accumulator -= FIXED_TIMESTEP;
	}

	View.renderFrame(state);
	store.preserveState(state);
	timer.FrameEnd();
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
