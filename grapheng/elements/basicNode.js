SoCuteGraph.nsCrete("elements.basicNode.viewModel");

SoCuteGraph.nsCrete("elements.basicNode.controllers");

SoCuteGraph.elements.basicNode.controllers = (function () {
    "use strict";
    var ObjController=SoCuteGraph.elements.abstractController.Controller;
    function Controller(text, paper,position){
        this.setUpModels(text, paper, position);
    }

    Controller.prototype=new ObjController();


    Controller.prototype._element=null;

    Controller.prototype.setUpModels=function(text, paper,position){
        var paper, position;

        if (position===undefined){
            position=new Position({'x':10,'y':20});
        } else {

        }



        this._dispatcher=null;
        //alert(moveEvent.getUniqueName());
        //this._stateModel=new StateModel();




        this._element=new Element(text, paper, position);


        this._subscribeForEvents=[FrameEvent];


    }

    Controller.prototype.setDependsOf=function(dependedOf){
        var handlerName;

        this.addSubscribition(new MoveEvent(dependedOf),
            function(Evnt){
                this._element.moveTo(Evnt.position);
            });
    }

    Controller.prototype.setOrientation=function(orientation){
        this._element.setOrientation(orientation);

    }

    Controller.prototype.getOrientation=function(){
        return this._element.getOrientation();
    }

    Controller.prototype.setUpBehavior=function(){

        var element, moveEvent;

        element = this._element;


        this._moveEvent=new MoveEvent(this,element.position);
        moveEvent = this._moveEvent;

        var dispatcher = this.getDispatcher();





        this._element.drag(
            function(x,y){
                /*
                 stateModel.setState(stateModel.states.moved);
                 stateModel.position=element.position;
                 */
            },
            function(x,y){
                element.moveTo(new Position({"x":x,"y":y}));

                moveEvent.position=element.position;
                dispatcher.notify(moveEvent);

            },
            function(x,y){

                moveEvent.position=element.position;
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


SoCuteGraph.elements.basicNode.viewModel = (function () {
    "use strict";
    var Position = SoCuteGraph.helpers.coordinates.Position;


    function AbstractJoinPoint(paper){

    }

    AbstractJoinPoint.prototype.position=null;
    AbstractJoinPoint.prototype._point=null;

    AbstractJoinPoint.prototype.movePosition=function(){
        throw 'specify it!';
    }

    AbstractJoinPoint.prototype._initElement=function(paper){
        this._point=paper.rect(0,0,2,2,0);
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
        this._point.attr('x',newX);
        this._point.attr('y',newY);
        return this;
    }




    function NodeText(text, paper){
        this.text=text;
        this.position=new Position();
        this._text = paper.text(50, 50, text);
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

    NodeText.prototype.getWidth=function(){
        var width=this._text.node.getBBox().width;
        return width;
    }

    NodeText.prototype.getHeight=function(){

    }


    var DragableElement = function(){

    }

    DragableElement.prototype.drag=function(onStartMove, onMoving, onStopMove){
    };

    var ViewModel=function(text, paper, position){

        this.position = new Position();

        this.position.setPos(position.getPosition());

        //TODO Другим способом хранить кординаты поинтов
        this.position.sub['inPoint']=new Position();
        this.position.sub['outPoint']=new Position();
        this.position.sub['text']=new Position;
        this.position.orientation=ViewModel.ORIENTED_RIGHT;

        this.text=text;


        this.nodeText=new NodeText(text, paper);


        this.framer = paper.rect(0, 0, 20, 20, 2);//circle(0, 0, 10);
        this.resizeFramerToText();

        this.leftJoinPoint=new JoinPoint(paper);
        this.rightJoinPoint=new JoinPoint(paper);


        this.moveTo(this.position);


        // Sets the fill attribute of the circle to red (#f00)
        this.framer.attr("fill", "#000");
        this.framer.attr("fill-opacity",0);


        // Sets the stroke attribute of the circle to white
        this.framer.attr("stroke", "#000");

    }

    ViewModel.prototype=new DragableElement;

    ViewModel.ORIENTED_LEFT='left';

    ViewModel.ORIENTED_RIGHT='right';

    ViewModel.prototype.setOrientation=function(orientation){
        if (orientation===ViewModel.ORIENTED_RIGHT || orientation===ViewModel.ORIENTED_LEFT){
            this._orientation=orientation;
            this.position.orientation=orientation;
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
        var width=this.nodeText.getWidth();
        this.framer.attr('width',width);
    }

    ViewModel.prototype.getWidth=function(){
        return this.framer.attr('width');
    }

    ViewModel.prototype.redraw=function(){
        this.moveTo(this.position);
    }

    ViewModel.prototype.moveTo=function(position){
        var pos;
        pos=position.getPosition();
        this.position.setPos(pos);


        this.framer.attr('x',pos['x']);
        this.framer.attr('y',pos['y']);


        this._moveText(position)

        this._moveLeftPoint(position);

        this._moveRightPoint(position);

        this._prepareSubElementsPositionData();
    }

    ViewModel.prototype._prepareSubElementsPositionData=function(){

        var textPosition=this._prepareTextPositionData();
        var inPointPosition=this._prepareInPointPositionData();
        var outPointPosition=this._prepareOutPointPositionData();

        this.position.sub.inPoint.setPos(inPointPosition.getPosition());
        this.position.sub.text.setPos(textPosition);
        this.position.sub.outPoint.setPos(outPointPosition.getPosition());
    }

    ViewModel.prototype._prepareTextPositionData=function(){
        return this.nodeText.position.getPosition();
    }

    ViewModel.prototype._prepareInPointPositionData=function(){
        var inPointPosition;
        if (this._orientation===ViewModel.ORIENTED_RIGHT){
            inPointPosition=this.leftJoinPoint.position;
        } else if (this._orientation===ViewModel.ORIENTED_LEFT){
            inPointPosition=this.rightJoinPoint.position;
        }
        return inPointPosition;
    }

    ViewModel.prototype._prepareOutPointPositionData=function(){
        var outPointPosition;
        if (this._orientation===ViewModel.ORIENTED_RIGHT){
            outPointPosition=this.rightJoinPoint.position;
        } else if (this._orientation===ViewModel.ORIENTED_LEFT){
            outPointPosition=this.leftJoinPoint.position;
        }
        return outPointPosition;
    }

    ViewModel.prototype._moveText=function(position){
        var pos=position.getPosition();
        var textX=pos['x'];
        var textY=pos['y']+10;
        this.nodeText.movePosition(new Position({'x':textX,'y':textY}));
    }


    ViewModel.prototype._moveLeftPoint=function(position){
        var pos=position.getPosition();
        var leftX=pos['x'];
        var leftY=pos['y']+10;
        this.leftJoinPoint.movePosition(new Position({'x':leftX,'y':leftY}));
    }

    ViewModel.prototype._moveRightPoint=function(position){
        var nodeWidth=this.framer.attr('width');
        var pos=position.getPosition();
        var rightX=pos['x']+nodeWidth-1;
        var rightY=pos['y']+10;
        this.rightJoinPoint.movePosition(new Position({'x':rightX,'y':rightY}));
    }

    ViewModel.prototype._moveLeftPosition


    ViewModel.prototype.drag=function(onStartMove, onMoving, onStopMove){




        this.framer.customOnMoving=onMoving;

        this.framer.drag(function(x,y){
                var newX=this.startpos.x+x
                var newY=this.startpos.y+y

                this.customOnMoving(newX, newY);

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
