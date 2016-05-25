
Keys = function() {
    this.key = {
        a: 'up',
        s: 'up',
        d: 'up',
        w: 'up',
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
    },false);

    document.getElementsByTagName('body')[0].addEventListener('keydown', function(evt) {
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
    },false);
};

Keys.prototype.getStateOfKeys = function() {
    return Object.assign({}, this.stateOfKeys);
}
