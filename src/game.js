var Store = require('./Store.js');
var Actions = require('./Actions.js');
var generateNewState = require('./generateNewState.js');
var timer = require('./timer.js');
var View = require('./View.js');

var store = new Store();

/* Game loop */
function step() {
	timer.FrameBegin();
	// Make new state based on oldstate and actions
	var state = generateNewState(store.getCurrentState(), Actions.getActionsList());
	// Render to view using the new state
	View.renderFrame(state);
	// Save state for next frame.
	store.preserveState(state);
	timer.FrameEnd();
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
