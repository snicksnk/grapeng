SoCuteGraph.nsCrete("elements.viewFactory.raphael");

SoCuteGraph.elements.viewFactory.raphael = (function () {
    "use strict";


    var Scene = function(paper){
        if (paper){
            this.init(paper);
        }
    }

    Scene.prototype.init=function(paper){
        this._paper=paper;
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




    function AbstractJoinPoint(paper){
    }

    AbstractJoinPoint.prototype.position=null;
    AbstractJoinPoint.prototype._point=null;

    AbstractJoinPoint.prototype.movePosition=function(){
        throw 'specify it!';
    }

    AbstractJoinPoint.prototype._initElement=function(paper){
        var Position = SoCuteGraph.helpers.coordinates.Position;
        this._point=paper.rect(0,0,2,2,0);
        this._point.attr("stroke-width", 1);
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
        var newYWithoutLineWidth = newY-this._point.attr("stroke-width");

        this._point.attr('x', newXWithoutLineWidth);
        this._point.attr('y', newYWithoutLineWidth);
        return this;
    }


    var NodeFrame= function(position, paper) {
        if (position){
            this.init(position, paper);
        }
    }

    NodeFrame.prototype.init=function(position, paper){
        var Position = SoCuteGraph.helpers.coordinates.Position;
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



    function NodeText(text, paper){
        var Position = SoCuteGraph.helpers.coordinates.Position;
        this.text=text;
        this.position=new Position();
        this._text = paper.text(50, 50, text);
        this._text.attr('font-size',12);
        this._text.attr('fill','#272323');
        this._text.attr('font-family','verdana');
    }

    NodeText.prototype.position=null;
    NodeText.prototype._text=null;


    NodeText.prototype.movePosition=function(position){
        var pos=position.getPosition();
        var textX=pos['x']+this._text.node.getBBox().width/2;
        var textY=pos['y'];
        this._text.attr('x',textX);
        this._text.attr('y',textY);
        this.position.setPos({'x':textX,'y':textY})
        return this;
    }

    NodeText.prototype.getRaphaelElement=function(){
        return this._text;
    }

    NodeText.prototype.getWidth=function(){
        var width=this._text.node.getBBox().width;
        return width;
    }

    NodeText.prototype.getHeight=function(){
        var height=this._text.node.getBBox().height;
        return height;
    }

    var Path = function(path, paper){
        if (path && paper){
            this.init(path, paper);
        }
    }

    Path.prototype.init = function(path, paper){
        this._path=paper.path(path);
    }

    Path.prototype.setSVGPath = function(path){
        this._path.attr("path", path);
        this._path.toBack();
    }


    return {
        'Scene': Scene,
        'Path': Path,
        'NodeText':NodeText,
        'NodeFrame':NodeFrame,
        'JoinPoint':JoinPoint
    };


})();