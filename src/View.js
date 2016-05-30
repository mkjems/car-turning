var Car =require('./Car.js');

// Setup
var canvasElm = document.getElementById("game_canvas");
var statsCanvasElm = document.getElementById("stats_canvas");

var ctx = canvasElm.getContext("2d");
var stats_ctx = statsCanvasElm.getContext("2d");

var car_a = new Car();
var car_b = new Car();

function clearFrame() {
	ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
}

function drawCars(state) {
	car_a.draw(state.cars[0], ctx);
	car_b.draw(state.cars[1], ctx);
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
