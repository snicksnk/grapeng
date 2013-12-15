SoCuteGraph.nsCrete("elements.basicNode.viewModel");
SoCuteGraph.nsCrete("elements.basicNode.controllers");
SoCuteGraph.nsCrete("elements.basicNode.view");


SoCuteGraph.elements.basicNode.views=(function (){
    "use strict";
    function AbstractJoinPoint(paper){
    }

    AbstractJoinPoint.prototype.position=null;
    AbstractJoinPoint.prototype._point=null;

    AbstractJoinPoint.prototype.movePosition=function(){
        throw 'specify it!';
    }

    AbstractJoinPoint.prototype._initElement=function(paper){
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
        this._nodeFrame.attr("fill-opacity",0.00001);


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

    return {
        'NodeText':NodeText,
        'NodeFrame':NodeFrame,
        'JoinPoint':JoinPoint
    };

})();



SoCuteGraph.elements.basicNode.viewModel = (function () {
    "use strict";
    var Position = SoCuteGraph.helpers.coordinates.Position;
    var NodeText = SoCuteGraph.elements.basicNode.views.NodeText;
    var NodeFrame = SoCuteGraph.elements.basicNode.views.NodeFrame;
    var JoinPoint = SoCuteGraph.elements.basicNode.views.JoinPoint;


    var DragableElement = function(){

    }

    DragableElement.prototype.drag=function(onStartMove, onMoving, onStopMove){
    };

    var ViewModel=function(text, paper, position){
        if (text && paper && position){
            this.init(text, paper, position);
        }
    }

    ViewModel.prototype=new DragableElement;


    ViewModel.prototype.getViewObject=function(){
        return {
            'frame':this._nodeFrame,
            'text':this.nodeText
        };
    }

    ViewModel.prototype.init=function(text, paper, position) {
        this.position = new Position();

        this.position.setPos(position.getPosition());

        //TODO Другим способом хранить кординаты поинтов
        this.position.sub['leftJoinPoint']=new Position();
        this.position.sub['rightJoinPoint']=new Position();
        this.position.sub['text']=new Position;
        this.position.orientation=ViewModel.ORIENTED_RIGHT;

        this.text=text;


        this._nodeFrame = new NodeFrame(position, paper);
        this.nodeText=new NodeText(text, paper);
        this._nodeFrame.afterDrawText();


        this.resizeFramerToText();

        this.leftJoinPoint=new JoinPoint(paper);
        this.rightJoinPoint=new JoinPoint(paper);

        this.moveTo(this.position);

    }


    ViewModel.ORIENTED_LEFT='left';

    ViewModel.ORIENTED_RIGHT='right';

    ViewModel.ORIENTED_MULTI='multi';

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


    ViewModel.prototype._orientation=ViewModel.ORIENTED_RIGHT;

    ViewModel.prototype.text='';

    ViewModel.position=null;


    ViewModel.prototype.resizeFramerToText=function(){

        var width=this.nodeText.getWidth()+(this._nodeFrame.getHorizontalOffset()*2);
        var height=this.nodeText.getHeight()+this._nodeFrame.getVerticalOffset()*2;

        this._nodeFrame.setWidth(width);
        this._nodeFrame.setHeight(height);
    }

    ViewModel.prototype.getWidth=function(){
        return this._nodeFrame.getWidth();
    }

    ViewModel.prototype.redraw=function(){
        this.moveTo(this.position);
    }

    ViewModel.prototype.moveByDiff = function(diffPosition){
        var newPosition = new Position(this.position.getPosition());
        newPosition.setDiff(diffPosition.getPosition());
        this.moveTo(newPosition);
    }

    ViewModel.prototype.moveTo=function(position){
        var pos=position.getPosition();
        this.position.setPos(pos);

        this.resizeFramerToText();

        this._moveFrame(position);

        this._moveText(position)

        this._moveLeftPoint(position);

        this._moveRightPoint(position);

        this._prepareSubElementsPositionData();
    }

    ViewModel.prototype._prepareSubElementsPositionData=function(){

        var textPosition=this._prepareTextPositionData();

        this._preparePointsPositionData();

        this.position.sub.text.setPos(textPosition);

        this.position.orientation=this.getOrientation();


    }

    ViewModel.prototype._prepareTextPositionData=function(){
        return this.nodeText.position.getPosition();
    }




    ViewModel.prototype._preparePointsPositionData=function() {

        this.position.sub.leftJoinPoint.setPos(this.leftJoinPoint.position.getPosition());
        this.position.sub.rightJoinPoint.setPos(this.rightJoinPoint.position.getPosition());

    }


    ViewModel.prototype._moveFrame=function(position){
        this._nodeFrame.moveTo(position);
    }

    ViewModel.prototype._moveText=function(position){
        var pos=position.getPosition();
        var textX=pos['x']+this._nodeFrame.getHorizontalOffset();
        var textY=pos['y']+this._nodeFrame.getVerticalOffset()+this.nodeText.getHeight()/2;
        this.nodeText.movePosition(new Position({'x':textX,'y':textY}));
    }


    ViewModel.prototype._moveLeftPoint=function(position){
        var pos=position.getPosition();
        //TODO Сделать что то с этим -1
        var leftX=pos['x']-1;
        var leftY=pos['y']+this._nodeFrame.getHeight()/2;
        this.leftJoinPoint.movePosition(new Position({'x':leftX,'y':leftY}));
    }

    ViewModel.prototype._moveRightPoint=function(position){
        var nodeWidth=this._nodeFrame.getWidth();
        var pos=position.getPosition();
        var rightX=pos['x']+nodeWidth-1;
        var rightY=pos['y']+this._nodeFrame.getHeight()/2;
        this.rightJoinPoint.movePosition(new Position({'x':rightX,'y':rightY}));
    }

    ViewModel.prototype._moveLeftPosition


    ViewModel.prototype.drag=function(onStartMove, onMoving, onStopMove){


        this._nodeFrame.setDrag(function(x,y){
                var newX=this.startpos.x+x
                var newY=this.startpos.y+y
                onMoving(newX, newY);

            },
            function(x,y){
                this.startpos={}
                this.startpos.x=this.attrs.x;
                this.startpos.y=this.attrs.y;
                onStartMove();
            },
            function(x,y){
                onStopMove();
            });


    };

    return {
        'ViewModel':ViewModel
    };



})();


SoCuteGraph.elements.basicNode.controllers = (function () {
    "use strict";

    var ViewModel = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
    var FrameEvent = SoCuteGraph.events.std.FrameEvent;
    var MoveEvent = SoCuteGraph.events.std.MoveEvent;

    var ObjController=SoCuteGraph.elements.abstractController.Controller;
    function Controller(text, paper,position){
        this.setUpModels(text, paper, position);
    }

    Controller.prototype = new ObjController();


    Controller.prototype._nodeFrame=null;

    Controller.prototype.redraw=function(){
        this._nodeFrame.redraw();
    }

    Controller.prototype.setUpModels=function(text, paper,position){
        var paper, position;

        if (position===undefined){
            position=new Position({'x':10,'y':20});
        } else {

        }



        this._dispatcher=null;
        //alert(moveEvent.getUniqueName());
        //this._stateModel=new StateModel();




        this._nodeFrame = new ViewModel(text, paper, position);


        this._subscribeForEvents=[FrameEvent];


    }

    Controller.prototype.setDependsOf=function(dependedOf){



        this.addSubscribition(new MoveEvent(dependedOf),
            function(Evnt){

                var element = this._nodeFrame;
                var dispatcher = this.getDispatcher();

                var diff = Evnt.getPosition().getPositionDiff();
                var newPosition = new Position(diff);
                this._nodeFrame.moveByDiff(newPosition);



                var moveEvent = new MoveEvent(this,element.position);

                moveEvent.setPosition(element.position);
                moveEvent.setOrientation(element.getOrientation());


                dispatcher.notify(moveEvent);

            });
    }

    Controller.prototype.setOrientation=function(orientation){
        this._nodeFrame.setOrientation(orientation);

    }

    Controller.prototype.getOrientation=function(){
        return this._nodeFrame.getOrientation();
    }

    Controller.prototype.getViewObject=function(){
        return this._nodeFrame.getViewObject();
    }

    Controller.prototype.setUpBehavior=function(){

        var element, moveEvent;

        element = this._nodeFrame;


        this._moveEvent=new MoveEvent(this,element.position);
        moveEvent = this._moveEvent;

        var dispatcher = this.getDispatcher();





        this._nodeFrame.drag(
            function(x,y){
                /*
                 stateModel.setState(stateModel.states.moved);
                 stateModel.position=element.position;
                 */
            },
            function(x,y){
                element.moveTo(new Position({"x":x,"y":y}));

                moveEvent.setPosition(element.position);
                moveEvent.setOrientation(element.getOrientation());
                dispatcher.notify(moveEvent);

            },
            function(x,y){

                moveEvent.setPosition(element.position);
                moveEvent.setOrientation(element.getOrientation());
                dispatcher.notify(moveEvent);
            }
        );
    };

    Controller.prototype.subscribeForEvents=function(){
        return this._subscribeForEvents;
    };

    Controller.prototype.handleframe=function(){
        /*
         if (newState=this._stateModel.getNewState()){
         }
         */
    };

    return {
        'Controller':Controller
    }

})();
