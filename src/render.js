// Render everything
module.exports = function renderWorld(state, ctx, canvasElm, car_a, car_b){
	ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
	car_a.draw(state.cars[0]);
	car_b.draw(state.cars[1]);
};