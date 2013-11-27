var Position=SoCuteGraph.helpers.coordinates.Position;

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


/**
* TODO Rename to getPosition
*/
ObjController.prototype.getPosition=function(){
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




function Node(text, paper,position){
	this.setUpModels(text, paper, position);
}


Node.prototype=new ObjController();


Node.prototype._element=null;

Node.prototype.setUpModels=function(text, paper,position){
	var paper, position;

	if (position===undefined){
		position=new Position({'x':10,'y':20});
	} else {

	}



	this._dispatcher=null;
	//alert(moveEvent.getUniqueName());
	//this._stateModel=new StateModel();




	this._element=new Element(text, paper, position);


	this._subscribeForEvents=[FrameEvent];

	
}

Node.prototype.setDependsOf=function(dependedOf){
		var handlerName;

		this.addSubscribition(new MoveEvent(dependedOf),
		function(Evnt){
			this._element.moveTo(Evnt.position);
		});
}

Node.prototype.setOrientation=function(orientation){
	this._element.setOrientation(orientation);
	
}

Node.prototype.getOrientation=function(){
	return this._element.getOrientation();
}

Node.prototype.setUpBehavior=function(){

	var element, moveEvent;

	element = this._element;


	this._moveEvent=new MoveEvent(this,element.position);
	moveEvent = this._moveEvent;

	dispatcher = this.getDispatcher();
	




	this._element.drag(
		function(x,y){
			/*
			stateModel.setState(stateModel.states.moved);
	    	stateModel.position=element.position;
			*/
		},
		function(x,y){
			element.moveTo(new Position({"x":x,"y":y}));

			moveEvent.position=element.position;
	    	dispatcher.notify(moveEvent);

		},
		function(x,y){
		
			moveEvent.position=element.position;
	    	dispatcher.notify(moveEvent);
		}
	);
};

Node.prototype.subscribeForEvents=function(){
	return this._subscribeForEvents;
};

Node.prototype.handleframe=function(){
	/*
	if (newState=this._stateModel.getNewState()){
	}
	*/
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
	this._element.moveStartPoint(Node.getPosition().sub.outPoint);

	this.addSubscribition(new MoveEvent(Node),
	this._lineStartDepends);
}


Line.prototype.setLineEndNode=function(Node){
	this._element.moveEndPoint(Node.getPosition().sub.inPoint);
	this.addSubscribition(new MoveEvent(Node),
	this._lineEndDepends)
}

Line.prototype._lineStartDepends=function(Evnt){
	this._element.moveStartPoint(Evnt.position.sub.outPoint);
}

Line.prototype._lineEndDepends=function(Evnt){
	console.log('*-*-*-*-*-*-*-*-*-*-', Evnt.position.sub);
	this._element.moveEndPoint(Evnt.position.sub.inPoint);
}




Line.prototype.subscribeForEvents=function(){
	return this._subscribeForEvents;
};

