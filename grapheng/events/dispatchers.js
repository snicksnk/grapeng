SoCuteGraph.nsCrete("events.dispatchers");

SoCuteGraph.events.dispatchers = (function () {
    "use strict";
    var Dispathcer = function () {
        this.init();
    }

    Dispathcer.prototype.init = function(){

        this._objects=[];
        this._subscriptions={};
        this._uniqueIdCounter=1;
        this._lastEvent=null;
        this._onEventEvents={};
        this.frameRate = 40;
        this.frameTime = false;
        this.fpsProcessor();

    }

    Dispathcer.prototype.fpsProcessor = function(once){
        var FrameEvent = SoCuteGraph.events.std.FrameEvent;
        var that = this;
        var frameFunction = function(){

            var startTime = new Date().getTime();
            var expectedEndTime = startTime + that.frameRate;
            var frame = new FrameEvent(startTime, that.frameRate, that.frameTime);
            that.notify(frame);
            var endTime = new Date().getTime();

            that.frameTime = endTime - startTime;

            if (!once){
                if (expectedEndTime>endTime){
                    setTimeout(frameFunction, that.frameRate);
                } else {
                    console.log('slow frame with'+(endTime-expectedEndTime));
                    frameFunction();
                }
            }
            //console.log('FRAME!');

        };
        frameFunction();
    }


    Dispathcer.prototype.addObject=function(obj){
        var id = this._uniqueIdCounter;
        obj.setUniqueId(id);
        this._objects[id] = obj;
        this._uniqueIdCounter++;

        var subscribition=obj.subscribeForEvents();

        obj.setDispatcher(this);
        obj.setUpBehavior();

        for (var i=0; i<subscribition.length; i++){
            this.addSubscriptionToObject(id, subscribition[i]);
        }
    }

    Dispathcer.prototype.getObjectById=function(id){
        return this._objects[id];
    }

    Dispathcer.getEventUniqueId=function(Evnt){
        if (Evnt.getUniqueName !== undefined){

            return Evnt.getUniqueName();
        } else {
            if (typeof Evnt.prototype.getUniqueName === 'undefined') {
                throw 'Evnt object has no getUniqueName method';
            }
            return Evnt.prototype.getUniqueName();
        }
    }

    Dispathcer.prototype.notify=function(Evnt){
        var evntName, subsList, onEvents, object;
        var evntName=Dispathcer.getEventUniqueId(Evnt);
        var subsList = this._subscriptions[evntName] || [];

        this._lastEvent=Evnt;

        if (typeof this._onEventEvents['evntName']!==undefined){
            onEvents=this._onEventEvents;
        }
        for (var key in subsList){
            object = this.getObjectById(subsList[key]);
            if (typeof object !=='undefined' && typeof object['handle'+evntName] !=='undefined'){
                object['handle'+evntName](Evnt);
            } else if (typeof this._subscriptions[evntName] !=='undefined') {
                this._subscriptions[evntName].splice(key, 1);
            }
        }
    }

    Dispathcer.prototype.resolveEventHanler = function(object, eventUniqueId){
        if (typeof object !=='undefined' && typeof object['handle'+eventUniqueId] !=='undefined'){
            return object['handle'+eventUniqueId];
        } else {
            return undefined;
        }
    }

    Dispathcer.prototype.removeObject= function(object){
        var objId = object.getUniqueId();
        delete this._objects[objId];
    }

    Dispathcer.prototype.addSubscriptionToObject = function(objId, subscribition){
        var evntName=Dispathcer.getEventUniqueId(subscribition);
        if (this._subscriptions[evntName]==undefined){
            this._subscriptions[evntName]=[];
        }
        this._subscriptions[evntName].push(objId);
    }



    return {
      'Dispatcher':Dispathcer
    };
}());



SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.events.dispatchers.',
    function(){
        "use strict";
        var Dispatcher = SoCuteGraph.events.dispatchers.Dispatcher;
        var EmptyController = SoCuteGraph.elements.emptyElement.controllers.Controller;
        var EmptyEvent = SoCuteGraph.events.std.SCEvent;

        test ("Check add object", function(){
            var controller = new EmptyController();
            var disp = new Dispatcher();
            disp.addObject(controller);
            deepEqual(disp.getObjectById(controller.getUniqueId()), controller, 'Object was added properly');
        });

        test("Check handle event", function(){
            var disp = new Dispatcher();
            var controller = new EmptyController();

            controller.testProperty = false;

            controller.addSubscription(EmptyEvent, function(){
                this.testProperty = true;
            });
            disp.addObject(controller);
            disp.notify(new EmptyEvent);
            ok(controller.testProperty, 'Test property was changed by event');

        });

        test("Add event handler after adding to dispatcher", function(){
            var disp = new Dispatcher();
            var controller = new EmptyController();

            controller.testProperty = false;
            disp.addObject(controller);
            controller.addSubscription(EmptyEvent, function(){
                this.testProperty = true;
            });

            disp.notify(EmptyEvent);
            ok(controller.testProperty, 'Test property was changed by event');

        });

        test("Removing the handler", function(){
            var disp = new Dispatcher();
            var controller = new EmptyController();

            controller.testProperty = false;

            controller.addSubscription(EmptyEvent, function(){
               this.testProperty = true;
            });
            controller.removeSubscription(EmptyEvent);

            disp.addObject(controller);
            disp.notify(EmptyEvent);
            ok(!controller.testProperty, "testProperty is not changed by unbinded event");

        });

        test("Removing the handler after adding to dispatcher", function(){
            var disp = new Dispatcher();
            var controller = new EmptyController();
            controller.testProperty = false;

            controller.addSubscription(EmptyEvent, function(){
                this.testProperty = true;
            });
            disp.addObject(controller);
            controller.removeSubscription(EmptyEvent);
            disp.notify(EmptyEvent);
            ok(!controller.testProperty, "testProperty is not changed by unbinded event");
        });

        test("Remove object", function(){
            var disp = new Dispatcher();
            var controller = new EmptyController();
            controller.testProperty = false;

            controller.addSubscription(EmptyEvent, function(){
                this.testProperty = true;
            });
            disp.addObject(controller);
            disp.removeObject(controller);

            disp.notify(EmptyEvent);
            ok(!controller.testProperty, "testProperty is not changed inside removed object");

        });


            }
)
