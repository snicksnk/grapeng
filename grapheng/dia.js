/*
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
*/




