function Store(){
	this.state = {
		cars : [{
			wheel_rotation: 0,
			position_x:200,
			position_y: 200,
			angle: 110

		},{
			wheel_rotation: 0,
			position_x:100,
			position_y:200,
			angle: -45
		}],
		stats:{
			time_usage_percentage: 5
		}
	};
}

Store.prototype.getCurrentState = function() {
	return this.state;
}

Store.prototype.preserveState = function(newState) {
	this.state = newState;
}

module.exports = Store;
