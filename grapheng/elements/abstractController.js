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


    /**
     * TODO Rename to getPosition
     */
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

    ObjController.prototype.addSubscribition=function(Evnt, Handler){
        var handlerName;
        this._subscribeForEvents.push(Evnt);
        handlerName='handle'+ Dispathcer.getEventUniqueId(Evnt);
        this[handlerName]=Handler;
    }

    return {
      'Controller': ObjController
    };

})();