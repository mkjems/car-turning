var Victor = require('victor');

module.exports = function(state, action) {
	var car = state.cars[0];

	// find next position
	var vec = Victor(Math.abs(car.velocity) , 0);
	vec.rotateBy((car.velocity < 0 ? Math.PI: 0)-(Math.PI/2) + car.angle);

	state.cars[0].x += vec.x
	state.cars[0].y += vec.y

	// Slow down, (simulate inertia)
	state.cars[0].velocity = Math.max(state.cars[0].velocity -0.05, 0);
	return state;
};