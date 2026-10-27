function createTrack() {
    var points = [];
    var centerX = 600;
    var centerY = 400;
    var halfStraightX = 270;
    var halfStraightY = 110;
    var cornerRadius = 140;
    var cornerSamples = 24;
    var corners = [
        { x: centerX + halfStraightX, y: centerY + halfStraightY, startAngle: 0 },
        { x: centerX - halfStraightX, y: centerY + halfStraightY, startAngle: Math.PI / 2 },
        { x: centerX - halfStraightX, y: centerY - halfStraightY, startAngle: Math.PI },
        { x: centerX + halfStraightX, y: centerY - halfStraightY, startAngle: Math.PI * 1.5 }
    ];
    var index;
    var cornerIndex;
    var corner;
    var angle;

    // A rounded square: straights joined by quarter-circle corners.
    // Starts mid-way down the right-hand straight and runs clockwise.
    points.push({ x: centerX + halfStraightX + cornerRadius, y: centerY });

    for (cornerIndex = 0; cornerIndex < corners.length; cornerIndex += 1) {
        corner = corners[cornerIndex];
        for (index = 0; index <= cornerSamples; index += 1) {
            angle = corner.startAngle + ((index / cornerSamples) * (Math.PI / 2));
            points.push({
                x: corner.x + (Math.cos(angle) * cornerRadius),
                y: corner.y + (Math.sin(angle) * cornerRadius)
            });
        }
    }

    return buildTrack(points, 70);
}

function buildTrack(points, halfWidth) {
    var segments = [];
    var totalLength = 0;
    var index;

    for (index = 0; index < points.length; index += 1) {
        var start = points[index];
        var end = points[(index + 1) % points.length];
        var dx = end.x - start.x;
        var dy = end.y - start.y;
        var length = Math.sqrt((dx * dx) + (dy * dy));

        segments.push({
            start: start,
            end: end,
            length: length,
            cumulativeLength: totalLength,
            dx: dx,
            dy: dy
        });
        totalLength += length;
    }

    return {
        points: points,
        segments: segments,
        halfWidth: halfWidth,
        totalLength: totalLength
    };
}

function wrapDistance(track, distance) {
    var wrapped = distance;

    while (wrapped < 0) {
        wrapped += track.totalLength;
    }

    while (wrapped >= track.totalLength) {
        wrapped -= track.totalLength;
    }

    return wrapped;
}

function lerpPoint(start, end, t) {
    return {
        x: start.x + ((end.x - start.x) * t),
        y: start.y + ((end.y - start.y) * t)
    };
}

function getSegmentAtDistance(track, distance) {
    var wrapped = wrapDistance(track, distance);
    var index;
    var segment;

    for (index = 0; index < track.segments.length; index += 1) {
        segment = track.segments[index];
        if (wrapped <= segment.cumulativeLength + segment.length) {
            return {
                segment: segment,
                distanceOnSegment: wrapped - segment.cumulativeLength
            };
        }
    }

    segment = track.segments[track.segments.length - 1];
    return {
        segment: segment,
        distanceOnSegment: segment.length
    };
}

function getPointAtDistance(track, distance) {
    var segmentInfo = getSegmentAtDistance(track, distance);
    var t = segmentInfo.segment.length === 0 ? 0 : segmentInfo.distanceOnSegment / segmentInfo.segment.length;

    return lerpPoint(segmentInfo.segment.start, segmentInfo.segment.end, t);
}

function getHeadingAtDistance(track, distance) {
    var segment = getSegmentAtDistance(track, distance).segment;
    return Math.atan2(segment.dy, segment.dx) + (Math.PI / 2);
}

