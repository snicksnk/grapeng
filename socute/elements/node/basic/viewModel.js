"use strict";
/**
* Node frame intarface
* __construct(text, scene, position)
* getWidth()
* setText()
* getText()
* getPosition()
* setOrientation()
* getOrientation()
* getViewObject()
* moveTo()
* click()
* drag()
* redraw()
*/

define(['socute/coordinates/position','socute/oLib'], function(Position, oLib){

    var DragableElement = function(){

    }

    DragableElement.prototype.drag=function(onStartMove, onMoving, onStopMove){
    };

    var ViewModel=function(nodeContent, scene, position){
        if (nodeContent && scene && position){
            this.init(nodeContent, scene, position);
        }
    }

    ViewModel.prototype=new DragableElement;


    ViewModel.prototype.getViewObject=function(){
        return {
            'frame':this._views.nodeFrame,
            'text':this._views.nodeText
        };
    }

    ViewModel.prototype.getPosition=function(){
        //TODO Add copy
        return this.position;
    }

    ViewModel.prototype.init=function(nodeContent, scene, position) {
        this.position = new Position();

        this.position.setPos(position.getPosition());

        this._visibility = false;

        this.position.sub['leftJoinPoint'] = new Position();
        this.position.sub['rightJoinPoint']= new Position();
        this.position.sub['text']=new Position;

        this.text = nodeContent;

        this._isDragable = true;

        this._views = {};

        this._views.nodeFrame = scene.NodeFrame(position);


        if (typeof nodeContent == "string"){
            this._views.nodeText = scene.NodeText(nodeContent, scene);
        } else {
            this._views.nodeText = nodeContent;
        }

        var that = this;
       



        this._views.nodeFrame.afterDrawText();
        this.resizeFramerToText();
        this._views.leftJoinPoint=scene.JoinPoint(scene);
        this._views.rightJoinPoint=scene.JoinPoint(scene);

        this._visibility = false;
        this.hide();

        this._isDragable = true;

        this.moveTo(this.position);
    }


    ViewModel.ORIENTED_LEFT='left';

    ViewModel.ORIENTED_RIGHT='right';

    ViewModel.ORIENTED_MULTI='multi';


    ViewModel.prototype.setVisability = function(visability){

        if (visability === true){
            this._views.nodeFrame.show();
        } else if (visability === false) {
            this._views.nodeFrame.hide();
        }
    }

    ViewModel.prototype.getVisability = function(){
        return this._visibility;
    }


    ViewModel.prototype.show = function(){
        if (!this.visability){
            var that = this;
            oLib.each(this._views, function(index, value){
                that._views[index].show();
            });
            this._visibility = true;
        }
    }

    ViewModel.prototype.hide = function(){

        if (this._visibility){
            var that = this;
            oLib.each(this._views, function(index, value){
                that._views[index].hide();
            });
            this._visibility = false;
        }
    }


    ViewModel.prototype.setOrientation=function(orientation){
        if (orientation===ViewModel.ORIENTED_RIGHT || orientation===ViewModel.ORIENTED_LEFT || orientation===ViewModel.ORIENTED_MULTI) {
            this._orientation=orientation;
            this.redraw();
        } else {
            throw "Wrong orientation '"+orientation+"'";
        }
    }

    ViewModel.prototype.getOrientation=function(){
        return this._orientation;
    }

    ViewModel.prototype.setText = function(text){
        this._text = text;
        this._views.nodeText.setText(text);
        this.redraw();
    }

    ViewModel.prototype.getText = function(){

        return this._text;
    }


    ViewModel.prototype._orientation=ViewModel.ORIENTED_RIGHT;

    ViewModel.prototype.text='';

    ViewModel.position=null;


    ViewModel.prototype.resizeFramerToText=function(){

        var width=this._views.nodeText.getWidth()+(this._views.nodeFrame.getHorizontalOffset()*2);
        var height=this._views.nodeText.getHeight()+this._views.nodeFrame.getVerticalOffset()*2;

        this._views.nodeFrame.setWidth(width);
        this._views.nodeFrame.setHeight(height);
    }

    ViewModel.prototype.getWidth=function(){
        return this._views.nodeFrame.getWidth();
    }

    ViewModel.prototype.getHeight=function(){
        return this._views.nodeFrame.getHeight();
    }

    ViewModel.prototype.redraw=function(){

        var that = this;
        var redraw = function(){
            that.resizeFramerToText();



            that._moveText(that.position);
            that._moveLeftPoint(that.position);


            that._render(that.position);


            that._moveRightPoint(that.position);
            that._prepareSubElementsPositionData();

        };

        //console.log(this.getPosition());

        redraw();

        //setTimeout(redraw, 0);

    }

    ViewModel.prototype.moveByDiff = function(diffPosition){
        var newPosition = new Position(this.position.getPosition());
        newPosition.setDiff(diffPosition.getPosition());
        this.moveTo(newPosition);
    }

    ViewModel.prototype.moveTo=function(position){
        var pos=position.getPosition();
        this.position.setPos(pos);

        this._newCords = new Position(pos);

        //this.position = this._roundCords(this.position);

        //this.redraw();

    }

    ViewModel.prototype._roundCords = function(position){
        var rawCords = position.getPosition();
        oLib.each(rawCords, function(cord,val){
           rawCords[cord]=Math.round(val);
        });
        position.setPos(rawCords);
        return position;
    }

    ViewModel.prototype._prepareSubElementsPositionData=function(){


        //this.position.sub.text.setPos(this._views.nodeText.position.getPosition());



        this.position.sub.leftJoinPoint.setPos(this._views.leftJoinPoint.position.getPosition());
        this.position.sub.rightJoinPoint.setPos(this._views.rightJoinPoint.position.getPosition());


        this.position.orientation=this.getOrientation();


    }

    ViewModel.prototype._render = function(position){
        this._views.nodeFrame.moveTo(position);
        this._views.nodeText.movePosition(this.position.sub.text.getPosition());


        this._views.leftJoinPoint.movePosition(this.position.sub.leftJoinPoint.getPosition());
        //this._views.leftJoinPoint.movePosition(new Position({'x':leftX,'y':leftY}));
    }




    ViewModel.prototype._moveText=function(position){
        var pos=position.getPosition();
        var textX=pos['x']+this._views.nodeFrame.getHorizontalOffset();
        var textY=pos['y']+this._views.nodeFrame.getVerticalOffset()+this._views.nodeText.getHeight()/2;
        //this._views.nodeText.movePosition(new Position({'x':textX,'y':textY}));
        this.position.sub.text.setPos(new Position({'x':textX,'y':textY}));

    }


    ViewModel.prototype._moveLeftPoint=function(position){
        var pos=position.getPosition();
        var leftX=pos['x']-1;
        var leftY=pos['y']+this._views.nodeFrame.getHeight()/2;

        this.position.sub.leftJoinPoint.setPos(new Position({'x':leftX,'y':leftY}));


    }

    ViewModel.prototype._moveRightPoint=function(position){
        var nodeWidth=this._views.nodeFrame.getWidth();
        var pos=position.getPosition();
        var rightX=pos['x']+nodeWidth-1;
        var rightY=pos['y']+this._views.nodeFrame.getHeight()/2;
        this._views.rightJoinPoint.movePosition(new Position({'x':rightX,'y':rightY}));
    }

    ViewModel.prototype._moveLeftPosition



    ViewModel.prototype.click = function(callback){
        this._views.nodeFrame.click(callback);
    }

    ViewModel.prototype.setIsDragable = function(isDragable){
        this._isDragable = isDragable; 
    }

    ViewModel.prototype.getIsDragable = function(){
        return this._isDragable;
    }


    ViewModel.prototype.drag=function(onStartMove, onMoving, onStopMove){

        var that = this;
        this._views.nodeFrame.setDrag(function(x,y){
                if (that.getIsDragable()){
                    var newX=this.startpos.x+x
                    var newY=this.startpos.y+y
                    onMoving(newX, newY);
                }
            },
            function(x,y){
                if (that.getIsDragable()){
                    this.startpos={}
                    this.startpos.x=this.attrs.x;
                    this.startpos.y=this.attrs.y;
                    onStartMove();
                }
            },
            function(x,y){
                onStopMove();
            });


    };

    return ViewModel;

});