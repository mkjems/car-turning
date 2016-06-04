
// y = a + bx
function Ray(a,b) {
	this.a = a;
	this.b = b;
}

Ray.prototype.valueForx = function(x) {
	return this.a + this.b * x;
}

Ray.prototype.draw = function(ctx, x, x2) {
	ctx.moveTo(x,this.valueForx(x));
	ctx.lineTo(x2, this.valueForx(x2));
    ctx.stroke();
};

exports.Ray = Ray;

exports.rayfromVectorAndPoint = function(vec, point){

};

exports.intersection = function(ray1,ray2){

};
