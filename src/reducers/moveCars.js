var Victor = require('victor');
var ENGINE_DECAY = 0.06;
var ACCELERATION = 0.18;
var MAX_FORWARD_SPEED = 8;
var MAX_REVERSE_SPEED = -3;
var FORWARD_DRAG = 0.985;
var LATERAL_GRIP = 0.68;
var STEERING_GRIP = 0.92;

function moveTowardsZero(value, delta) {
    if (value > 0) {
        return Math.max(0, value - delta);
    }

    if (value < 0) {
        return Math.min(0, value + delta);
    }

    return value;
}

module.exports = function(state, action) {
    var stateCar = state.cars[0];
    var wheelBase = action.car.wagon_length;
    var velocityVec = Victor.fromObject(stateCar.velocityVector);
    var forward = Victor(0, -1).rotate(stateCar.angle);
    var right = Victor(1, 0).rotate(stateCar.angle);
    var forwardSpeed = velocityVec.dot(forward);
    var lateralSpeed = velocityVec.dot(right);
    var nextEnginePower = moveTowardsZero(stateCar.enginePower, ENGINE_DECAY);
    var nextForwardSpeed = forwardSpeed + (nextEnginePower * ACCELERATION);
    var yawRate;
    var nextVelocity;

    nextForwardSpeed *= FORWARD_DRAG;
    nextForwardSpeed = Math.min(nextForwardSpeed, MAX_FORWARD_SPEED);
    nextForwardSpeed = Math.max(nextForwardSpeed, MAX_REVERSE_SPEED);

    lateralSpeed *= LATERAL_GRIP;

    yawRate = 0;
    if (Math.abs(stateCar.wheel_rotation) > 0.001 && Math.abs(nextForwardSpeed) > 0.001) {
        yawRate = (nextForwardSpeed / wheelBase) * Math.tan(stateCar.wheel_rotation) * STEERING_GRIP;
    }

    stateCar.angle += yawRate;
    stateCar.angularVelocity = yawRate;
    stateCar.enginePower = nextEnginePower;

    forward = Victor(0, -1).rotate(stateCar.angle);
    right = Victor(1, 0).rotate(stateCar.angle);
    nextVelocity = forward.multiplyScalar(nextForwardSpeed).add(right.multiplyScalar(lateralSpeed));

    stateCar.velocityVector.x = nextVelocity.x;
    stateCar.velocityVector.y = nextVelocity.y;
    stateCar.x += nextVelocity.x;
    stateCar.y += nextVelocity.y;

    return state;
};