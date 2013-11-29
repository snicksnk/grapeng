SoCuteGraph.nsCrete("helpers.coordinates");

SoCuteGraph.helpers.coordinates = (function () {
    "use strict";
    var Position = function (cords) {
        if (!cords) {
            cords = {'x': 0, 'y': 0};
        }
        this._cords = cords;
        this.sub = {};
    };

    Position.prototype._lastCords = {};

    Position.prototype._cords = {};

    Position.prototype.sub = {};

    Position.prototype.orientation = false;

    Position.prototype.getNewPos=function(){
        var resultCoordinates=false;
        if (this._cords != this._lastCords){
            this._lastCords = this._cords;
            resultCoordinates = this._cords;
        }
        return resultCoordinates;
    }

    Position.prototype.getPosition=function(){
        return this._cords;
    }

    Position.prototype.setPos=function(cords){
        this._cords=cords;
    };

    return {
        'Position':Position
    }

})();