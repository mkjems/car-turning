var Car =require('./Car.js');
var Ray =require('./Ray.js').Ray;

// Setup
var canvasElm = document.getElementById("game_canvas");

var ctx = canvasElm.getContext("2d");

exports.cars = [new Car(), new Car()];

var ray = new Ray(50,2);
var ray2 = new Ray(150,-0.15);


function clearFrame() {
	ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
}

function drawCars(state) {
	exports.cars[0].erase(state.cars[0], ctx);
	exports.cars[0].draw(state.cars[0], ctx);
	//exports.cars[1].draw(state.cars[1], ctx);
	// ray.draw(ctx, 0, canvasElm.width);
	// ray2.draw(ctx, 0, canvasElm.width);
}


// Render everything
exports.renderFrame = function(state) {
	drawCars(state);
};
