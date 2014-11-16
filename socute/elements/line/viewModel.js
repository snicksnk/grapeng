"use strict";
define(["socute/coordinates/position"], function(Position){
    
    var ViewModel = function(scene, pointsResolver){
        if (scene, pointsResolver){
            this.init(scene, pointsResolver);
        }
    }

    ViewModel.prototype.init = function(scene, pointsResolver) {
        this.startPos = new Position();
        this.endPos = new Position();
        this._startNodeOrientation=false;
        this._endNodeOrientation=false;
        this._pointsResolver = pointsResolver;

        //this.moveStartPoint(new Position({'x':230,'y':'150'}))
        this.curve = scene.Path("0");

    }

    ViewModel.prototype.moveStartPoint=function(position, orientation){

        this.startPos.setPos(this._resolveNodeOutPoint(position, orientation).getPosition());

        this._startNodeOrientation=orientation;

        this.redrawLine();
    }

    ViewModel.prototype._resolveNodeOutPoint=function(position, orientation){
        return this._pointsResolver.resolveStartPoint(position, orientation);
    }

    ViewModel.prototype._resolveNodeInPoint=function(position, orientation){
        return this._pointsResolver.resolveEndPoint(position, orientation);
    }

    ViewModel.prototype.moveEndPoint=function(position, orientation){
        this.endPos.setPos(this._resolveNodeInPoint(position, orientation).getPosition());
        this._endNodeOrientation=orientation;
        this.redrawLine();
    }

    ViewModel.prototype.hide = function () {
        this.curve.hide();
    }

    ViewModel.prototype.redrawLine=function(start, end){

        if (start &&  end){
            var start = start.getPosition();
            var end = end.getPosition();
        } else {
            var start = this.getStartPostion();
            var end = this.getEndPosition();
        }

        this.curve.setPath(start, end);

    }

    ViewModel.prototype.getStartPostion=function(){
        var start=this.startPos.getPosition();
        return start;
    }

    ViewModel.prototype.getEndPosition=function(){
        var end=this.endPos.getPosition();
        return end;
    }

    return ViewModel;
});