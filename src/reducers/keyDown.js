module.exports = function keyDownReducer(state, action) {
	if(action.key == 'ArrowLeft'){
		state.cars[0].wheel_rotation = Math.max(state.cars[0].wheel_rotation - (Math.PI/180)*1.5, (Math.PI/180)*-45);
	}
	if(action.key == 'ArrowRight'){
		state.cars[0].wheel_rotation = Math.min(state.cars[0].wheel_rotation + (Math.PI/180)*1.5, (Math.PI/180)*45);
	}
	if(action.key == 'ArrowUp'){
		state.cars[0].enginePower = Math.min(state.cars[0].enginePower + 0.12, 1.5);
	}
	if(action.key == 'ArrowDown'){
		state.cars[0].enginePower = Math.max(state.cars[0].enginePower - 0.2, -1);
	}
	return state;
}