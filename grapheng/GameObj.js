function ObjController(){
	
}

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

ObjController.prototype.getPos=function(){
	return this._element.position;
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
	//Сделать возможность
	handlerName='handle'+ Dispathcer.getEventUniqueId(Evnt);
	this[handlerName]=Handler;
}


function Player(){
	this.x=0;
	this.y=0;
	this.addSubscribition(new JumpEvent, function(){
		this.state='jump';
	});
}


Player.prototype=new ObjController()


Player.prototype.subscribeForEvents=function(){
	//return [JumpEvent]
	return this._subscribeForEvents;
}

Player.prototype.x=0;
Player.prototype.y=0;
Player.prototype.state='stay';




function Node(paper){
	this.setUpModels(paper);
}

Node.prototype=new ObjController();


Node.prototype.setUpModels=function(paper){
	this._dispatcher=null;
	//alert(moveEvent.getUniqueName());
	this._stateModel=new StateModel();

	position=new Position({'x':10,'y':20});

	this._element=new Element(paper, position);


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
		},
		function(){
			stateModel.setState(stateModel.states.moving);
			stateModel.position.setPos(element.position.getPos());
			
		},
		function(){
			stateModel.setState(stateModel.states.stay);
			console.dir(stateModel.position.getPos());
			moveEvent.position.setPos(stateModel.position.getPos());
	    	dispatcher.notify(moveEvent);
			
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



	console.dir(Node.getPos());
	this._element.moveStartPoint(Node.getPos());

	this.addSubscribition(new MoveEvent(Node),
	this._lineStartDepends);
}


Line.prototype.setLineEndNode=function(Node){

	this._element.moveEndPoint(Node.getPos());

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

