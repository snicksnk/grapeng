SoCuteGraph.nsCrete("elements.animation.controllers");
SoCuteGraph.nsCrete("elements.animation.tools");



SoCuteGraph.elements.animation.tools = (function () {
    var FrameEvent = SoCuteGraph.events.std.FrameEvent;
    var AbstractController = SoCuteGraph.elements.abstractController.Controller;

    var FrameDebugger = function(){
        this.init();
    };


    FrameDebugger.prototype = new AbstractController;


    FrameDebugger.prototype.init = function () {
        var that = this;
        this._timeHistory = [];

        this.addSubscription(FrameEvent, function(frameEvnt){
            that.frameHandler.call(that, frameEvnt);
        });


    }

    FrameDebugger.prototype.frameHandler = function(frameEvent){
        this._timeHistory.push(frameEvent.getFrameTime());
        var frameRate = this.getDispatcher().frameRate;
        if (this._timeHistory.length >= frameRate){

            var sum = this._timeHistory.reduce(function(previousValue, currentItem){
                return previousValue + currentItem;
            });

            var fps = sum/frameRate;

            //console.log(sum, fps);

            //this._callback(frameEvent);
            this._timeHistory = [];
        }
    }

    FrameDebugger.prototype.setDisplayCallback = function(callback){
        this._callback = callback;
    }

    return {
        'FrameDebugger':FrameDebugger
    }
})();

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

            var disp = new Dispatcher();
            disp.addObject(animate);
            animate.start();
            ok(true, "animation is ok");




        });
    }
);

