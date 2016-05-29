var Car =require('./Car.js');
var Keys =require('./Keys.js');
var Store =require('./Store.js');
var modifyState = require('./modifyState.js');
var Timer = require('./Timer.js');

// Setup
var canvasElm = document.getElementById("game_canvas");
var ctx = canvasElm.getContext("2d");

var car_a = new Car(200,200,110);
var car_b = new Car(100,200,-45);

var keys = new Keys();
var store = new Store({
	cars : [{
		wheel_rotation: 0
	},{
		wheel_rotation: 0
	}]
});
var timer = new Timer();

// Render everything
function renderWorld(state){
	ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
	car_a.draw(state.cars[0], ctx);
	car_b.draw(state.cars[1], ctx);
}

/* Game loop */
function step() {

	timer.FrameBegin();

	var actions = keys.getActions();
	var state = modifyState(store.getCurrentState(), actions);
	renderWorld(state, ctx, canvasElm, car_a, car_b);
	store.preserveState(state);

	timer.FrameEnd();

    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
