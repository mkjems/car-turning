import Victor from 'victor';

var MAX_STEER_ANGLE = Math.PI / 4;
// Steering input ramps between -1 and 1 at these rates (per second),
// so a key press turns the wheels gradually instead of snapping to full lock
var STEER_SPEED = 2.5;
var STEER_RETURN_SPEED = 4;
// The faster the car goes, the less the wheels can turn
var STEER_SPEED_FALLOFF = 180;
var ENGINE_ACCELERATION = 260;
var BRAKE_DECELERATION = 320;
var COAST_DECELERATION = 42;
var FORWARD_DRAG = 0.9;
var REVERSE_DRAG = 1.4;
var LATERAL_GRIP = 7.5;
var STEERING_GRIP = 0.94;
var MAX_FORWARD_SPEED = 360;
var MAX_REVERSE_SPEED = -140;
// Spin from knocks (e.g. car collisions) dies away at this rate
var SPIN_DAMPING = 3;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function moveTowards(current, target, maxDelta) {
    if (current < target) {
        return Math.min(target, current + maxDelta);
    }

    if (current > target) {
        return Math.max(target, current - maxDelta);
    }

    return current;
}

export default function stepVehicle(car, controls, dt) {
    var velocityVec = Victor.fromObject(car.velocityVector);
    var forward = Victor(0, -1).rotate(car.angle);
    var right = Victor(1, 0).rotate(car.angle);
    var forwardSpeed = velocityVec.dot(forward);
    var lateralSpeed = velocityVec.dot(right);
    var steerStep = (controls.steer === 0 ? STEER_RETURN_SPEED : STEER_SPEED) * dt;
    var maxSteerAngle = MAX_STEER_ANGLE / (1 + (Math.abs(forwardSpeed) / STEER_SPEED_FALLOFF));
    var drag = forwardSpeed >= 0 ? FORWARD_DRAG : REVERSE_DRAG;
    var yawRate;
    var nextVelocity;

    car.steerInput = moveTowards(car.steerInput, controls.steer, steerStep);
    car.wheel_rotation = car.steerInput * maxSteerAngle;

    if (controls.throttle > 0) {
        forwardSpeed += controls.throttle * ENGINE_ACCELERATION * dt;
    }

    if (controls.brake > 0) {
        if (forwardSpeed > 0) {
            forwardSpeed = Math.max(0, forwardSpeed - (controls.brake * BRAKE_DECELERATION * dt));
        } else {
            forwardSpeed -= controls.brake * (ENGINE_ACCELERATION * 0.55) * dt;
        }
    }

    if (controls.throttle === 0 && controls.brake === 0) {
        forwardSpeed = moveTowards(forwardSpeed, 0, COAST_DECELERATION * dt);
    }

    forwardSpeed = moveTowards(forwardSpeed, 0, drag * Math.abs(forwardSpeed) * dt);
    forwardSpeed = clamp(forwardSpeed, MAX_REVERSE_SPEED, MAX_FORWARD_SPEED);
    lateralSpeed = moveTowards(lateralSpeed, 0, LATERAL_GRIP * Math.abs(lateralSpeed) * dt);

    yawRate = 0;
    if (Math.abs(car.wheel_rotation) > 0.001 && Math.abs(forwardSpeed) > 0.5) {
        yawRate = (forwardSpeed / car.wheelBase) * Math.tan(car.wheel_rotation) * STEERING_GRIP;
    }

    car.spin = moveTowards(car.spin, 0, SPIN_DAMPING * Math.abs(car.spin) * dt);
    car.angle += (yawRate + car.spin) * dt;
    car.angularVelocity = yawRate + car.spin;
    car.enginePower = controls.throttle - controls.brake;

    forward = Victor(0, -1).rotate(car.angle);
    right = Victor(1, 0).rotate(car.angle);
    nextVelocity = forward.multiplyScalar(forwardSpeed).add(right.multiplyScalar(lateralSpeed));

    car.velocityVector.x = nextVelocity.x;
    car.velocityVector.y = nextVelocity.y;
    car.x += nextVelocity.x * dt;
    car.y += nextVelocity.y * dt;
}
