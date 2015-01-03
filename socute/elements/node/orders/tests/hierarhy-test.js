define ([
	"socute/oLib", 
	"socute/coordinates/position",
	"socute/coordinates/area",
	"socute/elements/node/orders/hierarhy",
	"socute/elements/node/basic/controller",
	"socute/elements/factory",
	"socute/elements/viewFactory/raphael",
	"socute/events/dispatchers/dispatcher"
	], function(oLib, Position, Area,  Hierarhy, NodeController, ElementsFactory, ViewFactory, Dispatcher){
		
		//TODO replace with scene mock
		var paper = Raphael(document.getElementById('testCanvas'), 800, 600);
		var scene = new ViewFactory.Scene(paper);

		var disp = new Dispatcher();

		var factory = new ElementsFactory(scene, disp)

		var settings = {
				'childrensOffset': {x: 0, y: 222},
				'childrensBlockOffset': {x: 44, y: 0}
		};

	    test("Hierarhy move children without childrens", function() {
			var parentNode = factory.node('Test node');
			parentNode.moveTo(new Position({'x':20, 'y':30}));


			var childrenNode1 = factory.node('child node1');
			var childrenNode2 = factory.node('child node2');
			var childrenNode3 = factory.node('child node3');

			var nodeHeight = childrenNode1.getHeight();

			var hierarhy = new Hierarhy(settings);

			var resultArea = hierarhy.build(parentNode, [childrenNode1, childrenNode2, childrenNode3]);

			var parentCoords = parentNode.getPosition().getCoords();
			var parentPosition = new Position(parentCoords);
			var parentWidth = parentNode.getWidth();

			var lastNodePosition = childrenNode3.getPosition().getCoords();

		
			parentPosition.setDiff({'x':parentWidth, 'y':0});
			parentPosition.setDiff(settings.childrensBlockOffset);


			var firstNodeCoords = parentPosition.getCoords()

			deepEqual(parentCoords['y'], childrenNode1.getPosition().getCoords()['y']);
			//TODO Current task
			deepEqual(firstNodeCoords, childrenNode1.getPosition().getCoords());

			//deepEqual()

			//var mustBeResultArea = new Area(parentPosition.clone(), )

			//deepEqual(resultArea, )
	    });
		
		test("Test add method", function(){
			var parentNode = factory.node('Test node');
			parentNode.moveTo(new Position({'x':20, 'y':30}));


			var childrenNode1 = factory.node('child node1');
			var childrenNode2 = factory.node('child node2');
			var childrenNode3 = factory.node('child node3');





		});

	}
);