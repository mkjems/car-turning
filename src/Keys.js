function Keys() {
    this.stateOfKeys = {
        ArrowLeft: 'up',
        ArrowDown: 'up',
        ArrowRight: 'up',
        ArrowUp: 'up'
    };

    document.getElementsByTagName('body')[0].addEventListener('keydown', function(evt) {
        switch(evt.which) {
        case 37:
            this.stateOfKeys.ArrowLeft = 'down';
            break;
        case 40:
            this.stateOfKeys.ArrowDown = 'down';
            break;
        case 38:
            this.stateOfKeys.ArrowUp = 'down';
            break;
        case 39:
            this.stateOfKeys.ArrowRight = 'down';
            break;
        }
    }.bind(this),false);

    document.getElementsByTagName('body')[0].addEventListener('keyup', function(evt) {
        switch(evt.which) {
        case 37:
            this.stateOfKeys.ArrowLeft = 'up';
            break;
        case 40:
            this.stateOfKeys.ArrowDown = 'up';
            break;
        case 38:
            this.stateOfKeys.ArrowUp = 'up';
            break;
        case 39:
            this.stateOfKeys.ArrowRight = 'up';
            break;
        }
    }.bind(this),false);
}

Keys.prototype.getActions = function() {
    var actions = [];
    for (var keyName in this.stateOfKeys) {
        if(this.stateOfKeys[keyName] == 'down'){
            actions.push({
                type: 'KEY_DOWN',
                key: keyName
            });
        }
    }
    return actions;
}

module.exports = Keys;

