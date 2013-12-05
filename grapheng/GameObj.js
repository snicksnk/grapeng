var Position=SoCuteGraph.helpers.coordinates.Position;
var Element = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
var JoinLine = SoCuteGraph.elements.joinLine.ViewModel;
var ObjController = SoCuteGraph.elements.abstractController.Controller;

function Player(){
	this.x = 0;
	this.y = 0;
	this.addSubscribition(new JumpEvent, function(){
		this.state = 'jump';
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
