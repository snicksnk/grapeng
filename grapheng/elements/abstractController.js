SoCuteGraph.nsCrete('elements.abstractController');

SoCuteGraph.elements.abstractController=(function () {
    "use strict";
    var Dispathcer = SoCuteGraph.events.dispatchers.Dispatcher;

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


    return ObjController;
})();