var ARROW_KEYS = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];

// Listens on one element (not the whole page), so arrow keys only drive while the game
// has focus and the rest of the page keeps scrolling normally
function Keys(target) {
    this.target = target;
    this.stateOfKeys = {};
    this.releaseAll();

    this.onKeyDown = function(evt) {
        if (ARROW_KEYS.indexOf(evt.key) !== -1) {
            evt.preventDefault();
            this.stateOfKeys[evt.key] = 'down';
        }
    }.bind(this);

    this.onKeyUp = function(evt) {
        if (ARROW_KEYS.indexOf(evt.key) !== -1) {
            evt.preventDefault();
            this.stateOfKeys[evt.key] = 'up';
        }
    }.bind(this);

    // A key released while focus was elsewhere would otherwise stay held down
    this.onBlur = this.releaseAll.bind(this);

    target.addEventListener('keydown', this.onKeyDown, false);
    target.addEventListener('keyup', this.onKeyUp, false);
    target.addEventListener('blur', this.onBlur, false);
}

Keys.prototype.releaseAll = function() {
    var index;

    for (index = 0; index < ARROW_KEYS.length; index += 1) {
        this.stateOfKeys[ARROW_KEYS[index]] = 'up';
    }
}

Keys.prototype.destroy = function() {
    this.target.removeEventListener('keydown', this.onKeyDown, false);
    this.target.removeEventListener('keyup', this.onKeyUp, false);
    this.target.removeEventListener('blur', this.onBlur, false);
}

Keys.prototype.getControls = function() {
    return {
        steer: (this.stateOfKeys.ArrowRight == 'down' ? 1 : 0) - (this.stateOfKeys.ArrowLeft == 'down' ? 1 : 0),
        throttle: this.stateOfKeys.ArrowUp == 'down' ? 1 : 0,
        brake: this.stateOfKeys.ArrowDown == 'down' ? 1 : 0
    };
}

export default Keys;
