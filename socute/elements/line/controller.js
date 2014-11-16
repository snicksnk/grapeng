"use strict";
define([
	"socute/events/std/frame",
	"socute/events/std/move",
	"socute/elements/line/viewModel",
	"socute/coordinates/position",
	"socute/elements/abstract/controller",
    "socute/elements/line/dependencies/hierarchy"
	],function(FrameEvent, MoveEvent, ViewModel, Position, 
        AbstractController, ResolveHierarchyLinePoints){

    
    function Controller(paper, startNode, endNode, PointsResolver){
        if (paper, startNode, endNode){
            this._init(paper, startNode, endNode, PointsResolver);
        }
    }


    Controller.prototype=new AbstractController();


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
            var isMoved = false;
            if (this._newEndNodeEvnt){
                isMoved = true;
                this._nodeFrame.moveEndPoint(this._newEndNodeEvnt.getPosition(), this._newEndNodeEvnt.getOrientation());
                this._newEndNodeEvnt = false;
            }

            if (this._newStartNodeEvnt){
                isMoved = true;
                this._nodeFrame.moveStartPoint(this._newStartNodeEvnt.getPosition(), this._newStartNodeEvnt.getOrientation());
                this._newStartNodeEvnt = false;
            }

            if (isMoved){
                var moveEvent = new MoveEvent(this, new Position());
                this.getDispatcher().notify(moveEvent);
            }

        });


    }


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


    Controller.prototype.setCenterPoing = function () {

    }




    Controller.prototype.subscribeForEvents=function(){
        return this._subscribeForEvents;
    };

    return Controller;

});