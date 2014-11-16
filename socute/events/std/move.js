"use strict";
define(["socute/events/std/abstract", 
    "socute/coordinates/position"], function(AbstractEvent, Position){

    function MoveEvent(masterObject, position){
        this.init(masterObject, position);
    }

    MoveEvent.prototype=new AbstractEvent();

    MoveEvent.prototype.init = function (masterObject, position) {

        this._position=position;
        //TODO Temp hack
        this.position=new Position();
        this.masterObjectId=masterObject.getUniqueId();
        this._orientation=false;
        this._diff = false;

    }


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

    MoveEvent.prototype.getDiff = function (){
        return this._diff;
    }

    MoveEvent.prototype.setDiff = function (diff){
        this._diff = diff;
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

    return MoveEvent;
});