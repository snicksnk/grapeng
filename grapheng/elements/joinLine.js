SoCuteGraph.nsCrete("elements.joinLine.viewModels");
SoCuteGraph.nsCrete("elements.joinLine.controllers");
SoCuteGraph.nsCrete("elements.joinLine.view");
SoCuteGraph.nsCrete("elements.joinLine.dependencies");


SoCuteGraph.elements.joinLine.dependencies = (function () {

    var NodeViewModel = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
    var Position = SoCuteGraph.helpers.coordinates.Position;
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





    return {
        'ResolveHierarchyLinePoints':ResolveHierarchyLinePoints,
        'ResolveAssocLinePoints': ResolveAssocLinePoints
    }
})();

SoCuteGraph.elements.joinLine.viewModels = (function () {
    "use strict";



    var ViewModel = function(scene, pointsResolver){
        if (scene, pointsResolver){
            this.init(scene, pointsResolver);
        }
    }

    ViewModel.prototype.init = function(scene, pointsResolver) {
        var Position = SoCuteGraph.helpers.coordinates.Position;
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

    return {
        'ViewModel':ViewModel
    };

})();


SoCuteGraph.elements.joinLine.controllers = (function () {
    "use strict";


    var ObjController = SoCuteGraph.elements.abstractController.Controller;
    var ViewModel = SoCuteGraph.elements.joinLine.viewModels.ViewModel;
    var FrameEvent = SoCuteGraph.events.std.FrameEvent;
    var MoveEvent = SoCuteGraph.events.std.MoveEvent;
    var ResolveHierarchyLinePoints = SoCuteGraph.elements.joinLine.dependencies.ResolveHierarchyLinePoints;


    function Controller(paper, startNode, endNode, PointsResolver){
        if (paper, startNode, endNode){
            this._init(paper, startNode, endNode, PointsResolver);
        }
    }


    Controller.prototype=new ObjController();


    Controller.prototype._init=function(paper, startNode, endNode, PointsResolver){
        var resolver;
        this._subscribeForEvents=[FrameEvent];

        if (!PointsResolver) {
            PointsResolver = ResolveHierarchyLinePoints;
        }

        resolver = new PointsResolver(startNode, endNode);
        this._nodeFrame=new ViewModel(paper, resolver);


        this._nodeFrame.moveStartPoint(startNode.getPosition(), startNode.getOrientation());
        this.addSubscription(new MoveEvent(startNode),
            this._lineStartDepends);
        this._nodeFrame.moveEndPoint(endNode.getPosition(), endNode.getOrientation());
        this.addSubscription(new MoveEvent(endNode),
             this._lineEndDepends);

        this._newStartNodeEvnt = false;
        this._newEndNodeEvnt = false;

        this.addSubscription(FrameEvent, function(){
            if (this._newEndNodeEvnt){
                this._nodeFrame.moveEndPoint(this._newEndNodeEvnt.getPosition(), this._newEndNodeEvnt.getOrientation());
                this._newEndNodeEvnt = false;
            }

            if (this._newStartNodeEvnt){
                this._nodeFrame.moveStartPoint(this._newStartNodeEvnt.getPosition(), this._newStartNodeEvnt.getOrientation());
                this._newStartNodeEvnt = false;
            }
        });

    }

    var NodeViewModel = SoCuteGraph.elements.basicNode.viewModel.ViewModel;

    Controller.prototype.hide = function() {
        this._nodeFrame.hide();
    }

    Controller.prototype._lineStartDepends=function(Evnt){
        this._newStartNodeEvnt = Evnt;
        //this._nodeFrame.moveStartPoint(Evnt.getPosition(), Evnt.getOrientation());
    }

    Controller.prototype._lineEndDepends=function(Evnt){
        this._newEndNodeEvnt = Evnt;
        //this._nodeFrame.moveEndPoint(Evnt.getPosition(), Evnt.getOrientation());
    }




    Controller.prototype.subscribeForEvents=function(){
        return this._subscribeForEvents;
    };

    return {
        'Controller':Controller
    };

})();

/**
 *   var NodeViewModel = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
 var ObjController = SoCuteGraph.elements.abstractController.Controller;
 var FrameEvent = SoCuteGraph.events.std.FrameEvent;
 var MoveEvent = SoCuteGraph.events.std.MoveEvent;

 */