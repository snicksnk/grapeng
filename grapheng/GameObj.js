function ObjController(){
	
}

ObjController.prototype.setUpModels=function(paper){
	
}

ObjController.prototype.getObjType=function(){
	return '_empty'
}

ObjController.prototype.subscribeForEvents=function(){
	return {};
}

ObjController.prototype.setUniqueId=function(id){
	this.uniqueId=id;
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


ObjController.prototype.setUpBehavior=function(){

}

ObjController.prototype.addSubscribition=function(Evnt, Handler){
	var handlerName;
	this._subscribeForEvents.push(Evnt);
	handlerName='handle'+ Evnt.getUniqueName();
	this[handlerName]=Handler;
}


function Player(){
	this.x=0;
	this.y=0;
}


Player.prototype=new ObjController()


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
	this.setUpModels(paper);
}

Node.prototype=new ObjController();


Node.prototype.setUpModels=function(paper){
	this._dispatcher=null;
	//alert(moveEvent.getUniqueName());
	this._stateModel=new StateModel();
	this._element=new Element(paper);
	this._subscribeForEvents=[FrameEvent];
}

Node.prototype.setDependsOf=function(dependedOf){
		var handlerName;

		this.addSubscribition(new MoveEvent(dependedOf),
		function(Evnt){
			this._element.moveTo(Evnt.position)
			console.log('parent is moved');
		});
}


Node.prototype.setUpBehavior=function(){

	var element, moveEvent, stateModel;

	element = this._element;
	stateModel = this._stateModel;



	this._moveEvent=new MoveEvent(this,stateModel.position);
	moveEvent = this._moveEvent;

	dispatcher = this.getDispatcher();
	




	this._element.drag(
		function(){
			stateModel.setState(stateModel.states.moved);
	    	stateModel.position.setPos(element.position.getPos());
			console.log(moveEvent.getUniqueName(), ' ----');;
	    	dispatcher.notify(moveEvent);
		},
		function(){
			stateModel.setState(stateModel.states.moving);
		},
		function(){
			stateModel.setState(stateModel.states.stay);
		}
	);
};

Node.prototype.subscribeForEvents=function(){
	return this._subscribeForEvents;
};

Node.prototype.handleframe=function(){
	if (newState=this._stateModel.getNewState()){
	}
};


function Line(paper){
	this._element=new JoinLine(paper);
	this._subscribeForEvents=[FrameEvent];
}


Line.prototype=new ObjController();

Line.prototype.setUpModels=function(paper){

}

Line.prototype.setUpBehavior=function(){
	
}

Line.prototype.setLineStartNode=function(Node){
	this.addSubscribition(new MoveEvent(Node),
	this._lineStartDepends);
}


Line.prototype.setLineEndNode=function(Node){
	this.addSubscribition(new MoveEvent(Node),
	this._lineEndDepends)
}

Line.prototype._lineStartDepends=function(Evnt){
	this._element.moveStartPoint(Evnt.position);
}

Line.prototype._lineEndDepends=function(Evnt){
	this._element.moveEndPoint(Evnt.position);
}




Line.prototype.subscribeForEvents=function(){
	return this._subscribeForEvents;
};

