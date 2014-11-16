"use stric"
define(["socute/events/std/abstract"], function(AbstractEvent){
	
	function FrameEvent(time, frameRate, frameTime){
        this.init(time, frameRate, frameTime);
    };


    FrameEvent.prototype=new AbstractEvent();

    FrameEvent.prototype.setFrameTime = function(frameTime){
        this._frameTime = frameTime;
    }

    FrameEvent.prototype.getFrameTime = function(){
        return this._frameTime;
    }

    FrameEvent.prototype.getTime = function(){
        return this._time;
    }

    FrameEvent.prototype.setTime = function(time){
        this._time = time;
    }

    FrameEvent.prototype.getFrameRate = function(){
        return this._frameRate;
    }

    FrameEvent.prototype.setFrameRate = function(frameRate){
        this._frameRate = frameRate;
    }


    FrameEvent.prototype.getUniqueName=function(){
        return 'frame';
    }


    FrameEvent.prototype.init = function (time, frameRate, frameTime) {
        this.setTime(time);
        this.setFrameRate(frameRate);
        this.setFrameTime(frameTime);
    }

    return FrameEvent;
});