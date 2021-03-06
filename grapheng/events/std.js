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


    function FrameEvent(time, frameRate, frameTime){
        this.init(time, frameRate, frameTime);
    };


    FrameEvent.prototype=new SCEvent();

    FrameEvent.prototype.setFrameTime = function(frameTime){
        this._frameTime = frameTime;
    }

    FrameEvent.prototype.getFrameTime = function(){
        return this._frameTime;
    }

    FrameEvent.prototype.getTime = function(){
        return this._time;
    }

    FrameEvent.prototype.setTime = function(time){
        this._time = time;
    }

    FrameEvent.prototype.getFrameRate = function(){
        return this._frameRate;
    }

    FrameEvent.prototype.setFrameRate = function(frameRate){
        this._frameRate = frameRate;
    }


    FrameEvent.prototype.getUniqueName=function(){
        return 'frame';
    }


    FrameEvent.prototype.init = function (time, frameRate, frameTime) {
        this.setTime(time);
        this.setFrameRate(frameRate);
        this.setFrameTime(frameTime);
    }

    function MoveEvent(masterObject, position){
        this.init(masterObject, position);
    }


    MoveEvent.prototype=new SCEvent();

    MoveEvent.prototype.init = function (masterObject, position) {

        this._position=position;
        //TODO Temp hack
        this.position=new Position();
        this.masterObjectId=masterObject.getUniqueId();
        this._orientation=false;
        this._diff = false;

    }


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

    MoveEvent.prototype.getDiff = function (){
        return this._diff;
    }

    MoveEvent.prototype.setDiff = function (diff){
        this._diff = diff;
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