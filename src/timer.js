var lastT1 = 0;
var t1;
var t2;
var frameLength;
var mycodeTime;
var timeUsage;

function FrameBegin(){
	t1 = new Date().getTime();
	frameLength = t1 - lastT1;
}

function FrameEnd(){
	t2 = new Date().getTime();
	mycodeTime = t2 - t1;
	timeUsage = (mycodeTime*100)/frameLength;
	//console.log(timeUsage);
	lastT1 = t1;
}

function getTimeUsage() {
	return timeUsage;
}

export { FrameBegin, FrameEnd, getTimeUsage };
