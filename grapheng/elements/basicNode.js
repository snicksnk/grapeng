SoCuteGraph.nsCrete("elements.basicNode.viewModel");
SoCuteGraph.nsCrete("elements.basicNode.controllers");
SoCuteGraph.nsCrete("elements.basicNode.view");
SoCuteGraph.nsCrete("elements.basicNode.dependencies");


SoCuteGraph.elements.basicNode.dependencies = (function(){
    "use strict";

    var MoveSlave = function(dispathcer, master, slave){
        if (dispathcer){
            this.init(dispathcer);
        }

        this.moverFunction = MoveSlave.defaultMover;


        if (master && slave) {
            this.setMaster(master);
            this.setSlave(slave);
            this.apply();
        }

    }

    MoveSlave.defaultMover = function(Evnt){
        //Node controller context

        var Position = SoCuteGraph.helpers.coordinates.Position;
        var MoveEvent = SoCuteGraph.events.std.MoveEvent;
        var diffAmount = Position.getDiffAmount(this.MoveSlaveData.oldMasterPosition.getDiffWith(Evnt.getPosition()));

        if (diffAmount!==0){
            var dispatcher = this.getDispatcher();
            var diff = Evnt.getPosition().getPositionDiff();
            var newPosition = new Position(diff);
            this._nodeFrame.moveByDiff(newPosition);
            this.MoveSlaveData.oldMasterPosition.setPos(Evnt.getPosition().getPosition());

            var moveEvent = new MoveEvent(this, this.getPosition());
            moveEvent.setPosition(this.getPosition());
            moveEvent.setOrientation(this.getOrientation());
            dispatcher.notify(moveEvent);

        }
    }

    MoveSlave.prototype.init=function(dispathcer){
        this._dispatcher = dispathcer;
    }

    MoveSlave.prototype.setMaster = function(master){
        this._master = master;
    }

    MoveSlave.prototype.setSlave = function(slave){
        this._slave = slave;
    }

    MoveSlave.prototype.apply=function(){
        var Position = SoCuteGraph.helpers.coordinates.Position;

        var MoveEvent = SoCuteGraph.events.std.MoveEvent;

        this._slave.MoveSlaveData=[];
        this._slave.MoveSlaveData.oldMasterPosition = new Position();

        this._slave.addSubscription(new MoveEvent(this._master), this.moverFunction);


    }


    /*


     Controller.prototype.setDependsOf=function(dependedOf){
     var Position = SoCuteGraph.helpers.coordinates.Position;
     var parentNodePosition=dependedOf.getPosition();
     var lastParentNodePosition=new Position(parentNodePosition.getPosition());
     this.addSubscription(new MoveEvent(dependedOf),
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



     */

    return {'MoveSlave': MoveSlave};

})();

SoCuteGraph.elements.basicNode.views=(function (){


})();



