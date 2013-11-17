
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

        deepEqual(position.getNewPos(),{'x':10,'y':30},'new pos is setted');

        equal(position.getNewPos(),false,'Pos is not been setted');

        deepEqual(position.getPos(),{'x':10,'y':30},'Get setted postion');



        var paper = Raphael(document.getElementById('canvas'), 400, 400);

        node=new Node('Первая нода', paper, new Position({'x':10,'y':220}));


        disp.addObject(node);


        console.log('first  node right****',node._element.position.sub.rightPoint.getPos());
        nodeDepends=new Node('Вторая нода', paper, new Position({'x':120,'y':21}));
        console.log('first  node right****',node._element.position.sub.rightPoint.getPos());

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
        
        node3=new Node('Третья нода', paper, new Position({'x':260,'y':80}));
        disp.addObject(node3);

        line2=new Line(paper);
        line2.setLineStartNode(nodeDepends);
        line2.setLineEndNode(node3);


        disp.addObject(line2);
        
        node4=new Node('Четвертая нода', paper, new Position({'x':310,'y':250}));
        disp.addObject(node4);

        line3=new Line(paper);
        line3.setLineStartNode(node);
        line3.setLineEndNode(node4);
        disp.addObject(line3);









        /*
        last_time=0;
        setInterval(function() {
        if((new Date) - last_time > 1000/1) {
                last_time = new Date;
                console.log('daa');
            }
        }, 10);
        */

        //setInterval(function() { disp.notify(new FrameEvent()) }, 1000);






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







        ok(true, true, 'ok');
    });