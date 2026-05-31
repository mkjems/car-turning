var Car =require('./Car.js');

// Setup
var canvasElm = document.getElementById("game_canvas");

var ctx = canvasElm.getContext("2d");

exports.cars = [new Car(), new Car()];


function clearFrame() {
	ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
}

function drawCars(state) {
	exports.cars[0].draw(state.cars[0], ctx);
	//exports.cars[1].draw(state.cars[1], ctx);
}


// Render everything
exports.renderFrame = function(state) {
	clearFrame();
	drawCars(state);
};
