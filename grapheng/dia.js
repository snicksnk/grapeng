var redraw, g, renderer;

/* only do all this when document has finished loading (needed for RaphaelJS) */
window.onload = function() {
    
    // Creates canvas 320 × 200 at 10, 50
    var paper = Raphael(document.getElementById('canvas'), 400, 400);


};


StateModel=function(){
   
}


StateModel.prototype.states={};
StateModel.prototype.states.stay='stay';
StateModel.prototype.states.moving='moving';
StateModel.prototype.states.moved='moved';

//default state
StateModel.prototype._state=StateModel.prototype.states.stay;

StateModel.prototype.position={};
StateModel.prototype.position.x=0;
StateModel.prototype.position.y=0;

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

Element=function(paper,stateModel){

    this.stateModel=stateModel;
    // Creates circle at x = 50, y = 40, with radius 10
    var circle = paper.circle(50, 40, 10);
    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#f00");

    circle.drag(function(x,y){

            stateModel.setState(stateModel.states.moved);

            newX=this.startpos.x+x
            newY=this.startpos.y+y

            this.attr({'cx':newX});
            this.attr({'cy':newY}); 

            stateModel.position.x=newX;
            stateModel.position.y=newY;

        },
        function(x,y){
            stateModel.setState(stateModel.states.moving);
            this.startpos={}
            this.startpos.x=this.attrs.cx;
            this.startpos.y=this.attrs.cy;
        },
        function(x,y){
            stateModel.setState(stateModel.states.stay);
        });
    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#fff");    

}

