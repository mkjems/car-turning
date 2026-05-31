var Car =require('./Car.js');
var track = require('./track/track.js');

// Setup
var canvasElm = document.getElementById("game_canvas");

var ctx = canvasElm.getContext("2d");

exports.cars = [];


function clearFrame() {
	ctx.fillStyle = '#7fb069';
	ctx.fillRect(0, 0, canvasElm.width, canvasElm.height);
}

function ensureCarRenderers(cars) {
	while (exports.cars.length < cars.length) {
		exports.cars.push(new Car());
	}
}

function drawTrack(trackState) {
	var startLineCenter = track.getPointAtDistance(trackState, 0);
	var startLineAngle = track.getHeadingAtDistance(trackState, 0);
	var rightX = Math.cos(startLineAngle);
	var rightY = Math.sin(startLineAngle);
	var index;

	ctx.save();
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';

		ctx.beginPath();
		for (index = 0; index < trackState.points.length; index += 1) {
			if (index === 0) {
				ctx.moveTo(trackState.points[index].x, trackState.points[index].y);
			} else {
				ctx.lineTo(trackState.points[index].x, trackState.points[index].y);
			}
		}
		ctx.closePath();
		ctx.strokeStyle = '#f8fafc';
		ctx.lineWidth = (trackState.halfWidth * 2) + 10;
		ctx.stroke();

		ctx.beginPath();
		for (index = 0; index < trackState.points.length; index += 1) {
			if (index === 0) {
				ctx.moveTo(trackState.points[index].x, trackState.points[index].y);
			} else {
				ctx.lineTo(trackState.points[index].x, trackState.points[index].y);
			}
		}
		ctx.closePath();
		ctx.strokeStyle = '#2f3437';
		ctx.lineWidth = trackState.halfWidth * 2;
		ctx.stroke();

		ctx.beginPath();
		for (index = 0; index < trackState.points.length; index += 1) {
			if (index === 0) {
				ctx.moveTo(trackState.points[index].x, trackState.points[index].y);
			} else {
				ctx.lineTo(trackState.points[index].x, trackState.points[index].y);
			}
		}
		ctx.closePath();
		ctx.setLineDash([16, 14]);
		ctx.strokeStyle = '#f4d35e';
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.setLineDash([]);

		ctx.strokeStyle = '#111827';
		ctx.lineWidth = 8;
		ctx.beginPath();
		ctx.moveTo(startLineCenter.x - (rightX * (trackState.halfWidth - 6)), startLineCenter.y - (rightY * (trackState.halfWidth - 6)));
		ctx.lineTo(startLineCenter.x + (rightX * (trackState.halfWidth - 6)), startLineCenter.y + (rightY * (trackState.halfWidth - 6)));
		ctx.stroke();
	ctx.restore();
}

function drawCars(state) {
	var index;

	ensureCarRenderers(state.cars);

	for (index = 0; index < state.cars.length; index += 1) {
		exports.cars[index].draw(state.cars[index], ctx);
	}
}

function drawHud(state) {
	ctx.save();
		ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
		ctx.fillRect(18, 18, 250, 108);
		ctx.fillStyle = '#f8fafc';
		ctx.font = '16px sans-serif';
		ctx.fillText('Tiny Track Cup', 34, 44);
		ctx.font = '13px sans-serif';
		ctx.fillText('Leader: ' + state.stats.leader, 34, 68);
		ctx.fillText('You lap: ' + (state.cars[0].lap + 1), 34, 88);
		ctx.fillText('You place: ' + state.cars[0].place + '/' + state.cars.length, 34, 108);
		ctx.fillText('Arrow keys to drive', 34, 128);
	ctx.restore();
}


// Render everything
exports.renderFrame = function(state) {
	clearFrame();
	drawTrack(state.track);
	drawCars(state);
	drawHud(state);
};
