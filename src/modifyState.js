// Modify state
function keyDownReducer(state, action) {
	if(action.key == 'a'){
		state.cars[0].wheel_rotation = Math.max(state.cars[0].wheel_rotation - 3, -55);
	}
	if(action.key == 'd'){
		state.cars[0].wheel_rotation = Math.min(state.cars[0].wheel_rotation + 3, 55);
	}
	return state;
}

function reducers(state, action){
	switch(action.type) {
	case 'KEY_DOWN':
		return keyDownReducer(state, action);
	}
}

module.exports = function modifyState(state, actions) {
	return actions.reduce(reducers, state);
}
