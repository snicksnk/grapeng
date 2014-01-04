SoCuteGraph.nsCrete("helpers.coordinates");

SoCuteGraph.helpers.coordinates = (function () {
    "use strict";
    var Position = function (cords) {
        if (!cords) {
            cords = {'x': 0, 'y': 0};
        }
        this._cords = cords;
        this._lastCords = cords;
        this.sub = {};
    };

    Position.prototype._lastGettedCords = {};

    Position.prototype._cords = {};

    Position.prototype._lastCords = {};

    Position.prototype.sub = {};

    Position.prototype.orientation = false;

    Position.prototype.getNewPos=function(){
        var resultCoordinates=false;
        if (this._cords != this._lastGettedCords){
            this._lastGettedCords = this._cords;
            resultCoordinates = this._cords;
        }
        return resultCoordinates;
    }

    Position.prototype.getPositionDiff=function(){
        var diffCoordinates={};
        /*
        if (this._cords===this._lastCords){
            return false;
        }
        */



        for (var dimension in this._cords){
            diffCoordinates[dimension]=this._cords[dimension]-this._lastCords[dimension];
        }

        this._lastGettedCords = this._cords;
        //this._lastCords=this._cords;
        return diffCoordinates;
    }

    Position.prototype.setDiff=function(diff){
        var newCords={};
        for (var dimension in diff){
            newCords[dimension]=this._cords[dimension]+diff[dimension];
        }
        this.setPos(newCords);
    }

    Position.prototype.getPosition=function(){
        return this._cords;
    }

    Position.prototype.setPos=function(cords){
        this._lastCords=this._cords;
        this._cords=cords;
    };

    return {
        'Position':Position
    }

})();

SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.events.dispatchers',
    function(){

        test("MoveEvent sub positions",function(){

            var Position=SoCuteGraph.helpers.coordinates.Position;
            var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
            var Line = SoCuteGraph.elements.joinLine.Controller;



            var paper = Raphael(document.getElementById('testCanvas'), 600, 600);

            console.log(Position);
            var node = new Node('test node', paper, new Position({'x':10,'y':220}));
            var MoveEvent = SoCuteGraph.events.std.MoveEvent;
            var SCEvent = SoCuteGraph.events.std.SCEvent;
            var moveEvent=new MoveEvent(node, node.getPosition());


            testPostion=new Position({'x':12,'y':22});
            moveEvent.setSubPosition('tested_position', testPostion);

            deepEqual(moveEvent.getSubPosition('tested_position'),
                testPostion, 'seted subpostion equals to getted'
            );
        });
    }
)