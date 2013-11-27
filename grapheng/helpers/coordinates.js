SoCuteGraph.nsCrete("helpers.coordinates");

SoCuteGraph.helpers.coordinates=(function(){

    var Position=function(cords){
        if(!cords){
            cords={'x':0,'y':0}
        }
            this._cords=cords;
            this.sub={};
    };

    Position.prototype._lastCords={};

    Position.prototype._cords={};

    Position.prototype.sub={};

    Position.prototype.orientation=false;

    Position.prototype.getNewPos=function(){
        if (this._cords!=this._lastCords){
            this._lastCords=this._cords;
            return this._cords;
        } else {
            return false;
        }
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