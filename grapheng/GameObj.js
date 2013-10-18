function gameObj(){
}

gameObj.prototype.getObjType=function(){
	return '_empty'
}

gameObj.prototype.subscribeForEvents=function(){
	return {};
}

gameObj.prototype.setUniqueId=function(id){
	this.prototype.uniqueId=id;
}

gameObj.prototype.getUniqueId=function(){
	return this.uniqueId;
}


function Player(){
	this.x=0;
	this.y=0;
}


Player.prototype=new gameObj()


Player.prototype.subscribeForEvents=function(){
	return [JumpEvent]
}

Player.prototype.x=0;
Player.prototype.y=0;
Player.prototype.state='stay';
Player.prototype.handlejump=function(){
	this.state='jump';
}


function Node(paper){
	this.stateModel=new StateModel();
	this.element=new Element(paper,this.stateModel);
}

Node.prototype=new gameObj();

Node.prototype.subscribeForEvents=function(){
	return [FrameEvent];
};

Node.prototype.handleframe=function(){
	if (newState=this.stateModel.getNewState()){
		console.log('new state', newState);
	}
};

