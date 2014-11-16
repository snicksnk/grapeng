"use strict";
define (function(){
    
    var MoveSlave = function(dispathcer, master, slave){
        if (dispathcer){
            this.init(dispathcer);
        }

        this.moverFunction = MoveSlave.defaultMover;

        if (master && slave) {
            this.setMaster(master);
            this.setSlave(slave);
            this.apply();
        }
    }

    MoveSlave.prototype.init=function(dispathcer){
        this._dispatcher = dispathcer;
    }

    MoveSlave.prototype.setMaster = function(master){
        this._master = master;
    }

    MoveSlave.prototype.setSlave = function(slave){
        this._slave = slave;
    }

    MoveSlave.prototype.apply=function(){
        //var Position = SoCuteGraph.helpers.coordinates.Position;

        //var MoveEvent = SoCuteGraph.events.std.MoveEvent;

        //this._slave.MoveSlaveData=[];
        //this._slave.MoveSlaveData.oldMasterPosition = new Position(this._master.getPosition().getPosition());
        var positionOfMaster;
        /*Jaspecto(this._master).after('drag').advice('MoveDependedGetStartPosition', function(){
            positionOfMaster = this.getPosition().getPosition();
            console.log(positionOfMaster);
        });*/


        this._slave.setDependsOf(this._master);

        this._master.setIsSlaveAffects(true);

    }

    MoveSlave.prototype.cansel = function(){
        //TODO Fix hack
        var MoveEvent = SoCuteGraph.events.std.MoveEvent;
        this._slave.addSubscription(new MoveEvent(this._master),
            function(Evnt){

            });
    }


    return MoveSlave;

});