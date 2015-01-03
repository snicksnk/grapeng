"use strict";
define(["socute/oLib"], function (oLib) {
    
    var Position = function (cords) {
        if (!cords) {
            cords = {'x': 0, 'y': 0};
        }
        this._cords = cords;
        this._lastCords = cords;
        this.sub = {};
    };


    Position.extract = function (argPosition){
        if (typeof argPosition['getCoords'] === 'function') {
            return argPosition.clone();
        } else {
            return new Position(argPosition);
        }
    }

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

    Position.prototype.getDiffWith=function(otherPosition){
        var diffCoordinates={}, otherCoords = otherPosition.getPosition();

        for (var dimension in this._cords){
            diffCoordinates[dimension]=otherCoords[dimension] - this._cords[dimension];
        }

        return diffCoordinates;
    }

    Position.prototype.clone = function(){
        var pos = new Position(this.getCoords());
        if (this.sub.length>0){

        }

        return pos;
    }


    Position.prototype._cloneSUbPositions = function(sub){
        SoCuteGraph.oLib.each(sub, function(index, val){

        });
    }


    Position.getDiffAmount = function(diffCoords){
        var diffAmount = 0;
        for (var dimension in diffCoords){
            diffAmount+=diffCoords[dimension];
        }

        return Math.abs(diffAmount);
    }


    Position.getCenterPoint = function(position1, position2){
        var diffCords = position1.getDiffWith(position2);
        var centerPosition = new Position();
        var centerCords = {};

        for (var dimension in position1.getPosition()){
            if (position1.getPosition()[dimension]<position2.getPosition()[dimension]){
                centerCords[dimension] = position1.getPosition()[dimension] + diffCords[dimension]/2;
            } else {
                centerCords[dimension] = position2.getPosition()[dimension] + diffCords[dimension]/2;
            }
        }
        centerPosition.setPos(centerCords);
        return centerPosition;
    }

    Position.getCenterOfPointsArray = function (points) {
        var centerPoint = false;
        for(var p in points){
            var point = points[p];
            if (centerPoint) {
                centerPoint = Position.getCenterPoint(centerPoint, point);
      
            } else {
                centerPoint = point;
            }
        }
        return centerPoint;
    }

    Position.prototype.findNearest = function (positions) {
        var that = this;
        var nearestIndex = false;
        var nearestAmount = false;
        oLib.each(positions, function(index, position) {
            var thisPos = that.clone();
            thisPos.setReverseDiff(position.getCoords());
            var amount = Position.getDiffAmount(thisPos.getCoords());   
            if (nearestAmount === false || amount < nearestAmount) {
                nearestAmount = amount;
                nearestIndex = index;
            }
        });

        return positions[nearestIndex];
    }

    Position.prototype.setDiff = function(diff){
        var newCords={};

        var that = this;
        if (arguments.length > 1){ 
            var diffs = Array.prototype.slice.call(arguments, 1);
            oLib.each(diffs, function(index, arg){
                that.setDiff(arg);
            })
        };

        for (var dimension in diff){
            newCords[dimension] = this._cords[dimension]+diff[dimension];
        }

        this.setPos(newCords);
    }

    Position.prototype.setReverseDiff=function(diff){
        var newCords={};

        var that = this;
        if (arguments.length > 1){ 
            var diffs = Array.prototype.slice.call(arguments, 1);
                oLib.each(diffs, function(index, arg){
                    that.setReverseDiff(arg);
            });
        };

        for (var dimension in diff){
            newCords[dimension]=this._cords[dimension] - diff[dimension];
        }

        this.setPos(newCords);
    }

    Position.prototype.getCoords = function(){
        return this._cords;
    }

    Position.prototype.setCoords = function(){
        this._lastCords=this._cords;
        this._cords=cords;
    }


    //TODO Replace it
    Position.prototype.getPosition=function(){
        return this._cords;
    }

    Position.prototype.setPos=function(cords){
        this._lastCords=this._cords;
        this._cords=cords;
    };

    return Position;
});