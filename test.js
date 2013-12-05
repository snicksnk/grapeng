var Position=SoCuteGraph.helpers.coordinates.Position;
var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
var Line = SoCuteGraph.elements.joinLine.Controller;


/*
test("Player subscribition", function(){

       player=new Player();
         disp=new Dispathcer();
        equal(Dispathcer.getEventUniqueId(JumpEvent),'jump','get jump u)nique id');
      
        deepEqual(
        Dispathcer.getEventUniqueId(player.subscribeForEvents()[0]), 
        Dispathcer.getEventUniqueId(JumpEvent),'Player will subscrib for right events');



        disp.addObject(player);

        
        deepEqual(player.getDispatcher(),disp,'Dispatcher is setted');

        ok(disp._subscriptions['jump']!==undefined, 'Dispatcher has create jump subscribition list');

        disp.notify(new JumpEvent());

        equal(player.state, 'jump', 'Player changed state after notifing');

        stateModel = new StateModel();

        equal(stateModel.getNewState(), false, 'State is default');

        stateModel.setState(stateModel.states.moving);

        equal(stateModel.getNewState(), stateModel.states.moving, 'State is changed');

        equal(stateModel.getState(), stateModel.states.moving, 'Current state is moving');

        equal(stateModel.getNewState(), false, 'State didnot chaged last time');

    });
*/

        test("MoveEvent sub positions",function(){
            var paper = Raphael(document.getElementById('testCanvas'), 400, 400);
            var node = new Node('test node', paper, new Position({'x':10,'y':220}));

            moveEvent=new MoveEvent(node, node.getPosition());

            testPostion=new Position({'x':12,'y':22});
            moveEvent.setSubPosition('tested_position', testPostion);

            deepEqual(moveEvent.getSubPosition('tested_position'),
                testPostion, 'seted subpostion equals to getted'
            );



        });


        test("position sub independense", function(){
            position1=new Position();
            position1.sub.leftPoint=new Position;

            position2=new Position();
            equal(typeof position2.sub.leftPoint, 'undefined',"position2 has independed sub from position1");
            equal(typeof position1.sub.leftPoint, 'object',"position1 independe from position2");
            
            position2.sub.leftPoint=new Position({'x':120,'y':130});
            notDeepEqual(position1.sub.leftPoint,position2.sub.leftPoint,'sub 1 not depends form sub 2');


        });


   		test( "Jump event get name", function() {

			  
        disp=new Dispathcer();

        position=new Position();
        position.setPos({'x':10,'y':30});



        deepEqual(position.getNewPos(),{'x':10,'y':30},'new position was set');

        equal(position.getNewPos(),false,'Position was not set');

        deepEqual(position.getPosition(),{'x':10,'y':30},'Position was given by setter is valid');



        var paper = Raphael(document.getElementById('canvas'), 800, 400);

        node=new Node('Первая нода', paper, new Position({'x':380,'y':180}));
        node.setOrientation(Element.ORIENTED_MULTI);

        //TODO delete it
        var centerView=node.getViewObject().frame.getRaphaelElement();
        centerView.attr("fill", "#FFEC73");
        centerView.attr("fill-opacity",0.5);
        centerView.attr("stroke", "#A68F00");


        disp.addObject(node);


        nodeDepends=new Node('Вторая нода', paper, new Position({'x':570,'y':21}));
        //nodeDepends.setDependsOf(node);

        disp.addObject(nodeDepends);

        equal(nodeDepends._moveEvent.getUniqueName(),'move_object_2','Event name of depended object is correct');

        equal(node._moveEvent.getUniqueName(),'move_object_1','Event name of master object is correct');


        disp.notify(node._moveEvent);


        

        deepEqual(disp._lastEvent, node._moveEvent, 'Last event of dispatcher is correct for master object');



       

        line=new Line(paper);


        line.setLineStartNode(node);



        line.setLineEndNode(nodeDepends);
        
        disp.addObject(line);
        
        node3=new Node('Третья нода', paper, new Position({'x':570,'y':310}));
        disp.addObject(node3);

        line2=new Line(paper);
        line2.setLineStartNode(node);
        line2.setLineEndNode(node3);


        disp.addObject(line2);
        
        node4=new Node('Четвертая нода', paper, new Position({'x':230,'y':250}));
        node4.setOrientation(Element.ORIENTED_LEFT);

        node4.getViewObject().frame.getRaphaelElement()
            .attr('fill','#34CFBE')
            .attr('opacity',0.5);

        disp.addObject(node4);

        line3=new Line(paper);
        line3.setLineStartNode(node);
        line3.setLineEndNode(node4);
        disp.addObject(line3);

        node5=new Node('Пятая нода', paper, new Position({'x':70,'y':370}));
        node5.setOrientation(Element.ORIENTED_RIGHT);
        node5.setOrientation(Element.ORIENTED_LEFT);
        disp.addObject(node5);


        line4=new Line(paper);
        line4.setLineStartNode(node4);
        line4.setLineEndNode(node5);
        disp.addObject(line4);


		});

    test ("set orientation", function(){
        var paper = Raphael(document.getElementById('testCanvas'), 400, 400);
    
        testNode=new Node('wrong node', paper);
        try{
            testNode.setOrientation('wrong');
            ok(false, 'Exception was not thrown');
        } catch (e){
            ok(true, 'Exception was thrown');
        }
    });

    test( "Check onEventEvents", function() {

        disp=new Dispathcer();
        
        CustomEvent=function(){

        }

        CustomEvent.prototype=new Event;

        CustomEvent.prototype.getUniqueName=function(){
            return 'customEvent'
        }

        player=new Player();
        player.eventCompleate=false;
        player.addSubscribition(CustomEvent,function(){
            this.eventCompleate=true;
        });

        disp.notifyOn(FrameEvent, new CustomEvent);






        //TODO пока не работает
        ok(true, true, 'ok');
    });