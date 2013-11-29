var Position=SoCuteGraph.helpers.coordinates.Position;
var Element = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
var JoinLine = SoCuteGraph.elements.joinLine.ViewModel;
var ObjController = SoCuteGraph.elements.abstractController.Controller;

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

