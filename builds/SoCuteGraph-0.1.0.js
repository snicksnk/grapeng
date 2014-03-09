/**/;
var SoCuteGraph = SoCuteGraph || {};


SoCuteGraph.nsCrete=function extend(nsString, extendsString) {

    if (!extendsString){
        extendsString=SoCuteGraph;
    }

    var parts = nsString.split('.'),
        parent = extendsString,
        pl, i;
    if (parts[0] == "SoCuteGraph") {
        parts = parts.slice(1);
    }
    pl = parts.length;
    for (i = 0; i < pl; i++) {
        if (typeof parent[parts[i]] == 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};/**/;
SoCuteGraph.nsCrete('testTool.Module');

SoCuteGraph.testTool.Module=(function () {
    "use strict";


    var Tests = {};
    Tests.__tests=[];
    Tests.add = function(moduleName, testFunction){

        Tests.__tests[moduleName] = testFunction;


    };

    Tests.start = function(whiteList){
        var testName;

        for (testName in Tests.__tests){
            if (typeof whiteList === 'undefined' || typeof whiteList[moduleName] !== 'undefined' )
            {
                Tests.__tests[testName]();
            }
        };
    };
    return {'Tests': Tests};
})();/**/;
SoCuteGraph.nsCrete("oLib");

SoCuteGraph.oLib = (function () {
    "use strict";

    var each = function (obj, callback) {
        var value,
        i = 0,
        length = obj.length;

        for (i in obj) {
            value = callback.call(obj[i], i, obj[i], obj);
            if ( value === false ) {
                break;
            }
        }
        return obj;
	};

    var animateCallback = function(getStartValue, getEndValue, time, onFinish){

        var startVal = getStartValue();
        var endValue = getEndValue();

    }


    return {
        'each': each
    };

})();

SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.oLib',
    function(){
        test( "Test each with array", 
        	function() {
                var ar = [10,20,30,40];
                var newAr=[];
                SoCuteGraph.oLib.each(ar, function(key, val){
                    newAr[key]=val;
                });
               deepEqual(newAr, ar, 'Generated each array equals to prototype');
    		});

        test("Test changin propertyes in object with each",
            function() {
                var obj = {'a':2,'b':3,'c':4};
                var resObj = {'a':4, 'b':6, 'c':8};
                SoCuteGraph.oLib.each(obj, function(key, val, subj){
                    subj[key] = val * 2;
                });

                deepEqual(obj, resObj, "Object modification processed properly");

            });
    });/**/;
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


    function AbstractView(){

    }

    AbstractView.prototype.hide = function(){
        this._element.hide();
    }

    AbstractView.prototype.show = function(){
        this._element.show();
    }




    function AbstractJoinPoint(paper){
    }

    AbstractJoinPoint.prototype = new AbstractView();

    AbstractJoinPoint.prototype.position=null;
    AbstractJoinPoint.prototype._element=null;

    AbstractJoinPoint.prototype.movePosition=function(){
        throw 'specify it!';
    }

    AbstractJoinPoint.prototype._initElement=function(paper){
        var Position = SoCuteGraph.helpers.coordinates.Position;
        this._element=paper.rect(0,0,2,2,0);
        this._element.attr("stroke-width", 1);
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
        var newYWithoutLineWidth = newY-this._element.attr("stroke-width");

        this._element.attr('x', newXWithoutLineWidth);
        this._element.attr('y', newYWithoutLineWidth);
        return this;
    }


    JoinPoint.prototype.hide = function(){
        this._element.hide();
    }

    JoinPoint.prototype.show = function(){
        this._element.show();
    }

    var NodeFrame= function(position, paper) {
        if (position){
            this.init(position, paper);
        }
    }

    NodeFrame.prototype = new AbstractView();


    NodeFrame.prototype.hide = function(){
        this._nodeFrame.hide();
        this._nodeCover.hide();
    }

    NodeFrame.prototype.show = function(){
        this._nodeFrame.show();
        this._nodeCover.show();
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
        this._element = paper.text(50, 50, text);
        this._element.attr('font-size',12);
        this._element.attr('fill','#272323');
        this._element.attr('font-family','verdana');
    }

    NodeText.prototype = new AbstractView();

    NodeText.prototype.position=null;
    NodeText.prototype._element=null;


    NodeText.prototype.movePosition=function(position){
        var pos=position.getPosition();
        var textX=pos['x']+this._element.node.getBBox().width/2;
        var textY=pos['y'];
        this._element.attr('x',textX);
        this._element.attr('y',textY);
        this.position.setPos({'x':textX,'y':textY})
        return this;
    }

    NodeText.prototype.getRaphaelElement=function(){
        return this._element;
    }

    NodeText.prototype.getWidth=function(){
        var width=this._element.node.getBBox().width;
        return width;
    }

    NodeText.prototype.getHeight=function(){
        var height=this._element.node.getBBox().height;
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


})();/**/;
SoCuteGraph.nsCrete("helpers.coordinates");

