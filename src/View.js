import Car from './Car.js';
import * as track from './track/track.js';

// The car renderer holds only drawing dimensions, so every car (and every game) can share it
var carRenderer = new Car();

// The track and cars are laid out in a 1200 x 800 world, scaled to fit the canvas
var VIEW_WIDTH = 1200;
var VIEW_HEIGHT = 800;

function clearFrame(ctx) {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function traceTrackPath(ctx, trackState) {
	var index;

	ctx.beginPath();
	for (index = 0; index < trackState.points.length; index += 1) {
		if (index === 0) {
			ctx.moveTo(trackState.points[index].x, trackState.points[index].y);
		} else {
			ctx.lineTo(trackState.points[index].x, trackState.points[index].y);
		}
	}
	ctx.closePath();
}

function drawTrack(ctx, trackState) {
	var startLineCenter = track.getPointAtDistance(trackState, 0);
	var startLineAngle = track.getHeadingAtDistance(trackState, 0);
	var rightX = Math.cos(startLineAngle);
	var rightY = Math.sin(startLineAngle);
	var startLineHalf = trackState.halfWidth - 4;

	ctx.save();
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';

		// Single thin edge, then the light road surface over it
		traceTrackPath(ctx, trackState);
		ctx.strokeStyle = '#bbbbbb';
		ctx.lineWidth = (trackState.halfWidth * 2) + 2;
		ctx.stroke();
		ctx.strokeStyle = '#eeeeee';
		ctx.lineWidth = trackState.halfWidth * 2;
		ctx.stroke();

		// Centre line
		ctx.setLineDash([14, 14]);
		ctx.strokeStyle = '#cccccc';
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.setLineDash([]);

		// Start line
		ctx.strokeStyle = '#999999';
		ctx.lineWidth = 2;
		ctx.lineCap = 'butt';
		ctx.beginPath();
		ctx.moveTo(startLineCenter.x - (rightX * startLineHalf), startLineCenter.y - (rightY * startLineHalf));
		ctx.lineTo(startLineCenter.x + (rightX * startLineHalf), startLineCenter.y + (rightY * startLineHalf));
		ctx.stroke();
	ctx.restore();
}

function drawCars(ctx, state) {
	var index;

	for (index = 0; index < state.cars.length; index += 1) {
		carRenderer.draw(state.cars[index], ctx);
	}
}

function drawHud(ctx, state) {
	var left = 16;
	var top = 0;

	ctx.save();
		ctx.fillStyle = '#222222';
		ctx.font = '16px sans-serif';
		ctx.fillText('Tiny Track Cup', left, top + 26);
		ctx.font = '13px sans-serif';
		ctx.fillText('Leader: ' + state.stats.leader, left, top + 50);
		ctx.fillText('You lap: ' + Math.max(1, state.cars[0].lap + 1), left, top + 70);
		ctx.fillText('You place: ' + state.cars[0].place + '/' + state.cars.length, left, top + 90);
		ctx.fillText('Arrow keys to drive', left, top + 110);
	ctx.restore();
}


// Render everything
function renderFrame(ctx, state) {
	var viewScale = ctx.canvas.width / VIEW_WIDTH;

	clearFrame(ctx);

	ctx.setTransform(viewScale, 0, 0, viewScale, 0, 0);
	drawTrack(ctx, state.track);
	drawCars(ctx, state);
	drawHud(ctx, state);
}

export { VIEW_WIDTH, VIEW_HEIGHT, renderFrame };
