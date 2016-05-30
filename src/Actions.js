var Keys =require('./Keys.js');
var keys = new Keys();

var actionKeeper = []

exports.getActionsList = function() {
	// Use the store as a start
	var actions = actionKeeper;
	// Add the user keys
	actions = actions.concat(keys.getActions());
	// Things that should be done every frame.
	actions.push({
		type: 'MOVE_CARS'
	});
	actions.push({
		type: 'UPDATE_STATS'
	});
	// Delete the store
	actionKeeper = [];

	return actions;
};

exports.emmitEvent = function(action) {
	actionKeeper.push(action);
}
