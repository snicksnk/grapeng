function Event(){

}

JumpEvent.prototype.getUniqueName=function(){
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

