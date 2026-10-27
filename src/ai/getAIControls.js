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

var LOOK_FOR_TRAFFIC = 240;
var CLEAR_BEHIND = 80;
var LANE_BLEND = 0.02;
var LANE_BLEND_SLOW_CAR = 0.05;
var SIDE_MARGIN = 6;
// A bit under the real brakes, so the CPU stops short rather than taps the car
var BRAKING = 260;
// Gap to leave when stopping behind a car: a few px, plus more the faster we're closing
var STOP_SHORT = 4;
var STOP_SHORT_PER_SPEED = 0.1;
var CREEP_SPEED = 30;
var STUCK_SPEED = 12;
var STUCK_TIME = 0.6;
var REVERSE_TIME = 1.2;

// Signed distance from the centre line, positive to the right of travel
function getLateral(raceTrack, progress, point) {
    var center = track.getPointAtDistance(raceTrack, progress);
    var heading = track.getHeadingAtDistance(raceTrack, progress);

    return ((point.x - center.x) * Math.cos(heading)) + ((point.y - center.y) * Math.sin(heading));
}

function getOffsetPoint(raceTrack, progress, lateral) {
    var center = track.getPointAtDistance(raceTrack, progress);
    var heading = track.getHeadingAtDistance(raceTrack, progress);

    return {
        x: center.x + (Math.cos(heading) * lateral),
        y: center.y + (Math.sin(heading) * lateral)
    };
}

// How far a car's footprint reaches across the track and along it, at a given heading of the track
function getExtents(car, heading) {
    var alongForward = Math.abs(Math.cos(car.angle - heading));
    var alongRight = Math.abs(Math.sin(car.angle - heading));

    return {
        across: (car.halfLength * alongRight) + (car.halfWidth * alongForward),
        along: (car.halfLength * alongForward) + (car.halfWidth * alongRight)
    };
}

function getTrackSpeed(car, heading) {
    return (car.velocityVector.x * Math.sin(heading)) - (car.velocityVector.y * Math.cos(heading));
}

// Find the nearest car just ahead (or alongside) and choose a lane that fits past it
function planLane(car, raceTrack, progress, lateral, otherCars) {
    var maxLateral = raceTrack.halfWidth - car.collisionRadius - 3;
    var heading = track.getHeadingAtDistance(raceTrack, progress);
    var ownExtents = getExtents(car, heading);
    var targetLateral = 0;
    var blocker = null;
    var index;
    var other;
    var otherProgress;
    var otherHeading;
    var gap;
    var clearance;
    var rightLane;
    var leftLane;
    var rightFits;
    var leftFits;
    var side;
    var overlapWidth;
    var straightLateral;
    var followLateral;

    for (index = 0; index < otherCars.length; index += 1) {
        other = otherCars[index];
        otherProgress = track.getClosestProgress(raceTrack, other).progress;
        gap = wrapAngle(((otherProgress - progress) / raceTrack.totalLength) * Math.PI * 2) / (Math.PI * 2) * raceTrack.totalLength;
        otherHeading = track.getHeadingAtDistance(raceTrack, otherProgress);

        // Look further ahead the faster we're closing, so there's time to move across
        if (gap > -CLEAR_BEHIND && gap < LOOK_FOR_TRAFFIC + (Math.max(0, getTrackSpeed(car, heading) - getTrackSpeed(other, heading)) * 0.8) && (!blocker || gap < blocker.gap)) {
            blocker = {
                gap: gap,
                lateral: getLateral(raceTrack, otherProgress, other),
                extents: getExtents(other, otherHeading),
                speed: getTrackSpeed(other, otherHeading)
            };
        }
    }

    if (!blocker) {
        car.aiPassSide = 0;
    } else {
        otherHeading = track.getHeadingAtDistance(raceTrack, progress + blocker.gap);
        clearance = blocker.extents.across + ownExtents.across + SIDE_MARGIN;
        rightLane = blocker.lateral + clearance;
        leftLane = blocker.lateral - clearance;
        rightFits = rightLane <= maxLateral;
        leftFits = leftLane >= -maxLateral;

        // Commit to a side for the whole pass, unless that side turns out to be blocked.
        // Prefer whichever fits; if both do, go round the outside of any bend, which is easier at speed.
        side = car.aiPassSide;
        if (!side || (side > 0 && !rightFits && leftFits) || (side < 0 && !leftFits && rightFits)) {
            if (rightFits !== leftFits) {
                side = rightFits ? 1 : -1;
            } else {
                side = wrapAngle(otherHeading - heading) > 0.05 ? -1 : 1;
            }
        }
        car.aiPassSide = side;

        targetLateral = clamp(side > 0 ? rightLane : leftLane, -maxLateral, maxLateral);
        blocker.clearAhead = blocker.gap - ownExtents.along - blocker.extents.along;
        // Where will we be across the track by the time we reach it? Either we hold our line
        // relative to the track (following the bend), or we carry straight on. At speed, brake if
        // either path hits it; when creeping, only the straight one counts, so we can edge round it.
        overlapWidth = blocker.extents.across + car.halfWidth + 2;
        straightLateral = getLateral(raceTrack, progress + blocker.gap, {
            x: car.x + (Math.sin(car.angle) * Math.max(0, blocker.gap)),
            y: car.y - (Math.cos(car.angle) * Math.max(0, blocker.gap))
        });
        followLateral = lateral + (Math.tan(clamp(wrapAngle(car.angle - heading), -1, 1)) * Math.max(0, blocker.clearAhead));
        blocker.overlapsLane = Math.abs(straightLateral - blocker.lateral) < overlapWidth
            || (getTrackSpeed(car, heading) > CREEP_SPEED * 1.5 && Math.abs(followLateral - blocker.lateral) < overlapWidth);
        blocker.closingSpeed = getTrackSpeed(car, heading) - blocker.speed;
    }

    if (typeof car.aiLateral !== 'number') {
        car.aiLateral = lateral;
    }
    car.aiLateral += (targetLateral - car.aiLateral) * (blocker && Math.abs(blocker.speed) < 40 ? LANE_BLEND_SLOW_CAR : LANE_BLEND);

    return blocker;
}

