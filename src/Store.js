function Store(){
	this.state = {
		cars : [{
			wheel_rotation: (Math.PI/180)*0,
			x:200,
			y: 400,
			angle: (Math.PI/180)*0,
			velocity: 0
		},{
			wheel_rotation: (Math.PI/180)*0,
			x:100,
			y:200,
			angle: (Math.PI/180)*0,
			velocity: 0
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
