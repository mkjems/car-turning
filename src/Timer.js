function Timer() {
	this.lastT1 = 0;
	this.t1;
	this.t2;
	this.frameLength;
	this.mycodeTime;
	this.timeUsage;
}

Timer.prototype.FrameBegin = function(){
	this.t1 = new Date().getTime();
	this.frameLength = this.t1 - this.lastT1;
}

Timer.prototype.FrameEnd = function(){
	this.t2 = new Date().getTime();
	this.mycodeTime = this.t2 - this.t1;
	this.timeUsage = (this.mycodeTime*100)/this.frameLength;
	// console.log(this.timeUsage);
	this.lastT1 = this.t1;
}

module.exports = Timer;