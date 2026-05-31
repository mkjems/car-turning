function createTrack() {
    var points = [];
    var samples = 80;
    var index;
    var angle;
    var radiusScale;
    var x;
    var y;

    for (index = 0; index < samples; index += 1) {
        angle = (index / samples) * Math.PI * 2;
        radiusScale = 1 + (0.12 * Math.sin(angle * 2));
        x = 600 + (Math.cos(angle) * 260 * radiusScale);
        y = 400 + (Math.sin(angle) * 170 * (1 - (0.08 * Math.cos(angle * 2))));
        points.push({ x: x, y: y });
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
            car.velocityVector.x -= closest.normal.x * normalSpeed * 1.35;
            car.velocityVector.y -= closest.normal.y * normalSpeed * 1.35;
        }

        car.velocityVector.x *= 0.72;
        car.velocityVector.y *= 0.72;
        car.angularVelocity *= 0.65;
        closest = getClosestProgress(track, car);
    }

    if ((closest.progress - previousProgress) < (-track.totalLength / 2)) {
        car.lap += 1;
    }

    if ((closest.progress - previousProgress) > (track.totalLength / 2) && car.lap > 0) {
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

module.exports = {
    createTrack: createTrack,
    createPlacement: createPlacement,
    getClosestProgress: getClosestProgress,
    getHeadingAtDistance: getHeadingAtDistance,
    getPointAtDistance: getPointAtDistance,
    syncCarToTrack: syncCarToTrack
};