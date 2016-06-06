var Victor = require('victor');
var rayfromVectorAndPoint = require('../Ray.js').rayfromVectorAndPoint;
var intersection = require('../Ray.js').intersection;

module.exports = function(state, action) {
    var stateCar = state.cars[0];
    var actionCar = action.car;


    // Slow down, (simulate inertia)
    state.cars[0].velocity = Math.max(state.cars[0].velocity -0.05, 0);

    // find next position
    if(stateCar.wheel_rotation > -.1 && stateCar.wheel_rotation < .1){
        var vec = Victor(Math.abs(stateCar.velocity) , 0);
        vec.rotateBy((stateCar.velocity < 0 ? Math.PI: 0)-(Math.PI/2) + stateCar.angle);
        state.cars[0].x += vec.x
        state.cars[0].y += vec.y
    } else {
        // Line perpendicular to front wheel
        var FrontWheelVec = Victor(stateCar.x, stateCar.y)
            .add( Victor(( stateCar.wheel_rotation < 0 ? -1 : 1) * actionCar.half_wagon_width, -actionCar.half_wagon_length).rotate(stateCar.angle) );
        var frontWheelRay = rayfromVectorAndPoint(Victor(200,0).rotate(stateCar.wheel_rotation).rotate(stateCar.angle),{
            x:FrontWheelVec.x,
            y:FrontWheelVec.y
        });
        // Line perpendicular to rear wheel
        var vec3 = Victor(stateCar.x, stateCar.y)
            .add( Victor(0, actionCar.half_wagon_length).rotate(stateCar.angle) );
        var rearWheelRay = rayfromVectorAndPoint(Victor(200,0).rotate(stateCar.angle),{
            x:vec3.x,
            y:vec3.y
        });
        // Turn radius center
        var turnRadiusCenter = intersection(frontWheelRay, rearWheelRay);
        if(turnRadiusCenter) {
            var v4 = Victor((stateCar.x - turnRadiusCenter.x), (stateCar.y - turnRadiusCenter.y));

            var circumfrence = 2 * v4.length() * Math.PI;
            var angleDelta = (stateCar.velocity !== 0) ? (stateCar.wheel_rotation < 0 ? -1: 1) * ((stateCar.velocity*10)/circumfrence) : 0 ;

            var v5 = Victor(turnRadiusCenter.x, turnRadiusCenter.y)
                .add(v4.rotate( angleDelta));

            state.cars[0].x = v5.x;
            state.cars[0].y = v5.y;
            state.cars[0].angle += angleDelta;
        }

    }
    return state;
};