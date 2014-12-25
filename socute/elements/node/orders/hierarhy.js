"use strict";
define (["socute/oLib", "socute/coordinates/position",], function(oLib, Position){
    
    var build = function  (parent, childrens) {
        var parentPosition = parent.getPosition();

        var parentWidth = parent.getWidth();
        var offset = {'x':30 + parentWidth, 'y':0};

        var childrensOffset = {'x':0, 'y': 20};


        var childensOffset = new Position(parentPosition.getPosition());
        
        console.log('----222', childensOffset);
       
        childensOffset.setDiff(offset);
        console.log('----222', childensOffset.getPosition());
       
        var currentChildrenOffset = new Position(childensOffset.getPosition());
        oLib.each(childrens, function(index, child){
            child.moveTo(currentChildrenOffset);
            var currentNodeHeight = child.getHeight();
            var currentHeightOffset = {'x': 0, 'y':currentNodeHeight};
            currentChildrenOffset.setDiff(childrensOffset, currentHeightOffset);
        });
    }


    return {
        'build':build
    };

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