// Brake if we can't stop before the car in our lane at the speed we're closing on it
function avoidCarAhead(controls, blocker, forwardSpeed, laneError) {
    var closingSpeed;
    var stoppingDistance;
    var stopShort;

    if (!blocker || !blocker.overlapsLane || blocker.gap <= 0) {
        return;
    }

    closingSpeed = Math.max(0, blocker.closingSpeed);
    stoppingDistance = (closingSpeed * closingSpeed) / (2 * BRAKING);
    stopShort = STOP_SHORT + (closingSpeed * STOP_SHORT_PER_SPEED);

    if (blocker.clearAhead - stopShort > stoppingDistance * 1.3) {
        return;
    }

    if (forwardSpeed > CREEP_SPEED) {
        controls.throttle = 0;
        if (blocker.clearAhead - stopShort < stoppingDistance) {
            controls.brake = 1;
        }
        return;
    }

    // Close in: only creep forward while steering out from behind it.
    // Braking while stopped means reversing, so only brake while still rolling forwards.
    if (blocker.clearAhead > 4 && Math.abs(laneError) > 4) {
        controls.throttle = 1;
        controls.brake = 0;
    } else {
        controls.throttle = 0;
        controls.brake = forwardSpeed > 2 ? 1 : 0;
    }
}

// Back out of trouble: if we've barely moved for a while, reverse with the wheels turned
// so the nose swings towards where we want to go
function reverseIfStuck(car, controls, forwardSpeed, angleError, dt) {
    if (car.aiReverseTime > 0) {
        car.aiReverseTime -= dt;
        controls.throttle = 0;
        controls.brake = 1;
        controls.steer = -clamp(angleError / (Math.PI / 4), -1, 1);
        return;
    }

    car.aiStuckTime = Math.abs(forwardSpeed) < STUCK_SPEED ? (car.aiStuckTime || 0) + dt : 0;

    if (car.aiStuckTime > STUCK_TIME) {
        car.aiStuckTime = 0;
        car.aiReverseTime = REVERSE_TIME;
    }
}

export default function getAIControls(car, raceTrack, otherCars, dt) {
    var closest = track.getClosestProgress(raceTrack, car);
    var speed = Math.sqrt((car.velocityVector.x * car.velocityVector.x) + (car.velocityVector.y * car.velocityVector.y));
    var forwardSpeed = (car.velocityVector.x * Math.sin(car.angle)) - (car.velocityVector.y * Math.cos(car.angle));
    var lookAhead = 90 + (speed * 0.45);
    var lateral = getLateral(raceTrack, closest.progress, car);
    var blocker = planLane(car, raceTrack, closest.progress, lateral, otherCars || []);
    var targetProgress;

    var nearBlocker = blocker && blocker.gap > 0 && blocker.gap < lookAhead;

    // With a car close ahead, aim for the gap beside it rather than far down the road
    if (nearBlocker) {
        lookAhead = Math.max(35, blocker.gap);
    }
    targetProgress = closest.progress + lookAhead;
    var targetPoint = getOffsetPoint(raceTrack, targetProgress, car.aiLateral);
    var futureHeading = track.getHeadingAtDistance(raceTrack, targetProgress + 70);
    var desiredAngle = Math.atan2(targetPoint.y - car.y, targetPoint.x - car.x) + (Math.PI / 2);
    var angleError = wrapAngle(desiredAngle - car.angle);
    var headingError = Math.abs(wrapAngle(futureHeading - car.angle));
    var desiredSpeed = 280 - (Math.min(headingError, 1.1) * 110);
    var alongside = blocker && Math.abs(blocker.gap) < 60;
    var controls;

    desiredSpeed = Math.max(160, desiredSpeed);

    controls = {
        // Steer harder when picking a way round a car close ahead
        steer: clamp(angleError / (nearBlocker ? Math.PI / 6 : Math.PI / 3), -1, 1),
        throttle: speed < desiredSpeed ? 1 : 0,
        brake: speed > desiredSpeed + 30 ? 1 : 0
    };

    if (Math.abs(lateral - car.aiLateral) > raceTrack.halfWidth * 0.6) {
        var recoveryPoint = getOffsetPoint(raceTrack, closest.progress + 28, car.aiLateral);
        var recoveryAngle = Math.atan2(recoveryPoint.y - car.y, recoveryPoint.x - car.x) + (Math.PI / 2);
        var recoveryError = wrapAngle(recoveryAngle - car.angle);

        controls.steer = clamp(recoveryError / (Math.PI / 4), -1, 1);
        controls.throttle = 1;
        // Keep the power on when being leaned on by a car alongside
        controls.brake = !alongside && speed > 120 && Math.abs(recoveryError) > 0.45 ? 1 : 0;
    }

    avoidCarAhead(controls, blocker, forwardSpeed, car.aiLateral - lateral);
    reverseIfStuck(car, controls, forwardSpeed, angleError, dt || (1 / 120));

    return controls;
}
