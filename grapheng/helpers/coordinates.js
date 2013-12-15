SoCuteGraph.nsCrete("helpers.coordinates");

SoCuteGraph.helpers.coordinates = (function () {
    "use strict";
    var Position = function (cords) {
        if (!cords) {
            cords = {'x': 0, 'y': 0};
        }
        this._cords = cords;
        this._lastCords = cords;
        this.sub = {};
    };

    Position.prototype._lastGettedCords = {};

    Position.prototype._cords = {};

    Position.prototype._lastCords = {};

    Position.prototype.sub = {};

    Position.prototype.orientation = false;

    Position.prototype.getNewPos=function(){
        var resultCoordinates=false;
        if (this._cords != this._lastGettedCords){
            this._lastGettedCords = this._cords;
            resultCoordinates = this._cords;
        }
        return resultCoordinates;
    }

    Position.prototype.getPositionDiff=function(){
        var diffCoordinates={};
        /*
        if (this._cords===this._lastCords){
            return false;
        }
        */



        for (var dimension in this._cords){
            diffCoordinates[dimension]=this._cords[dimension]-this._lastCords[dimension];
        }

        this._lastGettedCords = this._cords;
        //this._lastCords=this._cords;
        return diffCoordinates;
    }

    Position.prototype.setDiff=function(diff){
        var newCords={};
        for (var dimension in diff){
            newCords[dimension]=this._cords[dimension]+diff[dimension];
        }
        this.setPos(newCords);
    }

    Position.prototype.getPosition=function(){
        return this._cords;
    }

    Position.prototype.setPos=function(cords){
        this._lastCords=this._cords;
        this._cords=cords;
    };

    return {
        'Position':Position
    }

})();