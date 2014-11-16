"use strict";
define(["socute/coordinates/position"], function (Position) {

    var Position;

    var Scene = function(paper){
        if (paper){
            this.init(paper);
        }
    }

    Scene.prototype.init=function(paper){

        this._paper=paper;

        var background = new Background(this.getSize(), paper);
    }

    Scene.prototype.clear = function () {
        this._paper.clear();
    }

    Scene.prototype.getSize = function(){
        var size = new Position({'x': this._paper.canvas.offsetWidth, 'y':this._paper.canvas.offsetHeight});

        return size;
    }


    Scene.prototype.getCenter = function(){
        var center = Position.getCenterPoint(new Position(), this.getSize());
        return center;
    }



    Scene.prototype.NodeText=function(text){
        return new NodeText(text, this._paper);
    }

    Scene.prototype.NodeFrame=function(position){
        return new NodeFrame(position, this._paper);
    }

    Scene.prototype.JoinPoint=function(){
        return new JoinPoint(this._paper);
    }

    Scene.prototype.Path = function(path){
        return new Path(path, this._paper);
    }








    function AbstractView(){

    }


    AbstractView.prototype.hide = function(){
        this._element.hide();
    }

    AbstractView.prototype.show = function(){
        this._element.show();
    }

    AbstractView.prototype._render = function (renderCallback) {
        //setInterval(renderCallback, 0);
        renderCallback();
    }

    var Background = function(size, paper) {
        var size = size.getPosition();
        this._element = paper.rect(0, 0, size['x'], size['y'], 10);//circle(0, 0, 10);
        //this._element.attr("fill", "#fff");
        this._element.toBack();
        this._element.drag (this.drag());
    }

    Background.prototype = new AbstractView();

    Background.prototype.drag = function(){

    }
    
    function AbstractJoinPoint(paper){
    }

    AbstractJoinPoint.prototype = new AbstractView();

    AbstractJoinPoint.prototype.position=null;
    AbstractJoinPoint.prototype._element=null;

    AbstractJoinPoint.prototype.movePosition=function(){
        throw 'specify it!';
    }

    AbstractJoinPoint.prototype._initElement=function(paper){
        this._element=paper.rect(0,0,2,2,0);
        this._element.attr("stroke-width", 1);
        this.position=new Position();
    }




    function JoinPoint(paper){
        this._initElement(paper);
    }

    JoinPoint.prototype=new AbstractJoinPoint();

    JoinPoint.prototype.movePosition=function(position){

        var pos=position.getPosition();
        var newX=pos['x'];
        var newY=pos['y'];

        this.position.setPos({'x':newX,'y':newY});

        var newXWithoutLineWidth = newX;
        var newYWithoutLineWidth = newY-this._element.attr("stroke-width");

        var that = this;
        this._render(function(){
            that._element.attr('x', newXWithoutLineWidth);
            that._element.attr('y', newYWithoutLineWidth);
        });

        return this;
    }


    JoinPoint.prototype.hide = function(){
        this._element.hide();
    }

    JoinPoint.prototype.show = function(){
        this._element.show();
    }

    var NodeFrame= function(position, paper) {
        if (position){
            this.init(position, paper);
        }
    }

    NodeFrame.prototype = new AbstractView();


    NodeFrame.prototype.hide = function(){
        this._nodeFrame.hide();
        this._nodeCover.hide();
    }

    NodeFrame.prototype.show = function(){
        this._nodeFrame.show();
        this._nodeCover.show();
    }



    NodeFrame.prototype.init=function(position, paper){
        this._position = new Position;
        if (position){
            this._position.setPos(position.getPosition());
        }

        this._horizontalOffset=15;
        this._verticalOffset=6;

        this._nodeFrame = paper.rect(0, 0, 20, 20, 10);//circle(0, 0, 10);
        this._nodeCover = paper.rect(0, 0, 20, 20, 0);//circle(0, 0, 10);
        this._nodeCover.attr("fill", "#fff");
        this._nodeCover.attr("fill-opacity",0);
        this._nodeCover.attr("stroke-width",0);

        this.moveTo(this._position);
        // Sets the fill attribute of the circle to red (#f00)
        this._nodeFrame.attr("fill", "90-#34CFBE-#34CFBE");
        this._nodeFrame.attr("stroke-width",0.7);
        this._nodeFrame.attr("fill-opacity",0.5);
        //this._nodeFrame.attr("fill-opacity",0.00001);


        // Sets the stroke attribute of the circle to white
        this._nodeFrame.attr("stroke", "#000");

        this._nodeCover.toFront();


    }



    NodeFrame.prototype.moveTo=function(position){
        var pos = position.getPosition();
        this._position.setPos(pos);

        this._nodeFrame.attr('x',pos['x']);
        this._nodeFrame.attr('y',pos['y']);

        this._nodeCover.attr('x',pos['x']);
        this._nodeCover.attr('y',pos['y']);

    }


    NodeFrame.prototype.afterDrawText=function(){
        this._nodeCover.toFront();
    }



    NodeFrame.prototype.setHeight=function(height){
        this._nodeFrame.attr('height', height);
        this._nodeCover.attr('height', height);
    }

    NodeFrame.prototype.getHeight=function(){
        return this._nodeFrame.attr('height');
    }

    NodeFrame.prototype.getWidth = function(){
        return this._nodeFrame.attr('width');
    }


    NodeFrame.prototype.setWidth = function(width){
        this._nodeFrame.attr('width', width);
        this._nodeCover.attr('width', width);
    }

    NodeFrame.prototype.getRaphaelElement=function(){
        return this._nodeFrame;
    }

    NodeFrame.prototype.setHorizontalOffset=function(offset){
        this._horizontalOffset=offset;
    }

    NodeFrame.prototype.getHorizontalOffset=function(){
        return this._horizontalOffset;
    }


    NodeFrame.prototype.setVerticalOffset=function(offset){
        this._verticalOffset=offset;
    }

    NodeFrame.prototype.getVerticalOffset=function(){
        return this._verticalOffset;
    }




    NodeFrame.prototype.setDrag=function(onStartMove, onMoving, onStopMove){
        this._nodeCover.drag(onStartMove, onMoving, onStopMove);
    }


    NodeFrame.prototype.click = function(handler){
        this._nodeCover.click(handler);
    }

    NodeFrame.prototype.setColor = function(color){
        this._nodeFrame.attr("fill", color);
    }

    NodeFrame.prototype.getColor = function(){
        return this._nodeFrame.attr("fill");
    }



    function NodeText(text, paper){
        this.text=text;
        this.position=new Position();
        this._element = paper.text(50, 50, text);
        this._element.attr('font-size',12);
        this._element.attr('fill','#272323');
        this._element.attr('font-family','verdana');

    }

    NodeText.prototype = new AbstractView();

    NodeText.prototype.position=null;
    NodeText.prototype._element=null;


    NodeText.prototype.movePosition=function(position){
        var pos=position.getPosition();
        var textX=pos['x']+this._element.node.getBBox().width/2;
        var textY=pos['y'];
        this._element.attr('x',textX);
        this._element.attr('y',textY);
        this.position.setPos({'x':textX,'y':textY})
        return this;
    }

    NodeText.prototype.getRaphaelElement=function(){
        return this._element;
    }

    NodeText.prototype.getWidth=function(){
        var width=this._element.node.getBBox().width;
        return width;
    }

    NodeText.prototype.getHeight=function(){
        var height=this._element.node.getBBox().height;
        return height;
    }

    NodeText.prototype.setText = function(text){
        this._element.attr('text', text);
    } 

    NodeText.prototype.getText = function(){
        return this._element.attr('text');
    }

    var Path = function(path, paper){
        if (path && paper){
            this.init(path, paper);
        }
    }

    Path.prototype.init = function(path, paper){
        this._path=paper.path(path);
        this._paper = paper;

    }

    Path.prototype.setSVGPath = function(path){
        this._path.attr("path", path);
        this._path.toBack();
    }

    Path.prototype.setPath = function(start, end){

        var centerX=(end['x']-start['x'])/2+start['x'];
        var centerY=(end['y']-start['y'])/2+start['y'];

        //this._paper.circle(centerX, centerY, 1);


        this._path.attr("path",[
            "M",start['x'],start['y'],
            'Q',centerX,start['y'],
            ,centerX,centerY,
            'Q',centerX,end['y'],
            end['x'],end['y']
        ]);
        this._path.toBack();
    }

    Path.prototype.hide = function(){
        this._path.hide();
    }



    return {
        'Scene': Scene,
        'Path': Path,
        'NodeText':NodeText,
        'NodeFrame':NodeFrame,
        'JoinPoint':JoinPoint
    };

});