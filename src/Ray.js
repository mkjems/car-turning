// A Ray is a representation of a straight line.
// y = a + bx
function Ray(a,b) {
	this.a = a;
	this.b = b;
}

Ray.prototype.valueForX = function(x) {
	return this.a + this.b * x;
}

Ray.prototype.draw = function(ctx, x, x2) {
	ctx.moveTo(x,this.valueForX(x));
	ctx.lineTo(x2, this.valueForX(x2));
    ctx.stroke();
};

exports.Ray = Ray;

exports.rayfromVectorAndPoint = function(vec, point){
	var b = vec.y/vec.x;
	var a = point.y - (point.x * b);
	return new Ray(a,b);
};

exports.intersection = function(ray1,ray2){
	if( Math.abs(ray1.b - ray2.b) < .01){
		console.log('parallel lines');
		return false;
	}
	var x = (ray2.a - ray1.a) / (ray1.b - ray2.b);
	return {
		x: x,
		y: ray1.valueForX(x)
	}
};
