define(['socute/coordinates/position'], function(Position){


    test("Get diff with other position", function(){
        var pos1 = new Position({'x':3,'y':4});
        var pos2 = new Position({'x':5,'y':17});

        deepEqual(pos1.getDiffWith(pos2), {'x':2,'y':13}, 'pos1 + posResult = pos2');

        pos1 = new Position({'x':13,'y':24});
        pos2 = new Position({'x':5,'y':17});

        deepEqual(pos1.getDiffWith(pos2), {'x':-8,'y':-7}, 'pos1 + posResult = pos2');

        pos1 = new Position({'x':13,'y':24});
        pos2 = new Position({'x':13,'y':24});

        deepEqual(pos1.getDiffWith(pos2), {'x':0,'y':0}, 'pos1 + posResult = pos2');
    });


    test("Get diff amount", function(){


        var diff = {'x':2,'y':3};
        equal(Position.getDiffAmount(diff), 5, 'Diff amount is ok')

        diff = {'x':0, 'y':0};
        equal(Position.getDiffAmount(diff), 0, 'Diff amount is ok')

    });

    /*
    TODO Возможно перенести в тест для нод
    test("MoveEvent sub positions",function(){

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
    */

    test("get center point", function(){
        var position1 = new Position({'x':-5,'y':10});
        var position2 = new Position({'x':10, 'y':20});
        var centerPositon = Position.getCenterPoint(position1, position2);

        deepEqual(centerPositon.getPosition(), {'x':2.5, 'y':15}, 'Center position is good');
    });

    test("get center point of points array", function(){
        var pos1 = new Position({'x':2, 'y':2});
        var pos2 = new Position({'x':2, 'y':6});
        var pos3 = new Position({'x':6, 'y':4});

        var center = Position.getCenterOfPointsArray([pos1,pos2,pos3]);



        deepEqual({'x':4,'y':4}, center.getPosition(), 'Center position is ok');

    });
});