var actions = require('./Actions.js');
// var Ray = require('./Ray.js');
var Victor = require('victor');

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
    var vec = Victor(state.x, state.y)
        .add( Victor(0, -this.half_wagon_length).rotate(state.angle) );

    var vec2 = Victor(vec.x,vec.y)
        .add(Victor(500,0).rotate(state.wheel_rotation).rotate(state.angle));
    // console.log(zeroToFrontWheel.x, zeroToFrontWheel.y);


    ctx.moveTo(vec.x, vec.y);
    ctx.lineTo(vec2.x, vec2.y);
    ctx.stroke();


    // Line perpendicular to rear wheel
    var vec3 = Victor(state.x, state.y)
        .add( Victor(0, this.half_wagon_length).rotate(state.angle) );

    var vec4 = Victor(vec3.x,vec3.y)
        .add(Victor(500,0).rotate(state.angle));


    ctx.moveTo(vec3.x, vec3.y);
    ctx.lineTo(vec4.x, vec4.y);
    ctx.stroke();


    actions.emmitEvent({
        type: 'MOVE_CARS',
        car: this
    });
}

module.exports = Car;
