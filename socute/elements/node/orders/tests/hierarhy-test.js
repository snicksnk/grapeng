define ([
	"socute/oLib", 
	"socute/coordinates/position",
	"socute/elements/node/orders/hierarhy",
	"socute/elements/node/basic/controller",
	"socute/elements/factory",
	"socute/elements/viewFactory/raphael",
	"socute/events/dispatchers/dispatcher"
	], function(oLib, Position, hierarhy, NodeController, ElementsFactory, ViewFactory, Dispatcher){
		
		//TODO replace with scene mock
		var paper = Raphael(document.getElementById('testCanvas'), 800, 600);
		var scene = new ViewFactory.Scene(paper);

		var disp = new Dispatcher();

		var factory = new ElementsFactory(scene, disp)

	    test("Hierarhy move children without childrens", function() {
			var parentNode = factory.node('Test node');
			parentNode.moveTo(new Position({'x':20, 'y':30}));


			var childrenNode1 = factory.node('child node1');
			var childrenNode2 = factory.node('child node2');
			var childrenNode3 = factory.node('child node3');

			var nodeHeight = childrenNode1.getHeight();

			hierarhy.build(parentNode, [childrenNode1, childrenNode2, childrenNode3]);

			deepEqual(parentNode.getPosition().getCoords()['y'], childrenNode1.getPosition().getCoords()['y']);
	    });
	}
);