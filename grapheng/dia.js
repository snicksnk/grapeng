var redraw, g, renderer;

/* only do all this when document has finished loading (needed for RaphaelJS) */
window.onload = function() {
    
    // Creates canvas 320 × 200 at 10, 50
    var paper = Raphael(document.getElementById('canvas'), 400, 400);


};



function Position(cords){
    if(!cords){
        cords={'x':0,'y':0}
    }
    this._cords=cords;
};

Position.prototype._lastCords={};

Position.prototype._cords={};

Position.prototype.sub={}


Position.prototype.getNewPos=function(){
    if (this._cords!=this._lastCords){
        this._lastCords=this._cords; 
        return this._cords;
    } else {
        return false;
    }
}

Position.prototype.getPos=function(){
    return this._cords;
}

Position.prototype.setPos=function(cords){
    this._cords=cords;
};



StateModel=function(){
   
}


StateModel.prototype.states={};
StateModel.prototype.states.stay='stay';
StateModel.prototype.states.moving='moving';
StateModel.prototype.states.moved='moved';

//default state
StateModel.prototype._state=StateModel.prototype.states.stay;

StateModel.prototype.position=new Position();
StateModel.prototype.leftPosition=new Position();
StateModel.prototype.rightPosition=new Position();


//default state
StateModel.prototype._lastState=StateModel.prototype.states.stay;


StateModel.prototype.setState=function(state){
    this._state=state;
}

StateModel.prototype.getState=function(){
    return this._state;
}

StateModel.prototype.getNewState=function(){
    if (this._lastState==this._state){
        return false;
    } else {
        this._lastState=this._state;
        return this._state;
    }   

};


function JoinPoint(paper){

}

JoinPoint.prototype.position=null;
JoinPoint.prototype._point=null;

JoinPoint.prototype.movePosition=function(){
    alert('specify it!');
}

JoinPoint.prototype._initElement=function(paper){
    this._point=paper.rect(0,0,2,2,0);
    this.position=new Position();
}


function LeftJoinPoint(paper){
    this._initElement(paper);
}

LeftJoinPoint.prototype=new JoinPoint();

LeftJoinPoint.prototype.movePosition=function(parentNodePosition){
    var pos=parentNodePosition.getPos();
    var leftX=pos['x'];
    var leftY=pos['y']+10;

    this.position.setPos({'x':leftX,'y':leftY});     
    this._point.attr('x',leftX);
    this._point.attr('y',leftY);
    return this;
}

function RightJoinPoint(paper){
    this._initElement(paper);
}

RightJoinPoint.prototype=new JoinPoint();


RightJoinPoint.prototype.movePosition=function(parentNodePosition, nodeWidth){
    var pos=parentNodePosition.getPos();
    var rightX=pos['x']+nodeWidth-1;
    var rightY=pos['y']+10;
    this.position.setPos({'x':rightX,'y':rightY});
    this._point.attr('x',rightX);
    this._point.attr('y',rightY);
    return this;
}


function NodeText(text, paper){
    this.text=text;
    this.position=new Position();
    this._text = paper.text(50, 50, text);
}

NodeText.prototype.position=null;
NodeText.prototype._text=null;


NodeText.prototype.movePosition=function(parentNodePosition){
    pos=parentNodePosition.getPos();
    var textX=pos['x']+this._text.node.getBBox().width/2;
    var textY=pos['y']+10;
    this._text.attr('x',textX);
    this._text.attr('y',textY);
    this.position.setPos({'x':textX,'y':textY})
    return this;
}

NodeText.prototype.getWidth=function(){
    width=this._text.node.getBBox().width;
    return width;
}

NodeText.prototype.getHeight=function(){

}


DragableElement=function(){

}



DragableElement.prototype.drag=function(onStartMove, onMoving, onStopMove){
};



