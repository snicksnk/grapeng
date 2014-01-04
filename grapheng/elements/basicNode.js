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

    ViewModel.prototype.getPosition=function(){
        //TODO Add copy
        return this.position;
    }

    ViewModel.prototype.init=function(text, paper, position) {
        this.position = new Position();

        this.position.setPos(position.getPosition());

        //TODO ������ �������� ������� ��������� �������
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
        //TODO ������� ��� �� � ���� -1
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
        var paper,
            position,
            Position = SoCuteGraph.helpers.coordinates.Position;

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

    Controller.prototype.getPosition=function(){
        return this._nodeFrame.getPosition();
    }

    Controller.prototype.setDependsOf=function(dependedOf){
        var Position = SoCuteGraph.helpers.coordinates.Position;
        var parentNodePosition=dependedOf.getPosition();
        var lastParentNodePosition=new Position(parentNodePosition.getPosition());
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

        var element,
            moveEvent,
            Position = SoCuteGraph.helpers.coordinates.Position;

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


SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.elements.basicNode.',
    function(){
        test( "Jump event get name", function() {


            var Position=SoCuteGraph.helpers.coordinates.Position;
            var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
            var Line = SoCuteGraph.elements.joinLine.Controller;


            var Element = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
            disp=new Dispathcer();

            position=new Position();
            position.setPos({'x':10,'y':30});



            deepEqual(position.getNewPos(),{'x':10,'y':30},'new position was set');

            equal(position.getNewPos(),false,'Position was not set');

            deepEqual(position.getPosition(),{'x':10,'y':30},'Position was given by setter is valid');



            var paper = Raphael(document.getElementById('canvas'), 800, 600);

            node=new Node('Первая нода', paper, new Position({'x':380,'y':180}));
            node.setOrientation(Element.ORIENTED_MULTI);

            //TODO delete it
            var centerView=node.getViewObject().frame.getRaphaelElement();
            var centerText=node.getViewObject().text.getRaphaelElement();
            centerText.attr("font-family",'Arial');
            centerText.attr("font-weight",'bold');

            centerText.attr("font-size",17);


            centerView.attr("fill", "#FFEC73");
            centerView.attr("fill-opacity",0.5);
            centerView.attr("stroke", "#A68F00");
            centerView.attr("r", 25);
            node.getViewObject().frame.setVerticalOffset(20);
            node.getViewObject().frame.setHorizontalOffset(15);

            node.redraw();




            disp.addObject(node);


            nodeDepends=new Node('Вторая нода\nМного строк\nЗдесь\nЕсть', paper, new Position({'x':610,'y':21}));
            nodeDepends.setDependsOf(node);

            disp.addObject(nodeDepends);

            equal(nodeDepends._moveEvent.getUniqueName(),'move_object_2','SCEvent name of depended object is correct');

            equal(node._moveEvent.getUniqueName(),'move_object_1','SCEvent name of master object is correct');


            disp.notify(node._moveEvent);



            //equal(disp._lastEvent, node._moveEvent, 'Last event of dispatcher is correct for master object');





            line=new Line(paper);


            line.setLineStartNode(node);



            line.setLineEndNode(nodeDepends);

            disp.addObject(line);

            node3=new Node('Третья нода', paper, new Position({'x':610,'y':340}));

            node3.setDependsOf(node);

            disp.addObject(node3);

            line2=new Line(paper);
            line2.setLineStartNode(node);
            line2.setLineEndNode(node3);


            disp.addObject(line2);

            node4=new Node('Четвертая нода', paper, new Position({'x':230,'y':250}));
            node4.setOrientation(Element.ORIENTED_LEFT);


            node4.setDependsOf(node);

            node4.getViewObject().frame.getRaphaelElement()
                .attr('fill','#34CFBE')
                .attr('opacity',0.5);

            disp.addObject(node4);



            line3=new Line(paper);
            line3.setLineStartNode(node);
            line3.setLineEndNode(node4);
            disp.addObject(line3);

            node5=new Node('Пятая нода', paper, new Position({'x':30,'y':90}));
            node5.setOrientation(Element.ORIENTED_RIGHT);
            node5.setOrientation(Element.ORIENTED_LEFT);
            node5.setDependsOf(node4);
            disp.addObject(node5);


            line4=new Line(paper);
            line4.setLineStartNode(node4);
            line4.setLineEndNode(node5);
            disp.addObject(line4);

            node6=new Node('Шестая нода', paper, new Position({'x':70,'y':330}));
            node6.setDependsOf(node4);
            node6.setOrientation(Element.ORIENTED_LEFT);
            disp.addObject(node6);

            line5 = new Line(paper);
            line5.setLineStartNode(node4);
            line5.setLineEndNode(node6);
            disp.addObject(line5);





        });

        test ("set orientation", function(){
            var paper = Raphael(document.getElementById('testCanvas'), 600, 600);

            var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
            testNode=new Node('wrong node', paper);
            try{
                testNode.setOrientation('wrong');
                ok(false, 'Exception was not thrown');
            } catch (e){
                ok(true, 'Exception was thrown');
            }
        });

    }
)