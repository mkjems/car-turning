var Victor = require('victor');

var MAX_STEER_ANGLE = Math.PI / 4;
var STEER_SPEED = Math.PI * 1.8;
var STEER_RETURN_SPEED = Math.PI * 2.4;
var ENGINE_ACCELERATION = 260;
var BRAKE_DECELERATION = 320;
var COAST_DECELERATION = 42;
var FORWARD_DRAG = 0.9;
var REVERSE_DRAG = 1.4;
var LATERAL_GRIP = 7.5;
var STEERING_GRIP = 0.94;
var MAX_FORWARD_SPEED = 360;
var MAX_REVERSE_SPEED = -140;

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

module.exports = function stepVehicle(car, controls, dt) {
    var velocityVec = Victor.fromObject(car.velocityVector);
    var forward = Victor(0, -1).rotate(car.angle);
    var right = Victor(1, 0).rotate(car.angle);
    var forwardSpeed = velocityVec.dot(forward);
    var lateralSpeed = velocityVec.dot(right);
    var steerStep = (controls.steer === 0 ? STEER_RETURN_SPEED : STEER_SPEED) * dt;
    var targetWheelRotation = controls.steer * MAX_STEER_ANGLE;
    var drag = forwardSpeed >= 0 ? FORWARD_DRAG : REVERSE_DRAG;
    var yawRate;
    var nextVelocity;

    car.wheel_rotation = moveTowards(car.wheel_rotation, targetWheelRotation, steerStep);

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

    car.angle += yawRate * dt;
    car.angularVelocity = yawRate;
    car.enginePower = controls.throttle - controls.brake;

    forward = Victor(0, -1).rotate(car.angle);
    right = Victor(1, 0).rotate(car.angle);
    nextVelocity = forward.multiplyScalar(forwardSpeed).add(right.multiplyScalar(lateralSpeed));

    car.velocityVector.x = nextVelocity.x;
    car.velocityVector.y = nextVelocity.y;
    car.x += nextVelocity.x * dt;
    car.y += nextVelocity.y * dt;
};