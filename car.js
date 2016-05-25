var position_x = 100;
var position_y = 100;
var wagon_length = 80;
var half_wagon_length = wagon_length/2;
var wagon_width = 50;
var half_wagon_width = wagon_width/2;
var mass_radius = 7;
var angle = Math.PI/180 * 107;
var rear_wheel_radius = 15;
var rear_wheel_width = 8;
var front_wheel_radius = 10;
var front_wheel_width = 6;
var wheel_rotation = 20;

ctx.translate(position_x, position_y);
ctx.rotate(angle);

ctx.save();
ctx.scale(1, 1);

ctx.beginPath();
ctx.moveTo(0 , half_wagon_length);
ctx.lineTo(0, -half_wagon_length);
ctx.stroke();

ctx.beginPath();
ctx.arc(0, 0, mass_radius, 0, 2*Math.PI, false);
ctx.stroke();
ctx.fill();

// Front axel
ctx.beginPath();
ctx.moveTo(-half_wagon_width , -half_wagon_length);
ctx.lineTo(half_wagon_width, -half_wagon_length);
ctx.stroke();

// Rear axel
ctx.beginPath();
ctx.moveTo(-half_wagon_width , half_wagon_length);
ctx.lineTo(half_wagon_width, half_wagon_length);
ctx.stroke();

// Left rear wheel

ctx.fillRect(-half_wagon_width - rear_wheel_width , half_wagon_length - rear_wheel_radius, rear_wheel_width, 2*rear_wheel_radius);

// Right rear wheel
ctx.fillRect(half_wagon_width, half_wagon_length - rear_wheel_radius, rear_wheel_width, 2*rear_wheel_radius);

ctx.save();

// Left front wheel
ctx.translate(-half_wagon_width, -half_wagon_length);
ctx.rotate((Math.PI/180)*wheel_rotation); // rotate
ctx.fillRect(0 -front_wheel_width, 0 - front_wheel_radius, front_wheel_width, 2*front_wheel_radius);

ctx.restore();
ctx.save();

// Right front wheel
ctx.translate(half_wagon_width, -half_wagon_length);
ctx.rotate((Math.PI/180)*wheel_rotation); // rotate
ctx.fillRect(0 , - front_wheel_radius, front_wheel_width, 2*front_wheel_radius);

ctx.restore();
ctx.restore();
