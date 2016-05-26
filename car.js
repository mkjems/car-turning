function Car (x, y, angle) {
    this.position_x = x;
    this.position_y = y;
    this.angle = Math.PI/180 * angle;

    this.wagon_length = 80;
    this.half_wagon_length = this.wagon_length/2;
    this.wagon_width = 50;
    this.half_wagon_width = this.wagon_width/2;
    this.mass_radius = 7;
    this.rear_wheel_radius = 15;
    this.rear_wheel_width = 8;
    this.front_wheel_radius = 10;
    this.front_wheel_width = 6;
}

Car.prototype.draw = function(state) {
    ctx.save();
    ctx.translate(this.position_x, this.position_y);
    ctx.scale(0.7, 0.7);
    ctx.rotate(this.angle);

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
    ctx.rotate((Math.PI/180)*state.wheel_rotation); // rotate
    ctx.fillRect(0 -this.front_wheel_width, 0 - this.front_wheel_radius, this.front_wheel_width, 2*this.front_wheel_radius);

    ctx.restore();
    ctx.save();

    // Right front wheel
    ctx.translate(this.half_wagon_width, -this.half_wagon_length);
    ctx.rotate((Math.PI/180)*state.wheel_rotation); // rotate
    ctx.fillRect(0 , - this.front_wheel_radius, this.front_wheel_width, 2*this.front_wheel_radius);

    ctx.restore();
    ctx.restore();
}
