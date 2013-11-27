var Position=SoCuteGraph.helpers.coordinates.Position;


function Event(){

}

Event.prototype.getUniqueName=function(){
	return '_empty';
}

function JumpEvent(){
};

JumpEvent.prototype=new Event()

JumpEvent.prototype.getUniqueName=function(){
	return 'jump';
}


function FrameEvent(){

};


FrameEvent.prototype=new Event();

FrameEvent.prototype.getUniqueName=function(){
   return 'frame';
}

function MoveEvent(masterObject, position){
   this._position=position;
   this.masterObjectId=masterObject.getUniqueId();
   this.oriented=false;
}


MoveEvent.prototype=new Event();


MoveEvent.prototype._resolveStrategy=null;


/**
 *
 * @returns {*}
 */
MoveEvent.prototype.getPosition=function(){
      return this._position;
}

MoveEvent.prototype.getSubPosition=function(subPosition){
   if (
      typeof this._position['sub']==='undefined' || 
      typeof this._position.sub[subPosition]==='undefined'){
      throw 'sub position with name "'+subPosition+'" is undefined';
   }
   return this._position.sub[subPosition];
}

MoveEvent.prototype.setSubPosition=function(name, position){
   if (typeof this._position['sub']==='undefined'){
      this._position.sub={};
   }
   this._position.sub[name]=position;
}




MoveEvent.prototype.getUniqueName=function(){
   return 'move_object_'+this.masterObjectId;
}
/*
function MoveNodeEvent(masterObject, position){
   MoveEvent.call(this, masterObject, position);   

}

MoveNodeEvent.prototype=new MoveEvent();
*/