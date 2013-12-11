SoCuteGraph.nsCrete("events.dispatchers");

SoCuteGraph.events.dispatchers = (function () {
    Dispathcer=function(){
        this._objects={};
        this._subscriptions={};
        this._uniqueIdCounter=1;
        this._lastEvent=null;
        this._onEventEvents={};
    }


    Dispathcer.prototype.addObject=function(obj){
        obj.setUniqueId(this._uniqueIdCounter);
        this._uniqueIdCounter++;
        subscribition=obj.subscribeForEvents();

        obj.setDispatcher(this);
        obj.setUpBehavior();

        for (i=0; i<subscribition.length; i++){

            evntName=Dispathcer.getEventUniqueId(subscribition[i]);

            if (this._subscriptions[evntName]==undefined){
                this._subscriptions[evntName]=[];
            }

            this._subscriptions[evntName].push(obj);
        }
    }

    Dispathcer.getEventUniqueId=function(Evnt){

        if (Evnt.getUniqueName !== undefined){

            return Evnt.getUniqueName();
        } else {

            return Evnt.prototype.getUniqueName();
        }


    }

    Dispathcer.prototype.notify=function(Evnt){
        var evntName, subsList, onEvents;
        evntName=Dispathcer.getEventUniqueId(Evnt);
        subsList = this._subscriptions[evntName] || [];

        this._lastEvent=Evnt;

        if (typeof this._onEventEvents['evntName']!==undefined){
            onEvents=this._onEventEvents;

        }


        for (key in subsList){
            subsList[key]['handle'+evntName](Evnt);
        }



    }



    Dispathcer.prototype.notifyOn=function(Evnt, onEvent){
        var evntName;
        evntName=Dispathcer.getEventUniqueId(onEvent);
        onEventName=Dispathcer.getEventUniqueId(onEvent);

        if (this._onEventEvents[onEventName]===undefined){
            this._onEventEvents[onEventName]=[];
        }

        this._onEventEvents[onEventName].push(Evnt);

    }

    return {
      'Dispatcher':Dispathcer
    };
}());