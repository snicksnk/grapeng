Dispathcer=function(){
	this._objects={};
	this._subscriptions={};
	this._uniqueIdCounter=1; 
} 


Dispathcer.prototype.addObject=function(obj){
	obj.setUniqueId=this.uniqueIdCounter;
	this._uniqueIdCounter++;
	subscribition=obj.subscribeForEvents();

	for (i=0; i<subscribition.length; i++){

		if (this._subscriptions[this.getEventUniqueId(subscribition[i])]==undefined){
			this._subscriptions[this.getEventUniqueId(subscribition[i])]=[];
		}

		this._subscriptions[this.getEventUniqueId(subscribition[i])].push(obj);
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

	for (key in subsList){
		console.log('notify'+evntName);
		console.dir(subsList[key]);	
		
		subsList[key]['handle'+evntName](Evnt);
	}			
}
