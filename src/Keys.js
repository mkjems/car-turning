function Keys() {
    this.stateOfKeys = {
        ArrowLeft: 'up',
        ArrowDown: 'up',
        ArrowRight: 'up',
        ArrowUp: 'up'
    };

    document.getElementsByTagName('body')[0].addEventListener('keydown', function(evt) {
        switch(evt.key) {
        case 'ArrowLeft':
            evt.preventDefault();
            this.stateOfKeys.ArrowLeft = 'down';
            break;
        case 'ArrowDown':
            evt.preventDefault();
            this.stateOfKeys.ArrowDown = 'down';
            break;
        case 'ArrowUp':
            evt.preventDefault();
            this.stateOfKeys.ArrowUp = 'down';
            break;
        case 'ArrowRight':
            evt.preventDefault();
            this.stateOfKeys.ArrowRight = 'down';
            break;
        }
    }.bind(this),false);

    document.getElementsByTagName('body')[0].addEventListener('keyup', function(evt) {
        switch(evt.key) {
        case 'ArrowLeft':
            evt.preventDefault();
            this.stateOfKeys.ArrowLeft = 'up';
            break;
        case 'ArrowDown':
            evt.preventDefault();
            this.stateOfKeys.ArrowDown = 'up';
            break;
        case 'ArrowUp':
            evt.preventDefault();
            this.stateOfKeys.ArrowUp = 'up';
            break;
        case 'ArrowRight':
            evt.preventDefault();
            this.stateOfKeys.ArrowRight = 'up';
            break;
        }
    }.bind(this),false);
}

Keys.prototype.getControls = function() {
    return {
        steer: (this.stateOfKeys.ArrowRight == 'down' ? 1 : 0) - (this.stateOfKeys.ArrowLeft == 'down' ? 1 : 0),
        throttle: this.stateOfKeys.ArrowUp == 'down' ? 1 : 0,
        brake: this.stateOfKeys.ArrowDown == 'down' ? 1 : 0
    };
}

module.exports = Keys;

