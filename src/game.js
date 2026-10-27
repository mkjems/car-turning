import Store from './Store.js';
import Keys from './Keys.js';
import getAIControls from './ai/getAIControls.js';
import collideCars from './physics/collideCars.js';
import stepVehicle from './physics/stepVehicle.js';
import * as track from './track/track.js';
import * as View from './View.js';

// The track and cars are laid out in a 1200 x 800 world, scaled to fit the canvas
var WORLD_WIDTH = 1200;
var FIXED_TIMESTEP = 1 / 120;
var MAX_FRAME_TIME = 0.1;

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

function updateWorld(state, keys, dt) {
	stepVehicle(state.cars[0], keys.getControls(), dt);
	stepVehicle(state.cars[1], getAIControls(state.cars[1], state.track, [state.cars[0]], dt), dt);

	collideCars(state.cars[0], state.cars[1]);

	track.syncCarToTrack(state.cars[0], state.track);
	track.syncCarToTrack(state.cars[1], state.track);

	updateRaceOrder(state);
}

// One self-contained race drawing into `canvas`, driven by arrow keys pressed on `keyTarget`
export default function createGame(canvas, keyTarget) {
	var ctx = canvas.getContext('2d');
	var store = new Store();
	var keys = new Keys(keyTarget);
	var accumulator = 0;
	var previousTimestamp;
	var frameId = null;

	function step(timestamp) {
		var state = store.getCurrentState();
		var frameTime;

		if (previousTimestamp === undefined) {
			previousTimestamp = timestamp;
		}

		frameTime = Math.min((timestamp - previousTimestamp) / 1000, MAX_FRAME_TIME);
		previousTimestamp = timestamp;
		accumulator += frameTime;

		while (accumulator >= FIXED_TIMESTEP) {
			updateWorld(state, keys, FIXED_TIMESTEP);
			accumulator -= FIXED_TIMESTEP;
		}

		state.stats.focused = keyTarget.matches(':focus');
		ctx.setTransform(canvas.width / WORLD_WIDTH, 0, 0, canvas.width / WORLD_WIDTH, 0, 0);
		View.renderFrame(ctx, state);
		store.preserveState(state);
		frameId = window.requestAnimationFrame(step);
	}

	return {
		start: function() {
			if (frameId === null) {
				// Don't fast-forward through the time we were paused
				previousTimestamp = undefined;
				frameId = window.requestAnimationFrame(step);
			}
		},
		stop: function() {
			if (frameId !== null) {
				window.cancelAnimationFrame(frameId);
				frameId = null;
			}
			keys.releaseAll();
		},
		destroy: function() {
			this.stop();
			keys.destroy();
		}
	};
}
