SoCuteGraph.nsCrete('events.std');

SoCuteGraph.events.std=function(){
    var Position=SoCuteGraph.helpers.coordinates.Position;

    var Position=SoCuteGraph.helpers.coordinates.Position;


    function SCEvent(){

    }

    SCEvent.prototype.getUniqueName=function(){
        return '_empty';
    }

    function JumpEvent(){
    };

    JumpEvent.prototype=new SCEvent()

    JumpEvent.prototype.getUniqueName=function(){
        return 'jump';
    }


    function FrameEvent(time, frameRate){
        this.setTime(time);
        this.setFrameRate(frameRate);
    };
    FrameEvent.prototype=new SCEvent();

    FrameEvent.prototype.getTime = function(){
        return this.time;
    }

    FrameEvent.prototype.setTime = function(time){
        this.time = time;
    }

    FrameEvent.prototype.getFrameRate = function(){
        return this.frameRate;
    }

    FrameEvent.prototype.setFrameRate = function(frameRate){
        this.frameRate = frameRate;
    }


    FrameEvent.prototype.getUniqueName=function(){
        return 'frame';
    }

    function MoveEvent(masterObject, position){
        this._position=position;

        //TODO Temp hack
        this.position=new Position();

        this.masterObjectId=masterObject.getUniqueId();
        this._orientation=false;

    }


    MoveEvent.prototype=new SCEvent();


    MoveEvent.prototype._resolveStrategy=null;


    /**
     *
     * @returns {*}
     */
    MoveEvent.prototype.getPosition=function(){

        return this.position;
    }

    MoveEvent.prototype.setPosition=function(position){
        //TODO Temp hack
        this.position=position;
    }

    MoveEvent.prototype.setOrientation=function(orientation) {
        this._orientation=orientation;
    }

    MoveEvent.prototype.getOrientation=function() {
        return this._orientation;
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

    return {
        'SCEvent':SCEvent,
        'MoveEvent':MoveEvent,
        'FrameEvent':FrameEvent
    }



}();