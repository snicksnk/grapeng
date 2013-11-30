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






function Line(paper){
	this._element=new JoinLine(paper);
	this._subscribeForEvents=[FrameEvent];

    this._initStartNode=false;
    this._initEndNode=false

}


Line.prototype=new ObjController();

Line.prototype.setUpModels=function(paper){

}

Line.prototype.setUpBehavior=function(){
	
}

Line.prototype.setLineStartNode=function(Node){
    this._initStartNode=Node;
    //TODO ¬озможно стоит передавать ноду туда целиком?
    this._element.setStartNodeOrientation(Node.getOrientation())
    this._tryToinitLine();
}


Line.prototype.setLineEndNode=function(Node){
    this._initEndNode=Node;
    this._element.setEndNodeOrientation(Node.getOrientation());
    this._tryToinitLine();
}

Line.prototype._tryToinitLine=function(){
    var startNode = this._initStartNode;
    var endNode=this._initEndNode;
    if (startNode && endNode){
;
        this._element.moveStartPoint(startNode.getPosition(), startNode.getOrientation());
        this.addSubscribition(new MoveEvent(startNode),
            this._lineStartDepends);
        this._element.moveEndPoint(endNode.getPosition(), endNode.getOrientation());
        this.addSubscribition(new MoveEvent(endNode),
            this._lineEndDepends);

    }
}




Line.prototype._lineStartDepends=function(Evnt){
	this._element.moveStartPoint(Evnt.position, Evnt.getOrientation());
}

Line.prototype._lineEndDepends=function(Evnt){
	this._element.moveEndPoint(Evnt.position, Evnt.getOrientation());
}




Line.prototype.subscribeForEvents=function(){
	return this._subscribeForEvents;
};