SoCuteGraph.helpers.coordinates = (function () {
    "use strict";
    var Position = function (cords) {
        if (!cords) {
            cords = {'x': 0, 'y': 0};
        }
        this._cords = cords;
        this._lastCords = cords;
        this.sub = {};
    };

    Position.prototype._lastGettedCords = {};

    Position.prototype._cords = {};

    Position.prototype._lastCords = {};

    Position.prototype.sub = {};

    Position.prototype.orientation = false;

    Position.prototype.getNewPos=function(){
        var resultCoordinates=false;
        if (this._cords != this._lastGettedCords){
            this._lastGettedCords = this._cords;
            resultCoordinates = this._cords;
        }
        return resultCoordinates;
    }

    Position.prototype.getPositionDiff=function(){
        var diffCoordinates={};
        /*
        if (this._cords===this._lastCords){
            return false;
        }
        */

        for (var dimension in this._cords){
            diffCoordinates[dimension]=this._cords[dimension]-this._lastCords[dimension];
        }

        this._lastGettedCords = this._cords;
        //this._lastCords=this._cords;
        return diffCoordinates;
    }

    Position.prototype.getDiffWith=function(otherPosition){
        var diffCoordinates={}, otherCoords = otherPosition.getPosition();

        for (var dimension in this._cords){
            diffCoordinates[dimension]=otherCoords[dimension] - this._cords[dimension];
        }

        return diffCoordinates;
    }

    Position.prototype.clone = function(){
        var pos = new Position(this.getPosition());
        if (sub.length>0){

        }
    }


    Position.prototype._cloneSUbPositions = function(sub){
        SoCuteGraph.oLib.each(sub, function(index, val){

        });
    }


    Position.getDiffAmount = function(diffCoords){
        var diffAmount = 0;
        for (var dimension in diffCoords){
            diffAmount+=diffCoords[dimension];
        }

        return diffAmount;
    }

    Position.getCenterPoint = function(position1, position2){
        var diffCords = position1.getDiffWith(position2);
        var centerPosition = new Position();
        var centerCords = {};

        for (var dimension in position1.getPosition()){
            if (position1.getPosition()[dimension]<position2.getPosition()[dimension]){
                centerCords[dimension] = position1.getPosition()[dimension] + diffCords[dimension]/2;
            } else {
                centerCords[dimension] = position2.getPosition()[dimension] + diffCords[dimension]/2;
            }
        }
        centerPosition.setPos(centerCords);
        return centerPosition;
    }


    Position.prototype.setDiff=function(diff){
        var newCords={};
        for (var dimension in diff){
            newCords[dimension]=this._cords[dimension]+diff[dimension];
        }
        this.setPos(newCords);
    }

    Position.prototype.getPosition=function(){
        return this._cords;
    }

    Position.prototype.setPos=function(cords){
        this._lastCords=this._cords;
        this._cords=cords;
    };

    return {
        'Position':Position
    }

})();

SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.helpers.coordinates',
    function(){
        var Position=SoCuteGraph.helpers.coordinates.Position;

        test("Get diff with other position", function(){
            var pos1=new Position({'x':3,'y':4});
            var pos2=new Position({'x':5,'y':17});

            deepEqual(pos1.getDiffWith(pos2), {'x':2,'y':13}, 'pos1 + posResult = pos2');

            pos1=new Position({'x':13,'y':24});
            pos2=new Position({'x':5,'y':17});

            deepEqual(pos1.getDiffWith(pos2), {'x':-8,'y':-7}, 'pos1 + posResult = pos2');

            pos1=new Position({'x':13,'y':24});
            pos2=new Position({'x':13,'y':24});

            deepEqual(pos1.getDiffWith(pos2), {'x':0,'y':0}, 'pos1 + posResult = pos2');



        });


        test("Get diff amount", function(){

            var Position=SoCuteGraph.helpers.coordinates.Position;

            var diff={'x':2,'y':3};
            equal(Position.getDiffAmount(diff), 5, 'Diff amount is ok')

            diff={'x':0, 'y':0};
            equal(Position.getDiffAmount(diff), 0, 'Diff amount is ok')

        });

        test("MoveEvent sub positions",function(){

            var Position=SoCuteGraph.helpers.coordinates.Position;
            var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
            var Line = SoCuteGraph.elements.joinLine.Controller;
            var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;


            var paper = Raphael(document.getElementById('testCanvas'), 600, 600);

            var scene = new Scene(paper);

            var node = new Node('test node', scene, new Position({'x':10,'y':220}));
            var MoveEvent = SoCuteGraph.events.std.MoveEvent;
            var SCEvent = SoCuteGraph.events.std.SCEvent;
            var moveEvent=new MoveEvent(node, node.getPosition());


            testPostion=new Position({'x':12,'y':22});
            moveEvent.setSubPosition('tested_position', testPostion);

            deepEqual(moveEvent.getSubPosition('tested_position'),
                testPostion, 'seted subpostion equals to getted'
            );
        })

        test("get center point", function(){
            var Position=SoCuteGraph.helpers.coordinates.Position;
            var position1 = new Position({'x':-5,'y':10});
            var position2 = new Position({'x':10, 'y':20});
            var centerPositon = Position.getCenterPoint(position1, position2);

            deepEqual(centerPositon.getPosition(), {'x':2.5, 'y':15}, 'Center position is good');


        });
    }
)/**/;
SoCuteGraph.nsCrete("events.dispatchers");