SoCuteGraph.elements.basicNode.viewModel = (function () {
    "use strict";
    var Position = SoCuteGraph.helpers.coordinates.Position;
    //var NodeText = SoCuteGraph.elements.basicNode.views.NodeText;
    //var NodeFrame = SoCuteGraph.elements.basicNode.views.NodeFrame;
    //var JoinPoint = SoCuteGraph.elements.basicNode.views.JoinPoint;


    var DragableElement = function(){

    }

    DragableElement.prototype.drag=function(onStartMove, onMoving, onStopMove){
    };

    var ViewModel=function(text, scene, position){
        if (text && scene && position){
            this.init(text, scene, position);
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

    ViewModel.prototype.init=function(text, scene, position) {
        this.position = new Position();

        this.position.setPos(position.getPosition());



        this.position.sub['leftJoinPoint']=new Position();
        this.position.sub['rightJoinPoint']=new Position();
        this.position.sub['text']=new Position;
        this.position.orientation=ViewModel.ORIENTED_RIGHT;

        this.text=text;


        this._nodeFrame = scene.NodeFrame(position);
        this.nodeText=scene.NodeText(text, scene);
        this._nodeFrame.afterDrawText();


        this.resizeFramerToText();

        this.leftJoinPoint=scene.JoinPoint(scene);
        this.rightJoinPoint=scene.JoinPoint(scene);

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
    function Controller(text, scene,position){
        this.setUpModels(text, scene, position);
    }

    Controller.prototype = new ObjController();


    Controller.prototype._nodeFrame=null;

    Controller.prototype.redraw=function(){
        this._nodeFrame.redraw();
    }

    Controller.prototype.setUpModels=function(text, scene, position){



        var position,
            Position = SoCuteGraph.helpers.coordinates.Position;

        if (position===undefined){
            position=new Position({'x':10,'y':20});
        } else {

        }



        this._dispatcher=null;
        //alert(moveEvent.getUniqueName());
        //this._stateModel=new StateModel();




        this._nodeFrame = new ViewModel(text, scene, position);


        this._subscribeForEvents=[FrameEvent];


    }

    Controller.prototype.getPosition=function(){
        return this._nodeFrame.getPosition();
    }

    /*
    Controller.prototype.setDependsOf=function(dependedOf){
        var Position = SoCuteGraph.helpers.coordinates.Position;
        var parentNodePosition=dependedOf.getPosition();
        var lastParentNodePosition=new Position(parentNodePosition.getPosition());
        this.addSubscription(new MoveEvent(dependedOf),
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
    */
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
            var Line = SoCuteGraph.elements.joinLine.controllers.Controller;


            var Element = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
            var MoveSlave = SoCuteGraph.elements.basicNode.dependencies.MoveSlave;
            var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;
            var disp=new Dispathcer();
            var ResolveAssocLinePoints = SoCuteGraph.elements.joinLine.dependencies.ResolveAssocLinePoints;

            position=new Position();
            position.setPos({'x':10,'y':30});



            deepEqual(position.getNewPos(),{'x':10,'y':30},'new position was set');

            equal(position.getNewPos(),false,'Position was not set');

            deepEqual(position.getPosition(),{'x':10,'y':30},'Position was given by setter is valid');



            var paper = Raphael(document.getElementById('canvas'), 800, 600);
            var scene = new Scene(paper);
            node=new Node('Первая нода', scene, new Position({'x':380,'y':180}));
            node.setOrientation(Element.ORIENTED_MULTI);

            //TODO delete it
            var centerView=node.getViewObject().frame.getRaphaelElement();
            var centerText=node.getViewObject().text.getRaphaelElement();

            var ParentChildJoin = SoCuteGraph.elements.joinLine.dependencies.ParentChildJoin;

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


            nodeDepends=new Node('Вторая нода\nМного строк\nЗдесь\nЕсть', scene, new Position({'x':610,'y':21}));

            new MoveSlave(disp, node, nodeDepends);

            //
            // nodeDepends.setDependsOf(node);

            disp.addObject(nodeDepends);

            equal(nodeDepends._moveEvent.getUniqueName(),'move_object_2','SCEvent name of depended object is correct');

            equal(node._moveEvent.getUniqueName(),'move_object_1','SCEvent name of master object is correct');


            disp.notify(node._moveEvent);



            //equal(disp._lastEvent, node._moveEvent, 'Last event of dispatcher is correct for master object');





            line=new Line(scene, node, nodeDepends);

            //new ParentChildJoin(disp, line, node, nodeDepends);

            disp.addObject(line);

            node3=new Node('Третья нода', scene, new Position({'x':610,'y':340}));
            new MoveSlave(disp, node, node3);


            disp.addObject(node3);

            line2=new Line(scene, node, node3);





            disp.addObject(line2);

            node4=new Node('Четвертая нода', scene, new Position({'x':230,'y':250}));
            node4.setOrientation(Element.ORIENTED_LEFT);

            new MoveSlave(disp, node, node4);


            node4.getViewObject().frame.getRaphaelElement()
                .attr('fill','#34CFBE')
                .attr('opacity',0.5);

            disp.addObject(node4);



            line3=new Line(scene, node, node4);
            disp.addObject(line3);




            node5=new Node('Пятая нода', scene, new Position({'x':30,'y':90}));
            node5.setOrientation(Element.ORIENTED_RIGHT);
            node5.setOrientation(Element.ORIENTED_LEFT);
            new MoveSlave(disp, node4, node5);

            disp.addObject(node5);


            line4=new Line(scene, node4, node5);
            disp.addObject(line4);

            node6=new Node('Шестая нода', scene, new Position({'x':70,'y':330}));
            new MoveSlave(disp, node4, node6);

            node6.setOrientation(Element.ORIENTED_LEFT);
            disp.addObject(node6);

            line5 = new Line(scene, node4, node6);
            disp.addObject(line5);


            lineAssoc=new Line(scene, node5, node6, ResolveAssocLinePoints);


            disp.addObject(lineAssoc);


        });

        test ("set orientation", function(){
            var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;
            var paper = Raphael(document.getElementById('testCanvas'), 600, 600);
            var scene = new Scene(paper);
            var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
            testNode=new Node('wrong node', scene);
            try{
                testNode.setOrientation('wrong');
                ok(false, 'Exception was not thrown');
            } catch (e){
                ok(true, 'Exception was thrown');
            }
        });

    }
)