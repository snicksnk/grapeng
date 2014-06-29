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
        //var Position = SoCuteGraph.helpers.coordinates.Position;

        //var MoveEvent = SoCuteGraph.events.std.MoveEvent;

        //this._slave.MoveSlaveData=[];
        //this._slave.MoveSlaveData.oldMasterPosition = new Position(this._master.getPosition().getPosition());
        var positionOfMaster;
        /*Jaspecto(this._master).after('drag').advice('MoveDependedGetStartPosition', function(){
            positionOfMaster = this.getPosition().getPosition();
            console.log(positionOfMaster);
        });*/






        this._slave.setDependsOf(this._master);

        this._master.setIsSlaveAffects(true);

    }

    MoveSlave.prototype.cansel = function(){
        //TODO Fix hack
        var MoveEvent = SoCuteGraph.events.std.MoveEvent;
        this._slave.addSubscription(new MoveEvent(this._master),
            function(Evnt){

            });
    }


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
            'frame':this._views.nodeFrame,
            'text':this._views.nodeText
        };
    }

    ViewModel.prototype.getPosition=function(){
        //TODO Add copy
        return this.position;
    }

    ViewModel.prototype.init=function(text, scene, position) {
        this.position = new Position();

        this.position.setPos(position.getPosition());

        this._visibility = false;

        this.position.sub['leftJoinPoint']=new Position();
        this.position.sub['rightJoinPoint']=new Position();
        this.position.sub['text']=new Position;

        this.text=text;



        this._views = {};

        this._views.nodeFrame = scene.NodeFrame(position);
        this._views.nodeText=scene.NodeText(text, scene);

        var that = this;
       



        this._views.nodeFrame.afterDrawText();
        this.resizeFramerToText();
        this._views.leftJoinPoint=scene.JoinPoint(scene);
        this._views.rightJoinPoint=scene.JoinPoint(scene);

        this._visibility = false;
        this.hide();

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
            SoCuteGraph.oLib.each(this._views, function(index, value){
                that._views[index].show();
            });
            this._visibility = true;
        }
    }

    ViewModel.prototype.hide = function(){

        if (this._visibility){
            var that = this;
            SoCuteGraph.oLib.each(this._views, function(index, value){
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
        this._views.nodeText.setText(text);
        this.redraw();
    }

    ViewModel.prototype.getText = function(){
        return this._views.nodeText.getText();
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
        SoCuteGraph.oLib.each(rawCords, function(cord,val){
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

    ViewModel.prototype.drag=function(onStartMove, onMoving, onStopMove){


        this._views.nodeFrame.setDrag(function(x,y){
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
    var Position = SoCuteGraph.helpers.coordinates.Position;


    var ObjController=SoCuteGraph.elements.abstractController.Controller;
    function Controller(text, scene,position){
        this.init(text, scene, position);
    }

    Controller.prototype = new ObjController();



    Controller.prototype.init=function(text, scene, position){

        if (position===undefined){
            position=new Position({'x':0,'y':0});
        }
        this._visibility = false;

        this._dispatcher=null;
        this._views = {};
        this.text = text;


        //console.log('at init',this.text ,position.getPosition());
        this._views.nodeFrame = new ViewModel(text, scene, position);
        this._subscribeForEvents=[FrameEvent];

        //Depends of propertyes
        this._isDependeOf = false;
        this._dependsOfIsInit = false;
        this._lastMoveDiff = false;
        this._silentMove = false;
        this._slaveAffects = false;

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

    Controller.prototype.setText = function(text){
        this._views.nodeFrame.setText(text);
        this.redraw();
    }

    Controller.prototype.getText = function(){
        return this._views.nodeFrame.getText();
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
            SoCuteGraph.oLib.each(this._views, function(index, value){
                that._views[index].show();
            });
            this._visibility = true;

        }
    }

    Controller.prototype.hide = function(){

        if (this._visibility===true){
            var that = this;

            SoCuteGraph.oLib.each(this._views, function(index, value){

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
        var Position = SoCuteGraph.helpers.coordinates.Position;

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

    return {
        'Controller':Controller
    }

})();


SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.elements.basicNode.',
    function(){
        var Position=SoCuteGraph.helpers.coordinates.Position;
        var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
        var Line = SoCuteGraph.elements.joinLine.controllers.Controller;
        var Dispatcher = SoCuteGraph.events.dispatchers.Dispatcher;

        var Element = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
        var MoveSlave = SoCuteGraph.elements.basicNode.dependencies.MoveSlave;
        var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;

        var Animation = SoCuteGraph.elements.animation.controllers.Animation;

        test( "Jump event get name", function() {



            var disp=new Dispatcher();
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

            var animation = new Animation(500, 340, 3000, function(newY){
               newY = Math.round(newY);
               node3.moveTo(new Position({'x':610, 'y':newY}));
            });

            disp.addObject(animation);
            animation.start();


            var FrameDebugger = SoCuteGraph.elements.animation.tools.FrameDebugger;

            var framer = new FrameDebugger();
            framer.setDisplayCallback(function(frameEvnt){

            })

            disp.addObject(framer);


        });

        test ("Move dependent object", function(){
            disp = new Dispatcher();
            var paper = Raphael(document.getElementById('testCanvas'), 600, 600);
            var scene = new Scene(paper);
            var FrameEvent = SoCuteGraph.events.std.FrameEvent;

            node7 = new Node('Нода 7', scene, new Position({'x':10, 'y':20}));
            disp.addObject(node7);

            node8 = new Node('Нода 8', scene, new Position({'x':30, 'y':40}));

            new MoveSlave(disp, node7, node8);
            disp.addObject(node8);

            node7.moveTo(new Position({'x':0,'y':0  }));


            disp.notify(new FrameEvent());

            deepEqual({'x':20,'y':20}, node8.getPosition().getPosition(), 'Dependent node moved properly');




            node7.moveTo(new Position({'x':-30,'y':-40  }));


            disp.notify(new FrameEvent());

            deepEqual({'x':-10,'y':-20}, node8.getPosition().getPosition(), 'Dependent node moved properly');

            node7.moveTo(new Position({'x':230,'y':230  }));


            disp.notify(new FrameEvent());

            deepEqual({'x':250,'y':250}, node8.getPosition().getPosition(), 'Dependent node moved properly');

            node7.moveTo(new Position({'x':210,'y':240  }));



            disp.notify(new FrameEvent());

            deepEqual({'x':230,'y':260}, node8.getPosition().getPosition(), 'Dependent node moved properly');

            ok(true,'Building compleate');



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


        test("Hide node", function(){
            var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;
            var paper = Raphael(document.getElementById('testCanvas'), 800, 600);
            var scene = new Scene(paper);
            var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
            var testNode=new Node('hidden node', scene);



            var disp=new Dispatcher();

            equal(false, testNode.getVisability());

            disp.addObject(testNode);

            equal(true, testNode.getVisability());

            testNode.setVisability(false);
            equal(false, testNode.getVisability());
            testNode.show();
            equal(true, testNode.getVisability());

            testNode.hide();
            equal(false, testNode.getVisability());

            //testNode.show();

        });

    }
)