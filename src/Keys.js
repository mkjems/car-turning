function Keys() {
    this.stateOfKeys = {
        a: 'up',
        s: 'up',
        d: 'up',
        w: 'up'
    };

    document.getElementsByTagName('body')[0].addEventListener('keydown', function(evt) {
        switch(evt.which) {
        case 65:
            this.stateOfKeys.a = 'down';
            break;
        case 83:
            this.stateOfKeys.s = 'down';
            break;
        case 87:
            this.stateOfKeys.w = 'down';
            break;
        case 68:
            this.stateOfKeys.d = 'down';
            break;
        }
    }.bind(this),false);

    document.getElementsByTagName('body')[0].addEventListener('keyup', function(evt) {
        switch(evt.which) {
        case 65:
            this.stateOfKeys.a = 'up';
            break;
        case 83:
            this.stateOfKeys.s = 'up';
            break;
        case 87:
            this.stateOfKeys.w = 'up';
            break;
        case 68:
            this.stateOfKeys.d = 'up';
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

