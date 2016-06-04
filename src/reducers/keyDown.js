module.exports = function keyDownReducer(state, action) {
	if(action.key == 'a'){
		state.cars[0].wheel_rotation = Math.max(state.cars[0].wheel_rotation - (Math.PI/180)*1, (Math.PI/180)*-55);
	}
	if(action.key == 'd'){
		state.cars[0].wheel_rotation = Math.min(state.cars[0].wheel_rotation + (Math.PI/180)*1, (Math.PI/180)*55);
	}
	if(action.key == 'w'){
		state.cars[0].velocity += .2;
	}
	if(action.key == 's'){
		state.cars[0].velocity =  Math.max(state.cars[0].velocity - .1, 0);
	}
	return state;
}