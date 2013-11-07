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




DragableElement=function(){

}

DragableElement.prototype.drag=function(onStartMove, onMoving, onStopMove){
};

Element=function(paper, position){

    this.position=position;

    // Creates circle at x = 50, y = 40, with radius 10
    this.text = paper.text(50, 50, "Raphaël");

    this.circle = paper.circle(0, 0, 10);

    this.moveTo(this.position);

    // Sets the fill attribute of the circle to red (#f00)
    this.circle.attr("fill", "#000");


    // Sets the stroke attribute of the circle to white
    this.circle.attr("stroke", "#fff");    

}

Element.prototype=new DragableElement;

Element.prototype.moveTo=function(position){
    pos=position.getPos();
    this.position.setPos(pos);
    this.circle.attr('cx',pos['x']);
    this.circle.attr('cy',pos['y']);

    this.text.attr('cx',pos['x']);
    this.text.attr('cy',pos['y']);


}

Element.prototype.drag=function(onStartMove, onMoving, onStopMove){
    var position,text;

    position=this.position;
    text=this.text;
    console.dir(text);

    this.circle.customOnMoving=onMoving;
    this.circle.drag(function(x,y){
        newX=this.startpos.x+x
        newY=this.startpos.y+y

        this.attr({'cx':newX});
        this.attr({'cy':newY}); 

        text.attr('x',newX);
        text.attr('y',newY);
        console.dir(text.attrs);
        position.setPos({'x':newX,'y':newY});
        this.customOnMoving();

    },
    function(x,y){
        //stateModel.setState(stateModel.states.moving);
        this.startpos={}
        this.startpos.x=this.attrs.cx;
        this.startpos.y=this.attrs.cy;
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
    console.log("M"+start['x']+' '+start['y']+' L '+end['x']+' '+end['y']);
    this.path.attr('path',"M"+start['x']+' '+start['y']+' L '+end['x']+' '+end['y']);
}