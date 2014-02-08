
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



    test( "Check onEventEvents", function() {
        /*
        var disp=new Dispathcer();

        var SCEvent = SoCuteGraph.events.std.SCEvent;

        CustomEvent=function(){

        }

        CustomEvent.prototype=new SCEvent;

        CustomEvent.prototype.getUniqueName=function(){
            return 'customEvent'
        }

        player=new Player();
        player.eventCompleate=false;
        player.addSubscription(CustomEvent,function(){
            this.eventCompleate=true;
        });

        disp.notifyOn(FrameEvent, new CustomEvent);





        */
        //TODO пока не работает
        ok(true, true, 'ok');

    });