function getClosestProgress(track, point) {
    var bestMatch;
    var bestDistanceSq = Infinity;
    var index;

    for (index = 0; index < track.segments.length; index += 1) {
        var segment = track.segments[index];
        var lengthSq = (segment.dx * segment.dx) + (segment.dy * segment.dy);
        var t = lengthSq === 0 ? 0 : (((point.x - segment.start.x) * segment.dx) + ((point.y - segment.start.y) * segment.dy)) / lengthSq;
        var clampedT = Math.max(0, Math.min(1, t));
        var closest = lerpPoint(segment.start, segment.end, clampedT);
        var normalX = point.x - closest.x;
        var normalY = point.y - closest.y;
        var distanceSq = (normalX * normalX) + (normalY * normalY);
        var normalLength = Math.sqrt(distanceSq);

        if (distanceSq < bestDistanceSq) {
            if (normalLength < 0.0001) {
                normalX = -segment.dy;
                normalY = segment.dx;
                normalLength = Math.sqrt((normalX * normalX) + (normalY * normalY)) || 1;
            }

            bestDistanceSq = distanceSq;
            bestMatch = {
                point: closest,
                progress: segment.cumulativeLength + (segment.length * clampedT),
                distance: Math.sqrt(distanceSq),
                normal: {
                    x: normalX / normalLength,
                    y: normalY / normalLength
                }
            };
        }
    }

    return bestMatch;
}

var WALL_BOUNCE = 0.6;
var WALL_IMPACT_LOSS = 0.35;
var WALL_DEFLECT = 0.6;

function wrapAngle(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
}

// Only speed into the wall is lost; a glancing scrape keeps most of its pace
function bounceOffWall(car, normal, normalSpeed) {
    var speed = Math.sqrt((car.velocityVector.x * car.velocityVector.x) + (car.velocityVector.y * car.velocityVector.y));
    var impactRatio = speed === 0 ? 0 : normalSpeed / speed;
    var keep = 1 - (WALL_IMPACT_LOSS * impactRatio);
    var forwardX = Math.sin(car.angle);
    var forwardY = -Math.cos(car.angle);
    var tangentX = -normal.y;
    var tangentY = normal.x;
    var tangentAngle;

    car.velocityVector.x = (car.velocityVector.x - (normal.x * normalSpeed * (1 + WALL_BOUNCE))) * keep;
    car.velocityVector.y = (car.velocityVector.y - (normal.y * normalSpeed * (1 + WALL_BOUNCE))) * keep;
    car.angularVelocity *= 0.65;

    // If the nose points into the wall, swing it towards running along the wall
    // (whichever way it already leans) so the car doesn't keep driving into it
    if ((forwardX * normal.x) + (forwardY * normal.y) > 0) {
        if ((forwardX * tangentX) + (forwardY * tangentY) < 0) {
            tangentX = -tangentX;
            tangentY = -tangentY;
        }
        tangentAngle = Math.atan2(tangentX, -tangentY);
        car.angle += wrapAngle(tangentAngle - car.angle) * WALL_DEFLECT * impactRatio;
    }
}

function syncCarToTrack(car, track) {
    var closest = getClosestProgress(track, car);
    var previousProgress = typeof car.trackProgress === 'number' ? car.trackProgress : closest.progress;
    var allowedDistance = Math.max(6, track.halfWidth - car.collisionRadius);
    var normalSpeed;

    if (closest.distance > allowedDistance) {
        car.x = closest.point.x + (closest.normal.x * allowedDistance);
        car.y = closest.point.y + (closest.normal.y * allowedDistance);

        normalSpeed = (car.velocityVector.x * closest.normal.x) + (car.velocityVector.y * closest.normal.y);
        if (normalSpeed > 0) {
            bounceOffWall(car, closest.normal, normalSpeed);
        }

        closest = getClosestProgress(track, car);
    }

    if ((closest.progress - previousProgress) < (-track.totalLength / 2)) {
        car.lap += 1;
    }

    // Reversing back over the start line (even before the first lap) undoes a lap
    if ((closest.progress - previousProgress) > (track.totalLength / 2)) {
        car.lap -= 1;
    }

    car.trackProgress = closest.progress;
    car.distanceFromCenter = closest.distance;
    car.raceDistance = (car.lap * track.totalLength) + closest.progress;

    return closest;
}

function createPlacement(track, progress, lateralOffset) {
    var point = getPointAtDistance(track, progress);
    var angle = getHeadingAtDistance(track, progress);

    return {
        progress: wrapDistance(track, progress),
        angle: angle,
        x: point.x + (Math.cos(angle) * lateralOffset),
        y: point.y + (Math.sin(angle) * lateralOffset)
    };
}

export {
    createTrack,
    createPlacement,
    getClosestProgress,
    getHeadingAtDistance,
    getPointAtDistance,
    syncCarToTrack
};
