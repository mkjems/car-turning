function Store(initialState){
	this.state = initialState;
}

Store.prototype.getCurrentState = function() {
	return this.state;
}

Store.prototype.preserveState = function(newState) {
	this.state = newState;
}
