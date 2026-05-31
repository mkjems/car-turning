import * as track from '../track/track.js';

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function wrapAngle(angle) {
    var wrapped = angle;

    while (wrapped > Math.PI) {
        wrapped -= Math.PI * 2;
    }

    while (wrapped < -Math.PI) {
        wrapped += Math.PI * 2;
    }

    return wrapped;
}

export default function getAIControls(car, raceTrack) {
    var closest = track.getClosestProgress(raceTrack, car);
    var speed = Math.sqrt((car.velocityVector.x * car.velocityVector.x) + (car.velocityVector.y * car.velocityVector.y));
    var lookAhead = 90 + (speed * 0.45);
    var targetProgress = closest.progress + lookAhead;
    var targetPoint = track.getPointAtDistance(raceTrack, targetProgress);
    var futureHeading = track.getHeadingAtDistance(raceTrack, targetProgress + 70);
    var desiredAngle = Math.atan2(targetPoint.y - car.y, targetPoint.x - car.x) + (Math.PI / 2);
    var angleError = wrapAngle(desiredAngle - car.angle);
    var headingError = Math.abs(wrapAngle(futureHeading - car.angle));
    var desiredSpeed = 250 - (Math.min(headingError, 1.1) * 120);
    var controls;

    desiredSpeed = Math.max(125, desiredSpeed);

    controls = {
        steer: clamp(angleError / (Math.PI / 3), -1, 1),
        throttle: speed < desiredSpeed ? 1 : 0,
        brake: speed > desiredSpeed + 30 ? 1 : 0
    };

    if (closest.distance > raceTrack.halfWidth * 0.5) {
        var recoveryPoint = track.getPointAtDistance(raceTrack, closest.progress + 28);
        var recoveryAngle = Math.atan2(recoveryPoint.y - car.y, recoveryPoint.x - car.x) + (Math.PI / 2);
        var recoveryError = wrapAngle(recoveryAngle - car.angle);

        controls.steer = clamp(recoveryError / (Math.PI / 4), -1, 1);
        controls.throttle = 1;
        controls.brake = speed > 120 && Math.abs(recoveryError) > 0.45 ? 1 : 0;
    }

    return controls;
}
