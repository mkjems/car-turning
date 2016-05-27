// Setup
var canvasElm = document.getElementById("game_canvas");
var ctx = canvasElm.getContext("2d");

var car_a = new Car(200,200,110);
var car_b = new Car(100,200,-45);

var keys = new Keys();
var store = new Store({
	wheel_rotation: 0
});

/* Game loop */

function modifyState(state,keyPositions) {
	if(keyPositions.a == 'down'){
		state.wheel_rotation = Math.max(state.wheel_rotation - 3, -55);
	}
	if(keyPositions.d == 'down'){
		state.wheel_rotation = Math.min(state.wheel_rotation + 3, 55);
	}
	return state;
}

function renderWorld(state){
	ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
	car_a.draw(state);
	car_b.draw(state);
};

// The loop
function step(timestamp) {
	keyPositions = keys.getStateOfKeys();
	var newState = modifyState(store.getCurrentState(),keyPositions);
	renderWorld(newState);
	store.preserveState(newState);
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
