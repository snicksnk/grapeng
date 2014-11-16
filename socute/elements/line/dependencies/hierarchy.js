define(["socute/coordinates/position",
    "socute/elements/node/basic/viewModel"], function(Position, NodeViewModel){
     var ResolveHierarchyLinePoints = function(startNode, endNode){
        if (startNode && endNode){
            this.init(startNode, endNode);
        }
    }

    ResolveHierarchyLinePoints.prototype.init=function(startNode, endNode) {
        this._endNodeOrientation = endNode.getOrientation();
        this._startNodeOrientation = startNode.getOrientation();
    }

    ResolveHierarchyLinePoints.prototype.resolveStartPoint = function(position, orientation){
        var outPointPosition;
        this._startNodeOrientation = orientation;
        if (orientation===NodeViewModel.ORIENTED_RIGHT){
            outPointPosition=position.sub.rightJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_LEFT){
            outPointPosition=position.sub.leftJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_MULTI){

            var endNodeOrientation=this._endNodeOrientation;

            if (endNodeOrientation===NodeViewModel.ORIENTED_RIGHT) {
                outPointPosition=position.sub.rightJoinPoint;
            } else if (endNodeOrientation===NodeViewModel.ORIENTED_LEFT) {
                outPointPosition=position.sub.leftJoinPoint;
            }
            else if (endNodeOrientation===NodeViewModel.ORIENTED_MULTI) {
                throw 'Still not implemented ((';
            } else {
                throw 'Undefined orientation "'+endNodeOrientation+'"';
            }
            //outPointPosition=position.sub.leftJoinPoint;
        } else {
            throw "Can't resolve points for orientation '"+orientation+"'";
        }
        return outPointPosition;

    }

    ResolveHierarchyLinePoints.prototype.resolveEndPoint = function (position, orientation){
        var inPointPostion;
        this._endNodeOrientation = orientation;
        if (orientation===NodeViewModel.ORIENTED_RIGHT){
            inPointPostion=position.sub.leftJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_LEFT){
            inPointPostion=position.sub.rightJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_MULTI){
            inPointPostion=position.sub.leftJoinPoint;
        } else {
            throw "Can't resolve points for orientation '"+orientation+"'";
        }
        return inPointPostion;
    }

    return ResolveHierarchyLinePoints;
});