"use strict";
define(["socute/coordinates/position"], function(Position){

    var ResolveAssocLinePoints = function(){

    }

    //Add abstract class instead
    ResolveAssocLinePoints.prototype = new ResolveAssocLinePoints();

    ResolveAssocLinePoints.prototype.resolveStartPoint = function(position, orientation){
        var outPointPosition;
        outPointPosition = this._calcCenter(position.sub.leftJoinPoint, position.sub.rightJoinPoint);
        return outPointPosition;

    }

    ResolveAssocLinePoints.prototype._calcCenter = function(leftPoint, rightPoint){
        var center = Position.getCenterPoint(leftPoint, rightPoint);
        return center;
    }

    ResolveAssocLinePoints.prototype.resolveEndPoint = function (position, orientation){
        var inPointPostion
        inPointPostion = this._calcCenter(position.sub.leftJoinPoint, position.sub.rightJoinPoint);
        return inPointPostion;
    }

    return ResolveAssocLinePoints;

});