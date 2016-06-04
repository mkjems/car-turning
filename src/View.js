var Car =require('./Car.js');
var Ray =require('./Ray.js').Ray;

// Setup
var canvasElm = document.getElementById("game_canvas");
var statsCanvasElm = document.getElementById("stats_canvas");

var ctx = canvasElm.getContext("2d");
var stats_ctx = statsCanvasElm.getContext("2d");

exports.cars = [new Car(), new Car()];

var ray = new Ray(50,2);
var ray2 = new Ray(150,-0.15);


function clearFrame() {
	ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
}

function drawCars(state) {
	exports.cars[0].draw(state.cars[0], ctx);
	exports.cars[1].draw(state.cars[1], ctx);
	// ray.draw(ctx, 0, canvasElm.width);
	// ray2.draw(ctx, 0, canvasElm.width);
}

function drawStats(state) {
	// shift everything to the left
	var imageData = stats_ctx.getImageData(1, 0, statsCanvasElm.width-1, statsCanvasElm.height);
	stats_ctx.putImageData(imageData, 0, 0);
	// Clear line along right edge
	stats_ctx.clearRect(stats_ctx.canvas.width-1, 0, 1, stats_ctx.canvas.height);
	// Draw line along the right edge
	stats_ctx.fillStyle = "#000";
	stats_ctx.fillRect(99, (99-state.stats.time_usage_percentage), 1, 1);
}

// Render everything
exports.renderFrame = function(state) {
	clearFrame();
	drawStats(state);
	drawCars(state);
};
