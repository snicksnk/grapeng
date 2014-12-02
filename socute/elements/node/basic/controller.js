"use strict";
define([
    "socute/elements/abstract/controller",
    "socute/elements/node/basic/viewModel",
    'socute/coordinates/position',
    "socute/events/std/frame",
    "socute/events/std/move",
    "socute/oLib"], function(AbstractController, ViewModel, 
        Position, FrameEvent, MoveEvent, oLib){

/*
NodeContent interface
* getWidth
* getHeight
* movePosition
* setText
* 
*/        
	  
    function Controller(nodeContent, scene, position){
        this.init(nodeContent, scene, position);
    }

    Controller.prototype = new AbstractController();

    Controller.prototype.init=function(nodeContent, scene, position){

        if (position===undefined){
            position=new Position({'x':0,'y':0});
        }
        this._visibility = false;

        this._dispatcher=null;
        this._views = {};
        

        if (typeof nodeContent == "string"){
            this.text = nodeContent;
        }

        this._views.nodeFrame = new ViewModel(nodeContent, scene, position);
        
        this._subscribeForEvents=[FrameEvent];

        //Depends of propertyes
        this._isDependeOf = false;
        this._dependsOfIsInit = false;
        this._lastMoveDiff = false;
        this._silentMove = false;
        this._slaveAffects = false;
        this._isDragable = true;

        var that = this;
       

        //this._newCords = position.getPosition();
        //this.moveTo(position);

        this._moveEvent = new MoveEvent(this);


        //this._views.nodeFrame.getPosition().setPos(position.getPosition());

        //this.getPosition().setPos(position.getPosition());



        this._newCords = false;

    }


    Controller.prototype.getTitle = function () {
        return this._views.nodeFrame.text;
    }

    Controller.prototype.getWidth = function(){
        return this._views.nodeFrame.getWidth();
    }

    Controller.prototype.getHeight = function(){
        return this._views.nodeFrame.getHeight();
    }

    Controller.prototype.setText = function(text){
        this._views.nodeFrame.setText(text);
        this.redraw();
    }

    Controller.prototype.getText = function(){
        return this._views.nodeFrame.getText();
    }

    Controller.prototype.movePosition = function(position){
        this.moveTo(position);
    }

    Controller.prototype.setVisability = function(visability){
        if (visability == true){
            this.show();
        } else {

            this.hide();
        }
    }

    Controller.prototype.getVisability = function(){

        return this._visibility;

    }


    Controller.prototype.show = function(){


        if (this._visibility == false){
            var that = this;
            oLib.each(this._views, function(index, value){
                that._views[index].show();
            });
            this._visibility = true;

        }
    }

    Controller.prototype.hide = function(){

        if (this._visibility===true){
            var that = this;

            oLib.each(this._views, function(index, value){

                value.hide();
            });

            this._visibility = false;
        }
    }


    Controller.prototype.getPosition=function(ignoreNewCords){

        if (this._newCords && !ignoreNewCords){

            this._views.nodeFrame.getPosition().setPos(this._newCords);
            //return new Position(this._newCords);
        }


        return this._views.nodeFrame.getPosition();
    }


    Controller.prototype.setSilentMove = function (isSilent) {
        this._silentMove = isSilent;
    }



    Controller.prototype.setIsDepended = function(isDepended){
        this._isDependeOf = isDepended;
    }

    Controller.prototype.setIsSlaveAffects = function (affects) {
        this._slaveAffects = affects;
    }

    Controller.prototype.setDependsOf=function(dependedOf){

        this.setIsDepended(true);

        this._ignoredDiff = dependedOf;

        this.addSubscription(new MoveEvent(dependedOf),
            function(Evnt){

                if (!this._isDependeOf){
                    return;
                }

                var diff = Evnt.getDiff();



               if (diff){
                    //TODO M.B. to getPosition
                    var currentCords = this.getPosition().getPosition();
                    var newPosition = new Position(currentCords);

                    newPosition.setDiff(diff);
                    this.moveTo(newPosition);
               }


            });
    }

    Controller.prototype.setOrientation=function(orientation){
        this._views.nodeFrame.setOrientation(orientation);

    }

    Controller.prototype.getOrientation=function(){
        return this._views.nodeFrame.getOrientation();
    }

    Controller.prototype.getViewObject=function(){
        return this._views.nodeFrame.getViewObject();
    }


    Controller.prototype.drag = function(x,y){

        this.moveTo(new Position({"x":x,"y":y}));

    }


    Controller.prototype.click = function(){

    }


    Controller.prototype.stopDrag = function(){

    }

    Controller.prototype.startDrag = function(){
    }

    Controller.prototype.setIsDragable = function(isDragable){
        this._views.nodeFrame.setIsDragable(isDragable);
    }

    Controller.prototype.setContentNode = function(contentNode){

    }

    Controller.prototype.getIsDragable = function(){
        return this._views.nodeFrame.getIsDragable();
    }

    Controller.prototype.setUpBehavior=function(){
        var element;
        element = this._views.nodeFrame;



        this.moveTo(this.getPosition());




        this._moveEvent=new MoveEvent(this,element.position);

        //console.log(this.text, this.getPosition().getPosition());

        this.show();

        var that = this;

        this.addSubscription(FrameEvent, function(){
            if (this._newCords){
                //console.log(this.text, this.getPosition().getPosition());
                this._views.nodeFrame.moveTo(new Position(this._newCords));

                //var moveEvent = this._moveEvent;
                //var dispatcher = this.getDispatcher();
                //Controller.moveTo(new Position(this._newCords), element, moveEvent);
                that.redraw();
                //dispatcher.notify(moveEvent);
                this._newCords = false;
            }
        });





        that._views.nodeFrame.click(function(){
            that.click();
        });


        var permResults = [];
        this._views.nodeFrame.drag(
            function(x,y){
                that.startDrag();
                permResults = [];
            },
            function(x,y){
                var t0 = performance.now();
                that.drag(x,y);
                var t1 = performance.now();
                permResults.push(t1-t0);
            },
            function(x,y){
                that.stopDrag();
                var t1 = performance.now();

                var perfSum = 0;
                for (var i in permResults){
                    perfSum += permResults[i];
                }

                console.log('Moving of '+that.text+' calls:'+permResults.length+' average: '+(perfSum/permResults.length));

            }
        );

    };


     Controller.prototype.redraw=function(){
        this._views.nodeFrame.redraw();
        if (this.getDispatcher()){
            if (!this._silentMove){
                var moveEvent = this._moveEvent;
                moveEvent.setPosition(this._views.nodeFrame.getPosition());
                moveEvent.setOrientation(this._views.nodeFrame.getOrientation());



                    //console.log('work!!!');
                this._moveEvent.setDiff(this._lastMoveDiff);


                this.getDispatcher().notify(moveEvent);
                //moveEvent.setDiff(new Position().getPosition());

            }
        }
    }



    Controller.prototype.moveTo = function(position){
        //var moveEvent = new MoveEvent(this);


        //moveEvent = Controller.moveTo(position, this._views.nodeFrame, moveEvent);
        if (this._slaveAffects){
            this._lastMoveDiff = this.getPosition(true).getDiffWith(position);
        } else {
            this._lastMoveDiff = false;
        }

        this._newCords = position.getPosition();
        //this._views.nodeFrame.getPosition().setPos(this._newCords);
    }

    Controller.prototype.subscribeForEvents=function(){
        return this._subscribeForEvents;
    };

    Controller.prototype.handleframe=function(){

        //this._views.nodeFrame.redraw();
    };

    return Controller;
});