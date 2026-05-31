var keyDownReducer = require('./reducers/keyDown.js')
var moveCarsReducer = require('./reducers/moveCars.js')
var updateStatsReducer = require('./reducers/updateStats.js')

function reducer(state, action){
	switch(action.type) {
	case 'KEY_DOWN':
		return keyDownReducer(state, action);
	case 'MOVE_CARS':
		return moveCarsReducer(state, action);
	case 'UPDATE_STATS':
		return updateStatsReducer(state, action);
	}
}

module.exports = function (state, actions) {
	return actions.reduce(reducer, state);
}
