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

    Position.prototype.getDiffWith=function(otherPosition){
        var diffCoordinates={}, otherCoords = otherPosition.getPosition();

        for (var dimension in this._cords){
            diffCoordinates[dimension]=otherCoords[dimension] - this._cords[dimension];
        }

        return diffCoordinates;
    }


    Position.getDiffAmount = function(diffCoords){
        var diffAmount = 0;
        for (var dimension in diffCoords){
            diffAmount+=diffCoords[dimension];
        }

        return diffAmount;
    }

    Position.getCenterPoint = function(position1, position2){
        var diffCords = position1.getDiffWith(position2);
        var centerPosition = new Position();
        var centerCords = {};

        for (var dimension in position1.getPosition()){
            if (position1.getPosition()[dimension]<position2.getPosition()[dimension]){
                centerCords[dimension] = position1.getPosition()[dimension] + diffCords[dimension]/2;
            } else {
                centerCords[dimension] = position2.getPosition()[dimension] + diffCords[dimension]/2;
            }
        }
        centerPosition.setPos(centerCords);
        console.log('1:',position1.getPosition(), '2:', position2.getPosition(), 'center:', centerPosition.getPosition());
        return centerPosition;
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

SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.helpers.coordinates',
    function(){
        var Position=SoCuteGraph.helpers.coordinates.Position;

        test("Get diff with other position", function(){
            var pos1=new Position({'x':3,'y':4});
            var pos2=new Position({'x':5,'y':17});

            deepEqual(pos1.getDiffWith(pos2), {'x':2,'y':13}, 'pos1 + posResult = pos2');

            pos1=new Position({'x':13,'y':24});
            pos2=new Position({'x':5,'y':17});

            deepEqual(pos1.getDiffWith(pos2), {'x':-8,'y':-7}, 'pos1 + posResult = pos2');

            pos1=new Position({'x':13,'y':24});
            pos2=new Position({'x':13,'y':24});

            deepEqual(pos1.getDiffWith(pos2), {'x':0,'y':0}, 'pos1 + posResult = pos2');



        });


        test("Get diff amount", function(){

            var Position=SoCuteGraph.helpers.coordinates.Position;

            var diff={'x':2,'y':3};
            equal(Position.getDiffAmount(diff), 5, 'Diff amount is ok')

            diff={'x':0, 'y':0};
            equal(Position.getDiffAmount(diff), 0, 'Diff amount is ok')

        });

        test("MoveEvent sub positions",function(){

            var Position=SoCuteGraph.helpers.coordinates.Position;
            var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
            var Line = SoCuteGraph.elements.joinLine.Controller;
            var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;


            var paper = Raphael(document.getElementById('testCanvas'), 600, 600);

            var scene = new Scene(paper);

            var node = new Node('test node', scene, new Position({'x':10,'y':220}));
            var MoveEvent = SoCuteGraph.events.std.MoveEvent;
            var SCEvent = SoCuteGraph.events.std.SCEvent;
            var moveEvent=new MoveEvent(node, node.getPosition());


            testPostion=new Position({'x':12,'y':22});
            moveEvent.setSubPosition('tested_position', testPostion);

            deepEqual(moveEvent.getSubPosition('tested_position'),
                testPostion, 'seted subpostion equals to getted'
            );
        })

        test("get center point", function(){
            var Position=SoCuteGraph.helpers.coordinates.Position;
            var position1 = new Position({'x':-5,'y':10});
            var position2 = new Position({'x':10, 'y':20});
            var centerPositon = Position.getCenterPoint(position1, position2);

            deepEqual(centerPositon.getPosition(), {'x':2.5, 'y':15}, 'Center position is good');


        });
    }
)