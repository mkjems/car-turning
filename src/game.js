var Store = require('./Store.js');
var Keys = require('./Keys.js');
var stepVehicle = require('./physics/stepVehicle.js');
var View = require('./View.js');

var timer = require('./timer.js');

var store = new Store();
var keys = new Keys();
var FIXED_TIMESTEP = 1 / 120;
var MAX_FRAME_TIME = 0.1;
var accumulator = 0;
var previousTimestamp;

function updateWorld(state, dt) {
	stepVehicle(state.cars[0], keys.getControls(), dt);
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
