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
   this.position=position;
   this.masterObjectId=masterObject.getUniqueId();
   this.oriented=false;
}

MoveEvent.prototype=new Event();


MoveEvent.prototype.getUniqueName=function(){
   return 'move_object_'+this.masterObjectId;
}