Element=function(paper, position){

    this.position=position;


    this.position.sub.leftPoint=new Position;
    this.position.sub.rightPoint=new Position;
    this.position.sub.text=new Position;

    text='anysadasadsadadsadasdasdadaadada'
  

    this.nodeText=new NodeText(text, paper);
    

    this.framer = paper.rect(0, 0, 20, 20, 0);//circle(0, 0, 10);
    this.resizeFramerToText();

    this.leftJoinPoint=new LeftJoinPoint(paper);
    this.rightJoinPoint=new RightJoinPoint(paper);

  
    this.moveTo(this.position);


    // Sets the fill attribute of the circle to red (#f00)
    this.framer.attr("fill", "#000");
    this.framer.attr("fill-opacity",0);


    // Sets the stroke attribute of the circle to white
    this.framer.attr("stroke", "#000");    

}

Element.prototype=new DragableElement;
    
Element.prototype.resizeFramerToText=function(){
    width=this.nodeText.getWidth();
    this.framer.attr('width',width);    
}

Element.prototype.getWidth=function(){
    return this.framer.attr('width');
}

Element.prototype.moveTo=function(position){
    var leftJoinPointPosition, pos, nodeTextPos, rightJoinPoint;
    pos=position.getPos();
    this.position.setPos(pos);
    this.framer.attr('x',pos['x']);
    this.framer.attr('y',pos['y']);
    

    nodeTextPos=this.nodeText.movePosition(this.position).position
    this.position.sub.text.setPos(nodeTextPos.getPos());


    leftJoinPointPosition=this.leftJoinPoint.movePosition(position).position;

    this.position.sub.leftPoint.setPos(leftJoinPointPosition.getPos());
    
    this.rightJoinPoint.movePosition(position,this.framer.attr('width'));
    this.position.sub.rightPoint.setPos(this.rightJoinPoint.position.getPos());


}


Element.prototype.drag=function(onStartMove, onMoving, onStopMove){
    var position,
    nodeText,
    leftJoinPoint,
    leftJoinPointPosition,
    nodeTextPos,
    rightJoinPoint,
    rightJoinPointPosition;
    
    position=this.position;
    

    leftJoinPoint=this.leftJoinPoint;
    rightJoinPoint=this.rightJoinPoint;

    nodeText=this.nodeText;




    this.framer.customOnMoving=onMoving;
    this.framer.drag(function(x,y){
        newX=this.startpos.x+x
        newY=this.startpos.y+y


        this.attr('x',newX);
        this.attr('y',newY);
        

        nodeTextPos=nodeText.movePosition(position).position
        position.sub.text.setPos(nodeTextPos.getPos());


        leftJoinPointPosition=leftJoinPoint.movePosition(position).position;
        position.sub.leftPoint.setPos(leftJoinPointPosition.getPos());
        
        rightJoinPoint.movePosition(position,this.attr('width'));
        position.sub.rightPoint.setPos(rightJoinPoint.position.getPos());
    

        position.setPos({'x':newX,'y':newY});
        this.customOnMoving();

    },
    function(x,y){
        //stateModel.setState(stateModel.states.moving);
        this.startpos={}
        this.startpos.x=this.attrs.x;
        this.startpos.y=this.attrs.y;
        onStartMove();
    },
    function(x,y){
        //stateModel.setState(stateModel.states.stay);
        onStopMove();
    });

};


JoinLine=function(paper){
    
    this.startPos=new Position();
    this.endPos=new Position();



    this.path=paper.path("0");

    //this.moveStartPoint(new Position({'x':230,'y':'150'}))
    //this.path.attr("path",["M150 12", "L15 200","L12 200 Z"]);
}




JoinLine.prototype=new DragableElement;


JoinLine.prototype.moveStartPoint=function(position){
    this.startPos.setPos(position.getPos());
    this._redrawLine();
}

JoinLine.prototype.moveEndPoint=function(position){
   this.endPos.setPos(position.getPos());
   this._redrawLine();
}

JoinLine.prototype._redrawLine=function(){
    start=this.startPos.getPos();
    end=this.endPos.getPos();
    this.path.attr('path',"M"+start['x']+' '+start['y']+' L '+end['x']+' '+end['y']);
}