// Setup

var canvasElm = document.getElementById("game_canvas");
var ctx = canvasElm.getContext("2d");

var car_a = new Car(100,100,10);
var car_b = new Car(100,200,-45);

var keys = new Keys();

// Game loop

function getKeyPositions() {

}

function modifyWorld(keyPositions) {

}

function updateWorldState() {
	keyPositions = getKeyPositions();
	modifyWorld(keyPositions);
};

function renderWorld(){
	ctx.clearRect(0, 0, canvasElm.width, canvasElm.height);
	car_a.draw();
	car_b.draw();
};


function step(timestamp) {
	updateWorldState();
	renderWorld();
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

