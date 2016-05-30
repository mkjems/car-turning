var timer = require('../timer.js');

module.exports = function(state) {
	state.stats.time_usage_percentage = timer.getTimeUsage();
	return state;
};