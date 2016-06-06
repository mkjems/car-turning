var actions = require('./Actions.js');
// var rayfromVectorAndPoint = require('./Ray.js').rayfromVectorAndPoint;
// var intersection = require('./Ray.js').intersection;
// var Victor = require('victor');

function Car (x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = Math.PI/180 * angle;

    this.wagon_length = 40;
    this.half_wagon_length = this.wagon_length/2;
    this.wagon_width = 28;
    this.half_wagon_width = this.wagon_width/2;
    this.mass_radius = 3;
    this.rear_wheel_radius = 8;
    this.rear_wheel_width = 6;
    this.front_wheel_radius = 6;
    this.front_wheel_width = 3;
}

// Car is drawn pointing upwards
Car.prototype.draw = function(state, ctx) {
    ctx.save();
        ctx.translate(state.x, state.y);

        ctx.rotate(state.angle);

        // center line from bottom to top
        ctx.beginPath();
        ctx.moveTo(0 , this.half_wagon_length);
        ctx.lineTo(0, -this.half_wagon_length);
        ctx.stroke();

        // Car mass center
        ctx.beginPath();
        ctx.arc(0, 0, this.mass_radius, 0, 2*Math.PI, false);
        ctx.stroke();
        ctx.fill();

        // Front axel
        ctx.beginPath();
        ctx.moveTo(-this.half_wagon_width , -this.half_wagon_length);
        ctx.lineTo(this.half_wagon_width, -this.half_wagon_length);
        ctx.stroke();

        // Rear axel
        ctx.beginPath();
        ctx.moveTo(-this.half_wagon_width , this.half_wagon_length);
        ctx.lineTo(this.half_wagon_width, this.half_wagon_length);
        ctx.stroke();

        // Left rear wheel
        ctx.fillRect(-this.half_wagon_width - this.rear_wheel_width , this.half_wagon_length - this.rear_wheel_radius, this.rear_wheel_width, 2*this.rear_wheel_radius);

        // Right rear wheel
        ctx.fillRect(this.half_wagon_width, this.half_wagon_length - this.rear_wheel_radius, this.rear_wheel_width, 2*this.rear_wheel_radius);

        ctx.save();

            // Left front wheel
            ctx.translate(-this.half_wagon_width, -this.half_wagon_length);
            ctx.rotate(state.wheel_rotation); // rotate
            ctx.fillRect(-this.front_wheel_width, -this.front_wheel_radius, this.front_wheel_width, 2*this.front_wheel_radius);

        ctx.restore();
        ctx.save();

            // Right front wheel
            ctx.translate(this.half_wagon_width, -this.half_wagon_length);
            ctx.rotate(state.wheel_rotation); // rotate
            ctx.fillRect(0 , - this.front_wheel_radius, this.front_wheel_width, 2*this.front_wheel_radius);

        ctx.restore();
    ctx.restore();

    // Line perpendicular to front wheel
    // var vec = Victor(state.x, state.y)
    //     .add( Victor(( state.wheel_rotation < 0 ? -1 : 1) * this.half_wagon_width, -this.half_wagon_length).rotate(state.angle) );
    // var frontWheelRay = rayfromVectorAndPoint(Victor(200,0).rotate(state.wheel_rotation).rotate(state.angle),{
    //     x:vec.x,
    //     y:vec.y
    // });

    // Line perpendicular to rear wheel
    // var vec3 = Victor(state.x, state.y)
    //     .add( Victor(0, this.half_wagon_length).rotate(state.angle) );
    // var rearWheelRay = rayfromVectorAndPoint(Victor(200,0).rotate(state.angle),{
    //     x:vec3.x,
    //     y:vec3.y
    // });

    // var turnRadiusCenter = intersection(frontWheelRay, rearWheelRay);

    // ctx.save();
    //     if(turnRadiusCenter) {

            // var v4 = Victor((state.x - turnRadiusCenter.x), (state.y - turnRadiusCenter.y));

            // ctx.beginPath();
            // ctx.arc(turnRadiusCenter.x, turnRadiusCenter.y, v4.length(), 0, 2*Math.PI, false);
            // ctx.stroke();
            // ctx.beginPath();
            // ctx.arc(turnRadiusCenter.x, turnRadiusCenter.y, 1, 0, 2*Math.PI, false);
            // ctx.stroke();
    //     }
    // ctx.restore();



    actions.emmitEvent({
        type: 'MOVE_CARS',
        car: this
    });
}

module.exports = Car;
