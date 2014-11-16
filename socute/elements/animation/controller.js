"use strict";
define([
    "socute/elements/abstract/controller",
    "socute/events/std/frame"], 
    function(AbstractController, FrameEvent) {

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

    return  Animation;
});