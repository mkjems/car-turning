// Size of the drawn car relative to its original 40 x 25 design
var CAR_SCALE = 0.8;

function Car (x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = Math.PI/180 * angle;

    this.wagon_length = 40;
    this.half_wagon_length = this.wagon_length/2;
    this.wagon_width = 25;
    this.half_wagon_width = this.wagon_width/2;
    this.mass_radius = 3;
    this.rear_wheel_radius = 7;
    this.rear_wheel_width = 4;
    this.front_wheel_radius = 6;
    this.front_wheel_width = 3;
}

Car.prototype.erase = function(state, ctx) {
    ctx.save();
    ctx.translate(state.x, state.y);
    ctx.rotate(state.angle);
    ctx.clearRect(- (this.half_wagon_width +25) , - (this.half_wagon_length + 25) , this.wagon_width +50 , this.wagon_length + 50);
    ctx.restore();
}

// Car is drawn pointing upwards
Car.prototype.draw = function(state, ctx) {
    var bodyColor = state.color || '#bbbbbb';

    ctx.save();
        ctx.translate(state.x, state.y);

        ctx.rotate(state.angle);
        ctx.scale(CAR_SCALE, CAR_SCALE);

        ctx.fillStyle = bodyColor;
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 1 / CAR_SCALE;

        ctx.fillRect(-this.half_wagon_width + 2, -this.half_wagon_length + 3, this.wagon_width - 4, this.wagon_length - 6);
        ctx.strokeRect(-this.half_wagon_width + 2, -this.half_wagon_length + 3, this.wagon_width - 4, this.wagon_length - 6);

        ctx.fillStyle = '#222222';

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

    ctx.save();
        ctx.fillStyle = '#222222';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(state.name, state.x, state.y - (this.half_wagon_length * CAR_SCALE) - 12);
    ctx.restore();
}

export { CAR_SCALE };
export default Car;
