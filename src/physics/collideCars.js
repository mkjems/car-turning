// Car vs car collisions using each car's rotated footprint (body + wheels)
var RESTITUTION = 0.35;
var FRICTION = 0.3;
var CONTACT_TOLERANCE = 1;

function getAxes(car) {
    return {
        forward: { x: Math.sin(car.angle), y: -Math.cos(car.angle) },
        right: { x: Math.cos(car.angle), y: Math.sin(car.angle) }
    };
}

function getCorners(car, axes) {
    var corners = [];
    var signs = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
    var index;

    for (index = 0; index < signs.length; index += 1) {
        corners.push({
            x: car.x + (axes.forward.x * car.halfLength * signs[index][0]) + (axes.right.x * car.halfWidth * signs[index][1]),
            y: car.y + (axes.forward.y * car.halfLength * signs[index][0]) + (axes.right.y * car.halfWidth * signs[index][1])
        });
    }

    return corners;
}

function dot(a, b) {
    return (a.x * b.x) + (a.y * b.y);
}

function cross(a, b) {
    return (a.x * b.y) - (a.y * b.x);
}

// How far the box reaches along an axis from its centre
function projectRadius(car, axes, axis) {
    return (car.halfLength * Math.abs(dot(axes.forward, axis))) + (car.halfWidth * Math.abs(dot(axes.right, axis)));
}

function getInertia(car) {
    var length = car.halfLength * 2;
    var width = car.halfWidth * 2;

    return car.mass * ((length * length) + (width * width)) / 12;
}

// Separating axis test; returns the push-out normal (from a to b), depth and contact point
function findContact(a, b) {
    var axesA = getAxes(a);
    var axesB = getAxes(b);
    var candidates = [
        { axis: axesA.forward, owner: 'a' },
        { axis: axesA.right, owner: 'a' },
        { axis: axesB.forward, owner: 'b' },
        { axis: axesB.right, owner: 'b' }
    ];
    var centerDelta = { x: b.x - a.x, y: b.y - a.y };
    var best;
    var index;
    var axis;
    var overlap;
    var corners;
    var cornerIndex;
    var depths;
    var depth;
    var deepestDepth = -Infinity;
    var contactCount = 0;

    for (index = 0; index < candidates.length; index += 1) {
        axis = candidates[index].axis;
        overlap = projectRadius(a, axesA, axis) + projectRadius(b, axesB, axis) - Math.abs(dot(centerDelta, axis));

        if (overlap <= 0) {
            return null;
        }

        if (!best || overlap < best.depth) {
            best = { axis: axis, owner: candidates[index].owner, depth: overlap };
        }
    }

    best.normal = dot(centerDelta, best.axis) < 0
        ? { x: -best.axis.x, y: -best.axis.y }
        : { x: best.axis.x, y: best.axis.y };

    // The contact is the corner of the other car that digs deepest into the face we push out of.
    // When two corners are equally deep (flat face against face) use the middle of them.
    corners = best.owner === 'a' ? getCorners(b, axesB) : getCorners(a, axesA);
    depths = [];
    for (cornerIndex = 0; cornerIndex < corners.length; cornerIndex += 1) {
        depth = best.owner === 'a' ? -dot(corners[cornerIndex], best.normal) : dot(corners[cornerIndex], best.normal);
        depths.push(depth);
        deepestDepth = Math.max(deepestDepth, depth);
    }

    best.point = { x: 0, y: 0 };
    for (cornerIndex = 0; cornerIndex < corners.length; cornerIndex += 1) {
        if (depths[cornerIndex] > deepestDepth - CONTACT_TOLERANCE) {
            best.point.x += corners[cornerIndex].x;
            best.point.y += corners[cornerIndex].y;
            contactCount += 1;
        }
    }
    best.point.x /= contactCount;
    best.point.y /= contactCount;

    return best;
}

function pointVelocity(car, offset) {
    return {
        x: car.velocityVector.x - (car.angularVelocity * offset.y),
        y: car.velocityVector.y + (car.angularVelocity * offset.x)
    };
}

function applyImpulse(car, offset, impulse, sign) {
    car.velocityVector.x += sign * impulse.x / car.mass;
    car.velocityVector.y += sign * impulse.y / car.mass;
    car.spin += sign * cross(offset, impulse) / getInertia(car);
}

export default function collideCars(a, b) {
    var contact = findContact(a, b);
    var normal;
    var tangent;
    var offsetA;
    var offsetB;
    var inverseMassA;
    var inverseMassB;
    var relativeVelocity;
    var normalSpeed;
    var normalImpulse;
    var tangentSpeed;
    var tangentImpulse;
    var push;

    if (!contact) {
        return false;
    }

    normal = contact.normal;
    tangent = { x: -normal.y, y: normal.x };
    inverseMassA = 1 / a.mass;
    inverseMassB = 1 / b.mass;

    // Push the cars apart, the lighter one moving further
    push = contact.depth / (inverseMassA + inverseMassB);
    a.x -= normal.x * push * inverseMassA;
    a.y -= normal.y * push * inverseMassA;
    b.x += normal.x * push * inverseMassB;
    b.y += normal.y * push * inverseMassB;

    offsetA = { x: contact.point.x - a.x, y: contact.point.y - a.y };
    offsetB = { x: contact.point.x - b.x, y: contact.point.y - b.y };
    relativeVelocity = {
        x: pointVelocity(b, offsetB).x - pointVelocity(a, offsetA).x,
        y: pointVelocity(b, offsetB).y - pointVelocity(a, offsetA).y
    };
    normalSpeed = dot(relativeVelocity, normal);

    // Already moving apart
    if (normalSpeed > 0) {
        return true;
    }

    normalImpulse = -(1 + RESTITUTION) * normalSpeed / (
        inverseMassA + inverseMassB
        + (Math.pow(cross(offsetA, normal), 2) / getInertia(a))
        + (Math.pow(cross(offsetB, normal), 2) / getInertia(b))
    );

    // Rubbing sideways along each other, capped by friction
    tangentSpeed = dot(relativeVelocity, tangent);
    tangentImpulse = -tangentSpeed / (
        inverseMassA + inverseMassB
        + (Math.pow(cross(offsetA, tangent), 2) / getInertia(a))
        + (Math.pow(cross(offsetB, tangent), 2) / getInertia(b))
    );
    tangentImpulse = Math.max(-FRICTION * normalImpulse, Math.min(FRICTION * normalImpulse, tangentImpulse));

    push = {
        x: (normal.x * normalImpulse) + (tangent.x * tangentImpulse),
        y: (normal.y * normalImpulse) + (tangent.y * tangentImpulse)
    };
    applyImpulse(a, offsetA, push, -1);
    applyImpulse(b, offsetB, push, 1);

    return true;
}
