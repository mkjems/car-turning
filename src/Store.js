function Store(){
	this.state = {
		cars : [{
			gear: 'forwards',
			wheel_rotation: (Math.PI/180)*0,
			x:200,
			y: 400,
			angle: (Math.PI/180)*0,
			enginePower: 0,
			velocityVector: {
				x:0,
				y:0,
			},
			angularVelocity: 0.0,
			mass: 100
		},{
			gear: 'forwards',
			wheel_rotation: (Math.PI/180)*0,
			x:100,
			y:200,
			angle: (Math.PI/180)*0,
			enginePower: 0,
			velocityVector: {
				x:0,
				y:0,
			},
			angularVelocity: 0,
			mass: 150
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
