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

define([
    'socute/coordinates/position',
    'socute/oLib',
    'socute/elements/node/basic/viewBehavior'], function(Position, oLib, ViewBehavior){

    var DragableElement = function(){

    }

    DragableElement.prototype.drag=function(onStartMove, onMoving, onStopMove){
    };

    var ViewModel=function(nodeContent, scene, position){
        if (nodeContent && scene && position){
            this.init(nodeContent, scene, position);
        }
    }


    ViewModel.ORIENTED_LEFT = 'left',
    ViewModel.ORIENTED_RIGHT = 'right',
    ViewModel.ORIENTED_MULTI = 'multi',


    ViewModel.prototype=new DragableElement;


    var Methods = {

        init: function(nodeContent, scene, position) {
            this.position = new Position();

            this.position.setPos(position.getPosition());

            this._visibility = false;

            this.position.sub['leftJoinPoint'] = new Position();
            this.position.sub['rightJoinPoint']= new Position();
            this.position.sub['nodeText']=new Position;

            this.text = nodeContent;
            this._isDragable = true;

            this._views = {};

            this._views.nodeFrame = scene.NodeFrame(position);

            this.setContent(nodeContent, scene);

            this._viewBehavior = new ViewBehavior();

            var that = this;
        
            this._views.nodeFrame.afterDrawText();
            this.resizeFramerToText();
            this._views.leftJoinPoint=scene.JoinPoint(scene);
            this._views.rightJoinPoint=scene.JoinPoint(scene);

            this._visibility = false;
            this.hide();

            this._isDragable = true;

            this.moveTo(this.position);
        },

        getViewObject: function(){
            return {
                'frame':this._views.nodeFrame,
                'text':this._views.nodeText
            };
        },

        getPosition: function(){
            //TODO Add copy
            return this.position;
        },
    
        setContent:function (nodeContent, scene){
            if (typeof nodeContent == "string"){
                this._views.nodeText = scene.NodeText(nodeContent, scene);
                this._advanceViewMode = false;
            } else {
                this._views.nodeText = nodeContent;
                this._advanceViewMode = true;
            }
            if (typeof this._views.nodeText['afterInit'] === 'function'){   
                this._views.nodeText.afterInit();
            }
        },

        setOrientation: function(orientation){
            if (orientation === ViewModel.ORIENTED_RIGHT || orientation===ViewModel.ORIENTED_LEFT || orientation === ViewModel.ORIENTED_MULTI) {
                this._orientation = orientation;
                this.redraw();
            } else {
                throw "Wrong orientation '" + orientation + "'";
            }
        },

        getOrientation: function(){
            return this._orientation;
        },

        setText: function(text){
            this._text = text;
            this._views.nodeText.setText(text);
            this.redraw();
        },

        getText: function(){
            return this._text;
        },

        _orientation: ViewModel.ORIENTED_RIGHT,
        text: '',
        position: null,
        
        resizeFramerToText: function(){
            var width=this._views.nodeText.getWidth()+(this._views.nodeFrame.getHorizontalOffset()*2);
            var height=this._views.nodeText.getHeight()+this._views.nodeFrame.getVerticalOffset()*2;

            this._views.nodeFrame.setWidth(width);
            this._views.nodeFrame.setHeight(height);
        },

        getWidth: function(){
            return this._views.nodeFrame.getWidth();
        },

        getHeight: function(){
            return this._views.nodeFrame.getHeight();
        },

        redraw: function(){
            var that = this;
            var redraw = function(){
                that.resizeFramerToText();


                var e, element, viewMethod;
                for (e in that._views){
                    element = that._views[e];
                    if (viewMethod = that._viewBehavior[e]){
                       that.position.sub[e] = viewMethod(that, that.position);
                    } else {
                        console.log('no methode ' + e);
                    }
                }

                that._render(that.position);
                that.position.orientation=that.getOrientation();
            }
            redraw();
        },

        moveByDiff: function(diffPosition){
            var newPosition = new Position(this.position.getPosition());
            newPosition.setDiff(diffPosition.getPosition());
            this.moveTo(newPosition);
        },

        moveTo: function(position){
            var pos=position.getPosition();
            this.position.setPos(pos);
            this._newCords = new Position(pos);
        },

        _roundCords: function(position){
            var rawCords = position.getPosition();
            oLib.each(rawCords, function(cord,val){
               rawCords[cord]=Math.round(val);
            });
            position.setPos(rawCords);
            return position;
        },

        _render: function(position){
            var that = this;
            oLib.each(this._views, function(elementName, element){
                var elementPosition;
                
                if (elementPosition = that.position.sub[elementName]){
                    element.movePosition(elementPosition);
                } else {
                    console.log('no move data for ' +  elementName)
                }

            });
        },

        click: function(callback){
            this._views.nodeFrame.click(callback);
        },

        setIsDragable: function(isDragable){
            this._isDragable = isDragable; 
        },

        getIsDragable: function(){
            return this._isDragable;
        },

        drag: function(onStartMove, onMoving, onStopMove){
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
        },
        setVisability: function(visability){

            if (visability === true){
                this._views.nodeFrame.show();
            } else if (visability === false) {
                this._views.nodeFrame.hide();
            }
        },

        getVisability: function(){
            return this._visibility;
        },

        show: function(){
            if (!this.visability){
                var that = this;
                oLib.each(this._views, function(index, value){
                    that._views[index].show();
                });
                this._visibility = true;
            }
        },
        
        hide: function(){

            if (this._visibility){
                var that = this;
                oLib.each(this._views, function(index, value){
                    that._views[index].hide();
                });
                this._visibility = false;
            }
        }
    }

    oLib.extend(ViewModel.prototype, Methods);

    return ViewModel;

});