SoCuteGraph.events.dispatchers = (function () {
    Dispathcer = function(){
        this.init();
    }

    Dispathcer.prototype.init = function(){
        var FrameEvent = SoCuteGraph.events.std.FrameEvent;
        this._objects=[];
        this._subscriptions={};
        this._uniqueIdCounter=1;
        this._lastEvent=null;
        this._onEventEvents={};
        this.frameRate = 33;

        var that = this;
        var frameFunction = function(){
                var startTime = new Date().getTime();
                var expectedEndTime = startTime + that.frameRate;
                var frame = new FrameEvent(startTime, that.frameRate);
                that.notify(frame);
                var endTime = new Date().getTime();
                if (expectedEndTime>endTime){
                    setTimeout(frameFunction, that.frameRate);
                } else {
                    //console.log('slow frame with'+(endTime-expectedEndTime));
                    frameFunction();
                }
        };

        frameFunction();

    }


    Dispathcer.prototype.addObject=function(obj){
        var id = this._uniqueIdCounter;
        obj.setUniqueId(id);
        this._objects[id] = obj;
        this._uniqueIdCounter++;

        subscribition=obj.subscribeForEvents();

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
        evntName=Dispathcer.getEventUniqueId(Evnt);
        subsList = this._subscriptions[evntName] || [];

        this._lastEvent=Evnt;

        if (typeof this._onEventEvents['evntName']!==undefined){
            onEvents=this._onEventEvents;
        }
        for (key in subsList){
            object = this.getObjectById(subsList[key]);
            if (typeof object !=='undefined' && typeof object['handle'+evntName] !=='undefined'){
                object['handle'+evntName](Evnt);
            } else if (typeof this._subscriptions[evntName] !=='undefined') {
                this._subscriptions[evntName].splice(key, 1);
            }
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
            var disp = new Dispathcer();
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
            var disp = new Dispathcer();
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
            var disp = new Dispathcer();
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
            var disp = new Dispathcer();
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
            var disp = new Dispathcer();
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
)/**/;
SoCuteGraph.nsCrete('events.std');

SoCuteGraph.events.std=function(){
    var Position=SoCuteGraph.helpers.coordinates.Position;

    var Position=SoCuteGraph.helpers.coordinates.Position;


    function SCEvent(){

    }

    SCEvent.prototype.getUniqueName=function(){
        return '_empty';
    }

    function JumpEvent(){
    };

    JumpEvent.prototype=new SCEvent()

    JumpEvent.prototype.getUniqueName=function(){
        return 'jump';
    }


    function FrameEvent(time, frameRate){
        this.setTime(time);
        this.setFrameRate(frameRate);
    };
    FrameEvent.prototype=new SCEvent();

    FrameEvent.prototype.getTime = function(){
        return this.time;
    }

    FrameEvent.prototype.setTime = function(time){
        this.time = time;
    }

    FrameEvent.prototype.getFrameRate = function(){
        return this.frameRate;
    }

    FrameEvent.prototype.setFrameRate = function(frameRate){
        this.frameRate = frameRate;
    }


    FrameEvent.prototype.getUniqueName=function(){
        return 'frame';
    }

    function MoveEvent(masterObject, position){
        this._position=position;

        //TODO Temp hack
        this.position=new Position();

        this.masterObjectId=masterObject.getUniqueId();
        this._orientation=false;

    }


    MoveEvent.prototype=new SCEvent();


    MoveEvent.prototype._resolveStrategy=null;


    /**
     *
     * @returns {*}
     */
    MoveEvent.prototype.getPosition=function(){

        return this.position;
    }

    MoveEvent.prototype.setPosition=function(position){
        //TODO Temp hack
        this.position=position;
    }

    MoveEvent.prototype.setOrientation=function(orientation) {
        this._orientation=orientation;
    }

    MoveEvent.prototype.getOrientation=function() {
        return this._orientation;
    }

    MoveEvent.prototype.getSubPosition=function(subPosition){
        if (
            typeof this._position['sub']==='undefined' ||
                typeof this._position.sub[subPosition]==='undefined'){
            throw 'sub position with name "'+subPosition+'" is undefined';
        }
        return this._position.sub[subPosition];
    }

    MoveEvent.prototype.setSubPosition=function(name, position){
        if (typeof this._position['sub']==='undefined'){
            this._position.sub={};
        }
        this._position.sub[name]=position;
    }




    MoveEvent.prototype.getUniqueName=function(){
        return 'move_object_'+this.masterObjectId;
    }
    /*
     function MoveNodeEvent(masterObject, position){
     MoveEvent.call(this, masterObject, position);

     }

     MoveNodeEvent.prototype=new MoveEvent();
     */

    return {
        'SCEvent':SCEvent,
        'MoveEvent':MoveEvent,
        'FrameEvent':FrameEvent
    }



}();/**/;
SoCuteGraph.nsCrete('elements.abstractController');

SoCuteGraph.elements.abstractController=(function () {
    "use strict";
    function ObjController(){};

    ObjController.prototype.setUpModels=function(paper){

    }

    ObjController.prototype.getObjType=function(){
        return '_empty'
    }

    ObjController.prototype.subscribeForEvents=function(){
        return this._subscribeForEvents;
    }

    ObjController.prototype.setUniqueId=function(id){
        this.uniqueId=id;
    }

    ObjController.prototype.getPosition=function(){
        return this._nodeFrame.position;
    }

    ObjController.prototype.getUniqueId=function(){
        return this.uniqueId;
    }

    ObjController.prototype._dispatcher=null;

    ObjController.prototype.setDispatcher=function(dispatcher){
        this._dispatcher=dispatcher;
    }

    ObjController.prototype.getDispatcher=function(){
        return this._dispatcher;
    }


    ObjController.prototype._subscribeForEvents=[];

    ObjController.prototype.setUpBehavior=function(){

    }

    ObjController.prototype.addSubscription=function(Evnt, Handler){
        var handlerName;
        this._subscribeForEvents.push(Evnt);
        handlerName=this.createHandlerName(Evnt);
        this[handlerName]=Handler;
        if (this._dispatcher !== null){
            this._dispatcher.addSubscriptionToObject(this.getUniqueId(), Evnt);
        }
    }

    ObjController.prototype.createHandlerName = function(Evnt){
        return 'handle'+ Dispathcer.getEventUniqueId(Evnt);
    }

    ObjController.prototype.removeSubscription = function(Evnt){
        var index,
            newSubscribeForEvents = this._subscribeForEvents;
        delete this[this.createHandlerName(Evnt)];
        SoCuteGraph.oLib.each(this._subscribeForEvents, function(key, val){
            if (Dispathcer.getEventUniqueId(val) == Dispathcer.getEventUniqueId(val)){
                newSubscribeForEvents.splice(key, 1);
            }
        });
        this._subscribeForEvents = newSubscribeForEvents;
    }




    return {
      'Controller': ObjController
    };

})();/**/;
SoCuteGraph.nsCrete("elements.emptyElement.controllers");

SoCuteGraph.elements.emptyElement.controllers = (function () {
    "use strict";
    var AbstractController = SoCuteGraph.elements.abstractController.Controller;
    var Empty = function() {

    }

    Empty.prototype=new AbstractController();

    return {
        'Controller':Empty
    }

})();/**/;
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
        var Position = SoCuteGraph.helpers.coordinates.Position;

        var MoveEvent = SoCuteGraph.events.std.MoveEvent;

        this._slave.MoveSlaveData=[];
        this._slave.MoveSlaveData.oldMasterPosition = new Position(this._master.getPosition().getPosition());

        this._slave.setDependsOf(this._master);

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
        if (this.visibility){
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

        this.resizeFramerToText();
        this._moveFrame(this.position);
        this._moveText(this.position)
        this._moveLeftPoint(this.position);
        this._moveRightPoint(this.position);
        this._prepareSubElementsPositionData();

    }

    ViewModel.prototype.moveByDiff = function(diffPosition){
        var newPosition = new Position(this.position.getPosition());
        newPosition.setDiff(diffPosition.getPosition());
        this.moveTo(newPosition);
    }

    ViewModel.prototype.moveTo=function(position){
        var pos=position.getPosition();
        this.position.setPos(pos);
        this.redraw();
    }

    ViewModel.prototype._prepareSubElementsPositionData=function(){

        var textPosition=this._prepareTextPositionData();

        this._preparePointsPositionData();

        this.position.sub.text.setPos(textPosition);

        this.position.orientation=this.getOrientation();


    }

    ViewModel.prototype._prepareTextPositionData=function(){
        return this._views.nodeText.position.getPosition();
    }


    ViewModel.prototype._preparePointsPositionData=function() {
        this.position.sub.leftJoinPoint.setPos(this._views.leftJoinPoint.position.getPosition());
        this.position.sub.rightJoinPoint.setPos(this._views.rightJoinPoint.position.getPosition());
    }


    ViewModel.prototype._moveFrame=function(position){
        this._views.nodeFrame.moveTo(position);
    }

    ViewModel.prototype._moveText=function(position){
        var pos=position.getPosition();
        var textX=pos['x']+this._views.nodeFrame.getHorizontalOffset();
        var textY=pos['y']+this._views.nodeFrame.getVerticalOffset()+this._views.nodeText.getHeight()/2;
        this._views.nodeText.movePosition(new Position({'x':textX,'y':textY}));
    }


    ViewModel.prototype._moveLeftPoint=function(position){
        var pos=position.getPosition();
        var leftX=pos['x']-1;
        var leftY=pos['y']+this._views.nodeFrame.getHeight()/2;
        this._views.leftJoinPoint.movePosition(new Position({'x':leftX,'y':leftY}));
    }

    ViewModel.prototype._moveRightPoint=function(position){
        var nodeWidth=this._views.nodeFrame.getWidth();
        var pos=position.getPosition();
        var rightX=pos['x']+nodeWidth-1;
        var rightY=pos['y']+this._views.nodeFrame.getHeight()/2;
        this._views.rightJoinPoint.movePosition(new Position({'x':rightX,'y':rightY}));
    }

    ViewModel.prototype._moveLeftPosition


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

    Controller.prototype.redraw=function(){
        this._views.nodeFrame.redraw();
        if (this.getDispatcher()){
            var moveEvent = new MoveEvent(this);
            moveEvent.setPosition(this._views.nodeFrame.getPosition());
            moveEvent.setOrientation(this._views.nodeFrame.getOrientation());
            this.getDispatcher().notify(moveEvent);
        }
    }

    Controller.prototype.init=function(text, scene, position){

        var position;
        if (position===undefined){
            position=new Position({'x':10,'y':20});
        }
        this._visibility = false;

        this._dispatcher=null;
        this._views = {};
        this.text = text;
        this._views.nodeFrame = new ViewModel(text, scene, position);
        this._subscribeForEvents=[FrameEvent];

        this._newCords = false;

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
                that._views[index].hide();
            });

            this._visibility = false;
        }
    }


    Controller.prototype.getPosition=function(){
        return this._views.nodeFrame.getPosition();
    }


    Controller.prototype.setDependsOf=function(dependedOf){
        var Position = SoCuteGraph.helpers.coordinates.Position;
        var parentNodePosition=dependedOf.getPosition();
        var lastParentNodePosition=new Position(parentNodePosition.getPosition());


        this.addSubscription(new MoveEvent(dependedOf),
            function(Evnt){

                var element = this._views.nodeFrame;
                var dispatcher = this.getDispatcher();

                var diff = Evnt.getPosition().getPositionDiff();
                var newPosition = new Position(diff);

                this._views.nodeFrame.moveByDiff(newPosition);


                var moveEvent = new MoveEvent(this,element.getPosition());

                moveEvent.setPosition(element.position);
                moveEvent.setOrientation(element.getOrientation());


                dispatcher.notify(moveEvent);

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

    Controller.prototype.setUpBehavior=function(){

        var element;
        element = this._views.nodeFrame;



        this._moveEvent=new MoveEvent(this,element.position);



        this.show();

        var that = this;

        this.addSubscription(FrameEvent, function(){
            if (this._newCords){
                var moveEvent = this._moveEvent;
                var dispatcher = this.getDispatcher();

                Controller.moveTo(new Position(this._newCords), element, moveEvent);
                dispatcher.notify(moveEvent);
                this._newCords = false;
            }
        });



        this._views.nodeFrame.drag(
            function(x,y){

            },
            function(x,y){
                that._newCords = {"x":x,"y":y};
            },
            function(x,y){

            }
        );

    };
    /**
     *
     * @param position
     * @param moveEventWithController
     * @param viewModel
     */
    Controller.moveTo = function(position, viewModel, moveEventWithController){
        viewModel.moveTo(position);
        moveEventWithController.setPosition(viewModel.position);
        moveEventWithController.setOrientation(viewModel.getOrientation());
        return moveEventWithController;
    }

    Controller.prototype.moveTo = function(position){
        var moveEvent = new MoveEvent(this);
        this._moveEvent = Controller.moveTo(position, this._views.nodeFrame, moveEvent);
        this._dispatcher.notify(this._moveEvent);

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


        var Element = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
        var MoveSlave = SoCuteGraph.elements.basicNode.dependencies.MoveSlave;
        var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;

        var Animation = SoCuteGraph.elements.animation.controllers.Animation;

        test( "Jump event get name", function() {



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

            var animation = new Animation(500, 340, 3000, function(newY){
               newY = Math.round(newY);
               node3.moveTo(new Position({'x':610, 'y':newY}));
            });

            disp.addObject(animation);
            animation.start();


        });

        test ("Move dependent object", function(){
            disp = new Dispathcer();
            var paper = Raphael(document.getElementById('testCanvas'), 600, 600);
            var scene = new Scene(paper);

            node7 = new Node('Нода 7', scene, new Position({'x':10, 'y':20}));
            disp.addObject(node7);

            node8 = new Node('Нода 8', scene, new Position({'x':30, 'y':40}));

            new MoveSlave(disp, node7, node8);
            disp.addObject(node8);

            node7.moveTo(new Position({'x':0,'y':0  }));

            deepEqual({'x':20,'y':20}, node8.getPosition().getPosition(), 'Dependent node moved properly');

            node7.moveTo(new Position({'x':-30,'y':-40  }));

            deepEqual({'x':-10,'y':-20}, node8.getPosition().getPosition(), 'Dependent node moved properly');


            node7.moveTo(new Position({'x':230,'y':230  }));

            deepEqual({'x':250,'y':250}, node8.getPosition().getPosition(), 'Dependent node moved properly');


            node7.moveTo(new Position({'x':210,'y':240  }));
            deepEqual({'x':230,'y':260}, node8.getPosition().getPosition(), 'Dependent node moved properly');






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



            var disp=new Dispathcer();

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
)/**/;
SoCuteGraph.nsCrete("elements.joinLine.viewModels");
SoCuteGraph.nsCrete("elements.joinLine.controllers");
SoCuteGraph.nsCrete("elements.joinLine.view");
SoCuteGraph.nsCrete("elements.joinLine.dependencies");


SoCuteGraph.elements.joinLine.dependencies = (function () {

    var NodeViewModel = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
    var Position = SoCuteGraph.helpers.coordinates.Position;
    var ResolveHierarchyLinePoints = function(startNode, endNode){
        if (startNode && endNode){
            this.init(startNode, endNode);
        }
    }

    ResolveHierarchyLinePoints.prototype.init=function(startNode, endNode) {
        this._endNodeOrientation = endNode.getOrientation();
        this._startNodeOrientation = startNode.getOrientation();
    }

    ResolveHierarchyLinePoints.prototype.resolveStartPoint = function(position, orientation){
        var outPointPosition;
        this._startNodeOrientation = orientation;
        if (orientation===NodeViewModel.ORIENTED_RIGHT){
            outPointPosition=position.sub.rightJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_LEFT){
            outPointPosition=position.sub.leftJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_MULTI){

            var endNodeOrientation=this._endNodeOrientation;

            if (endNodeOrientation===NodeViewModel.ORIENTED_RIGHT) {
                outPointPosition=position.sub.rightJoinPoint;
            } else if (endNodeOrientation===NodeViewModel.ORIENTED_LEFT) {
                outPointPosition=position.sub.leftJoinPoint;
            }
            else if (endNodeOrientation===NodeViewModel.ORIENTED_MULTI) {
                throw 'Still not implemented ((';
            } else {
                throw 'Undefined orientation "'+endNodeOrientation+'"';
            }
            //outPointPosition=position.sub.leftJoinPoint;
        } else {
            throw "Can't resolve points for orientation '"+orientation+"'";
        }
        return outPointPosition;

    }

    ResolveHierarchyLinePoints.prototype.resolveEndPoint = function (position, orientation){
        var inPointPostion;
        this._endNodeOrientation = orientation;
        if (orientation===NodeViewModel.ORIENTED_RIGHT){
            inPointPostion=position.sub.leftJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_LEFT){
            inPointPostion=position.sub.rightJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_MULTI){
            inPointPostion=position.sub.leftJoinPoint;
        } else {
            throw "Can't resolve points for orientation '"+orientation+"'";
        }
        return inPointPostion;
    }



    var ResolveAssocLinePoints = function(){

    }
    //Add abstract class instead
    ResolveAssocLinePoints.prototype = new ResolveAssocLinePoints();

    ResolveAssocLinePoints.prototype.resolveStartPoint = function(position, orientation){
        var outPointPosition;
        outPointPosition = this._calcCenter(position.sub.leftJoinPoint, position.sub.rightJoinPoint);
        return outPointPosition;

    }

    ResolveAssocLinePoints.prototype._calcCenter = function(leftPoint, rightPoint){
        var center = Position.getCenterPoint(leftPoint, rightPoint);
        return center;
    }

    ResolveAssocLinePoints.prototype.resolveEndPoint = function (position, orientation){
        var inPointPostion
        inPointPostion = this._calcCenter(position.sub.leftJoinPoint, position.sub.rightJoinPoint);
        return inPointPostion;
    }



    return {
        'ResolveHierarchyLinePoints':ResolveHierarchyLinePoints,
        'ResolveAssocLinePoints': ResolveAssocLinePoints
    }
})();

SoCuteGraph.elements.joinLine.viewModels = (function () {
    "use strict";



    var ViewModel = function(scene, pointsResolver){
        if (scene, pointsResolver){
            this.init(scene, pointsResolver);
        }
    }

    ViewModel.prototype.init = function(scene, pointsResolver) {
        var Position = SoCuteGraph.helpers.coordinates.Position;
        this.startPos = new Position();
        this.endPos = new Position();
        this._startNodeOrientation=false;
        this._endNodeOrientation=false;
        this._pointsResolver = pointsResolver;

        //this.moveStartPoint(new Position({'x':230,'y':'150'}))
        this.curve = scene.Path("0");

    }




    ViewModel.prototype.moveStartPoint=function(position, orientation){

        this.startPos.setPos(this._resolveNodeOutPoint(position, orientation).getPosition());

        this._startNodeOrientation=orientation;

        this.redrawLine();
    }






    ViewModel.prototype._resolveNodeOutPoint=function(position, orientation){
        return this._pointsResolver.resolveStartPoint(position, orientation);
    }





    ViewModel.prototype._resolveNodeInPoint=function(position, orientation){
        return this._pointsResolver.resolveEndPoint(position, orientation);
    }





    ViewModel.prototype.moveEndPoint=function(position, orientation){
        this.endPos.setPos(this._resolveNodeInPoint(position, orientation).getPosition());
        this._endNodeOrientation=orientation;
        this.redrawLine();
    }


    ViewModel.prototype.redrawLine=function(start, end){

        if (start &&  end){
            var start = start.getPosition();
            var end = end.getPosition();
        } else {
            var start = this.getStartPostion();
            var end = this.getEndPosition();
        }

        var centerX=(end['x']-start['x'])/2+start['x'];
        var centerY=(end['y']-start['y'])/2+start['y'];

        //this.paper.circle(centerX, centerY, 10);


        this.curve.setSVGPath([
            "M",start['x'],start['y'],
            'Q',centerX,start['y'],
            ,centerX,centerY,
            'Q',centerX,end['y'],
            end['x'],end['y']
        ]);

    }

    ViewModel.prototype.getStartPostion=function(){
        var start=this.startPos.getPosition();
        return start;
    }

    ViewModel.prototype.getEndPosition=function(){
        var end=this.endPos.getPosition();
        return end;
    }

    return {
        'ViewModel':ViewModel
    };

})();


SoCuteGraph.elements.joinLine.controllers = (function () {
    "use strict";


    var ObjController = SoCuteGraph.elements.abstractController.Controller;
    var ViewModel = SoCuteGraph.elements.joinLine.viewModels.ViewModel;
    var FrameEvent = SoCuteGraph.events.std.FrameEvent;
    var MoveEvent = SoCuteGraph.events.std.MoveEvent;
    var ResolveHierarchyLinePoints = SoCuteGraph.elements.joinLine.dependencies.ResolveHierarchyLinePoints;


    function Controller(paper, startNode, endNode, PointsResolver){
        if (paper, startNode, endNode){
            this._init(paper, startNode, endNode, PointsResolver);
        }
    }


    Controller.prototype=new ObjController();


    Controller.prototype._init=function(paper, startNode, endNode, PointsResolver){
        var resolver;
        this._subscribeForEvents=[FrameEvent];

        if (!PointsResolver) {
            PointsResolver = ResolveHierarchyLinePoints;
        }

        resolver = new PointsResolver(startNode, endNode);
        this._nodeFrame=new ViewModel(paper, resolver);


        this._nodeFrame.moveStartPoint(startNode.getPosition(), startNode.getOrientation());
        this.addSubscription(new MoveEvent(startNode),
            this._lineStartDepends);
        this._nodeFrame.moveEndPoint(endNode.getPosition(), endNode.getOrientation());
        this.addSubscription(new MoveEvent(endNode),
             this._lineEndDepends);

        this._newStartNodeEvnt = false;
        this._newEndNodeEvnt = false;

        this.addSubscription(FrameEvent, function(){
            if (this._newEndNodeEvnt){
                this._nodeFrame.moveEndPoint(this._newEndNodeEvnt.getPosition(), this._newEndNodeEvnt.getOrientation());
                this._newEndNodeEvnt = false;
            }

            if (this._newStartNodeEvnt){
                this._nodeFrame.moveStartPoint(this._newStartNodeEvnt.getPosition(), this._newStartNodeEvnt.getOrientation());
                this._newStartNodeEvnt = false;
            }
        });

    }

    var NodeViewModel = SoCuteGraph.elements.basicNode.viewModel.ViewModel;



    Controller.prototype._lineStartDepends=function(Evnt){
        this._newStartNodeEvnt = Evnt;
        //this._nodeFrame.moveStartPoint(Evnt.getPosition(), Evnt.getOrientation());
    }

    Controller.prototype._lineEndDepends=function(Evnt){
        this._newEndNodeEvnt = Evnt;
        //this._nodeFrame.moveEndPoint(Evnt.getPosition(), Evnt.getOrientation());
    }




    Controller.prototype.subscribeForEvents=function(){
        return this._subscribeForEvents;
    };

    return {
        'Controller':Controller
    };

})();

/**
 *   var NodeViewModel = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
 var ObjController = SoCuteGraph.elements.abstractController.Controller;
 var FrameEvent = SoCuteGraph.events.std.FrameEvent;
 var MoveEvent = SoCuteGraph.events.std.MoveEvent;

 *//**/;
SoCuteGraph.nsCrete("elements.animation.controllers");



SoCuteGraph.elements.animation.controllers = (function() {

    var AbstractController = SoCuteGraph.elements.abstractController.Controller;
    var FrameEvent = SoCuteGraph.events.std.FrameEvent;
    var Animation = function(startValue, endValue, time, setValue, onFinish){
        this.init(startValue, endValue, time, setValue, onFinish);
    }


    Animation.prototype = new AbstractController;


    Animation.prototype.init = function(startValue, endValue, time, setValue, onFinish){
        this.startVal = parseFloat(startValue);
        this.endVal = parseFloat(endValue);
        this.time = time;
        this.setValue = setValue;
        this.onFinish = onFinish || function(){};
        this.isStated = false;
        this.addSubscription(FrameEvent, Animation.defaultAnimator);
    }

    Animation.defaultAnimator = function(evnt){

        if (this.isStated){
            var currentTime = evnt.getTime()-this.startTime;
            var percentOfCompleate = currentTime/this.time*100;
            if (percentOfCompleate>100){
                percentOfCompleate=100;
            }
            this.currentValue = ((this.endVal - this.startVal)*percentOfCompleate*0.01)+this.startVal;

            this.setValue(this.currentValue);

            if (percentOfCompleate === 100){
                this.complete();
            }
        }
    };

    Animation.prototype.start = function(){
        this.isStated = true;
        this.startTime = new Date().getTime();
        this.endTime = this.startTime + this.time;

    }

    Animation.prototype.complete = function(){
        this.stop();
        this.onFinish();
    }

    Animation.prototype.stop = function(){
        this.isStated = false;
    }


    return {
        "Animation": Animation
    };


})();



SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.elements.abstractController.Controller',
    function(){
        var Animation = SoCuteGraph.elements.animation.controllers.Animation;
        var Dispatcher = SoCuteGraph.events.dispatchers.Dispatcher;

        test("Test animation", function(){
            var animate = new Animation();
            var n=0;
            animate.init(0,500, 500, function(newVal){
                n = newVal;
            }, function(){

            });

            var disp = new Dispathcer();
            disp.addObject(animate);
            animate.start();
            ok(true, "animation is ok");




        });
    }
);