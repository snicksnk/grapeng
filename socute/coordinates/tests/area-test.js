define(['socute/coordinates/area', 'socute/coordinates/position'], function(Area, Position){

    test("Area intersection", function(){
        var area1 = new Area(new Position({x:1, y:2}), 10, 20);
        var area2 = new Area(new Position({x:5, y:6}), 20, 30);

        var area3 = new Area(new Position({x:20, y:30}), 20, 30);


        equal(area1.isIntersectsionWith(area2), true, 'Area1 is intersects with area2');
        equal(area1.isIntersectsionWith(area3), false, 'Area1 is not intersects with area3');

    });
});