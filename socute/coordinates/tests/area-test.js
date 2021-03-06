"use strict"
define(['socute/coordinates/area', 'socute/coordinates/position'], function(Area, Position){

    test("Area intersection", function(){
        var area1 = new Area(new Position({x:1, y:2}), 10, 20);
        var area2 = new Area(new Position({x:5, y:6}), 20, 30);

        var area3 = new Area(new Position({x:20, y:30}), 20, 30);


        equal(area1.isIntersectsionWith(area2), true, 'Area1 is intersects with area2');
        equal(area1.isIntersectsionWith(area3), false, 'Area1 is not intersects with area3');

    });

    test("Area from two positions", function () {
    	var position1 = new Position({'x':10, 'y': 15});
    	var position2 = new Position({'x':3, 'y': 5});

    	var area = new Area();
    	area.fromTwoPositions(position2, position1);

    	deepEqual(area.getPosition().getCoords(), position2.getCoords(), "Area position is ok");
		deepEqual(area.getWidth(), 7, "Area width is ok");
		deepEqual(area.getHeight(),10, "Area height is ok");
    });

    test("Merge 2 areas", function () {
    	var area1 = new Area(new Position({x:3, y:1}), 5, 6);
        var area2 = new Area(new Position({x:9, y:8}), 2, 2);

        var area3 = Area.merge(area1, area2);



        var testResultArea = new Area(new Position({x: 3, y: 1}), 8, 9);

    	deepEqual(testResultArea.getPosition().getCoords(), area3.getPosition().getCoords(), "Area position is ok");
		deepEqual(area3.getWidth(), testResultArea.getWidth(), "Area width is ok");
		deepEqual(area3.getHeight(), testResultArea.getHeight(), "Area height is ok");
    });


    test("Merge 4 areas", function () {
        var area1 = new Area(new Position({x:8, y:3}), 6, 4);
        var area2 = new Area(new Position({x:2, y:1}), 8, 3);
        var area3 = new Area(new Position({x:5, y:2}), 3, 2); 
        var area3 = new Area(new Position({x:5, y:2}), 3, 2); 
        var resultArea = Area.merge(area1, area2, area3);



        var testResultArea = new Area(new Position({x: 2, y: 1}), 12, 6);

        deepEqual(testResultArea.getPosition().getCoords(), resultArea.getPosition().getCoords(), "Area position is ok");
        deepEqual(resultArea.getWidth(), testResultArea.getWidth(), "Area width is ok");
        deepEqual(resultArea.getHeight(), testResultArea.getHeight(), "Area height is ok");
    });

});