Dispathcer=function(){
	this._objects={};
	this._subscriptions={};
	this._uniqueIdCounter=1; 
	this._lastEvent=null;
} 


Dispathcer.prototype.addObject=function(obj){
	obj.setUniqueId(this._uniqueIdCounter);
	this._uniqueIdCounter++;
	subscribition=obj.subscribeForEvents();

	obj.setDispatcher(this);
	obj.setUpBehavior();

	for (i=0; i<subscribition.length; i++){

		evntName=this.getEventUniqueId(subscribition[i]);

		if (this._subscriptions[evntName]==undefined){
			this._subscriptions[evntName]=[];
		}

		this._subscriptions[evntName].push(obj);
	}			
}

Dispathcer.prototype.getEventUniqueId=function(Evnt){
	
	if (Evnt.getUniqueName !== undefined){

		return Evnt.getUniqueName();
	} else {
		
		return Evnt.prototype.getUniqueName();
	}

	
}

Dispathcer.prototype.notify=function(Evnt){

	evntName=this.getEventUniqueId(Evnt);
	subsList = this._subscriptions[evntName] || [];

	this._lastEvent=Evnt;
	console.dir(this._subscriptions);
	for (key in subsList){
		subsList[key]['handle'+evntName](Evnt);
	}			
}
