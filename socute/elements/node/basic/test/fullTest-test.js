"use strict"
define([
	"socute/coordinates/position",
	"socute/elements/node/basic/controller",
	"socute/events/dispatchers/dispatcher",
	"socute/elements/line/controller",
	"socute/elements/line/dependencies/beam",
	"socute/elements/node/basic/viewModel",
	"socute/elements/node/dependencies/moveSlave",
	"socute/elements/viewFactory/raphael",
	"socute/elements/animation/controller",
	"socute/elements/line/dependencies/assoc",
	"socute/events/std/frame"
	], function(Position, NodeController, Dispatcher, LineController, LinesBeam, 
		Element, MoveSlave, ViewFactory, Animation, AssocLines, FrameEvent)
	{
 
	    test( "Jump event get name", function() {


	        var disp = new Dispatcher();
	        //var ResolveAssocLinePoints = SoCuteGraph.elements.joinLine.dependencies.ResolveAssocLinePoints;

	        var position = new Position();
	        position.setPos({'x':10,'y':30});



	        deepEqual(position.getNewPos(),{'x':10,'y':30},'new position was set');

	        equal(position.getNewPos(),false,'Position was not set');

	        deepEqual(position.getPosition(),{'x':10,'y':30},'Position was given by setter is valid');



	        var paper = Raphael(document.getElementById('canvas'), 800, 600);

	        var scene = new ViewFactory.Scene(paper);
	        console.log(NodeController);
	        var node = 
	        new NodeController('Первая нода', 
	        	scene, 
	        	new Position({'x':380,'y':180}));

	        console.log(node);

	        node.setOrientation(Element.ORIENTED_MULTI);

	        //TODO delete it
	        var centerView=node.getViewObject().frame.getRaphaelElement();
	        var centerText=node.getViewObject().text.getRaphaelElement();


	        centerText.attr("font-family",'Arial');
	        centerText.attr("font-weight",'bold');

	        centerText.attr("font-size",17);


	        centerView.attr("fill", "#FFEC73");
	        centerView.attr("fill-opacity",0.5);
	        centerView.attr("stroke", "#A68F00");
	        centerView.attr("r", 25);
	        node.getViewObject().frame.setVerticalOffset(20);
	        node.getViewObject().frame.setHorizontalOffset(15);

	        node.redraw();
	        disp.addObject(node);

	        var nodeDepends = new NodeController('Вторая нода\nМного строк\nЗдесь\nЕсть', scene, new Position({'x':610,'y':21}));

	        new MoveSlave(disp, node, nodeDepends);

	        //
	        // nodeDepends.setDependsOf(node);

	        disp.addObject(nodeDepends);

	        equal(nodeDepends._moveEvent.getUniqueName(),'move_object_2','SCEvent name of depended object is correct');

	        equal(node._moveEvent.getUniqueName(),'move_object_1','SCEvent name of master object is correct');


	        disp.notify(node._moveEvent);



	        //equal(disp._lastEvent, node._moveEvent, 'Last event of dispatcher is correct for master object');



	        //line=new Line(scene, node, nodeDepends);

	        //new ParentChildJoin(disp, line, node, nodeDepends);

	        //disp.addObject(line);

	        var node3 = new NodeController('Третья нода', scene, new Position({'x':610,'y':340}));
	        new MoveSlave(disp, node, node3);


	        disp.addObject(node3);

	        //line2=new Line(scene, node, node3);





	        //disp.addObject(line2);

	        var node4 = new NodeController('Четвертая нода', scene, new Position({'x':230,'y':250}));
	        node4.setOrientation(Element.ORIENTED_LEFT);

	        new MoveSlave(disp, node, node4);


	        node4.getViewObject().frame.getRaphaelElement()
	            .attr('fill','#34CFBE')
	            .attr('opacity',0.5);

	        disp.addObject(node4);



	        var line3 = new LineController(scene, node, node4);
	        disp.addObject(line3);




	        var node5= new NodeController('Пятая нода', scene, new Position({'x':30,'y':90}));
	        node5.setOrientation(Element.ORIENTED_RIGHT);
	        node5.setOrientation(Element.ORIENTED_LEFT);
	        new MoveSlave(disp, node4, node5);

	        disp.addObject(node5);


	        var line4 = new LineController(scene, node4, node5);
	        disp.addObject(line4);

	        var node6=new NodeController('Шестая нода', scene, new Position({'x':70,'y':330}));
	        new MoveSlave(disp, node4, node6);

	        node6.setOrientation(Element.ORIENTED_LEFT);
	        disp.addObject(node6);

	        var line5 = new LineController(scene, node4, node6);
	        disp.addObject(line5);


	        var lineAssoc=new LineController(scene, node5, node6, AssocLines);


	        disp.addObject(lineAssoc);

	        var bench = LinesBeam.setUp({dispatcher:disp, 'paper': scene,'parent':node,'childs':[nodeDepends, node3]});




	       // line=new Line(scene, node, nodeDepends);

	        //disp.addObject(line);

	        console.log(bench._lines);

	        disp.addObject(bench._lines[0]);



	        var animation = new Animation(500, 340, 3000, function(newY){
	           newY = Math.round(newY);
	           node3.moveTo(new Position({'x':610, 'y':newY}));
	        });

	        disp.addObject(animation);
	        animation.start();


			/*
			* Content node
	        */
	        
	       	var nodeContent = new NodeController('Нода-контент', scene, 
	       		new Position({'x':80, 'y':380}));
	       	disp.addObject(nodeContent);

	       	nodeContent.setIsDragable(false);
			

	       	var nodeContaynir=new NodeController(nodeContent, scene, 
	       		new Position({'x':70,'y':370}));
	        disp.addObject(nodeContaynir);
	        new MoveSlave(disp, node4, nodeContaynir);
	        new MoveSlave(disp, nodeContaynir, nodeContent);


	        nodeContaynir.setOrientation(Element.ORIENTED_LEFT);

	        var line6 = new LineController(scene, node4, nodeContaynir);
	        disp.addObject(line6);


	       	
	        /*
	
	        var FrameDebugger = SoCuteGraph.elements.animation.tools.FrameDebugger;

	        var framer = new FrameDebugger();
	        framer.setDisplayCallback(function(frameEvnt){

	        })

	        disp.addObject(framer);
	        */


	    });



	    test ("Move dependent object", function(){
	        var disp = new Dispatcher();
	        var paper = Raphael(document.getElementById('testCanvas'), 600, 600);
	        var scene = new ViewFactory.Scene(paper);
	      
	        var node7 = new NodeController('Нода 7', scene, new Position({'x':10, 'y':20}));
	        disp.addObject(node7);



	        var node8 = new NodeController('Нода 8', scene, new Position({'x':30, 'y':40}));

	        new MoveSlave(disp, node7, node8);
	        disp.addObject(node8);

	        node7.moveTo(new Position({'x':0,'y':0  }));


	        disp.notify(new FrameEvent());

	        deepEqual({'x':20,'y':20}, node8.getPosition().getPosition(), 'Dependent node moved properly');




	        node7.moveTo(new Position({'x':-30,'y':-40  }));


	        disp.notify(new FrameEvent());

	        deepEqual({'x':-10,'y':-20}, node8.getPosition().getPosition(), 'Dependent node moved properly');

	        node7.moveTo(new Position({'x':230,'y':230  }));


	        disp.notify(new FrameEvent());

	        deepEqual({'x':250,'y':250}, node8.getPosition().getPosition(), 'Dependent node moved properly');

	        node7.moveTo(new Position({'x':210,'y':240  }));



	        disp.notify(new FrameEvent());

	        deepEqual({'x':230,'y':260}, node8.getPosition().getPosition(), 'Dependent node moved properly');




	        ok(true,'Building compleate');





	    });

	    test ("set orientation", function(){
	        var paper = Raphael(document.getElementById('testCanvas'), 600, 600);
	        var scene = new ViewFactory.Scene(paper);
	        //var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
	        var testNode = new NodeController('wrong node', scene);
	        try{
	            testNode.setOrientation('wrong');
	            ok(false, 'Exception was not thrown');
	        } catch (e){
	            ok(true, 'Exception was thrown');
	        }
	    });


	    test("Hide node", function(){
	        var paper = Raphael(document.getElementById('testCanvas'), 800, 600);
	        var scene = new  ViewFactory.Scene(paper);
	        var testNode=new NodeController('hidden node', scene);



	        var disp = new Dispatcher();

	        equal(false, testNode.getVisability());

	        disp.addObject(testNode);

	        equal(true, testNode.getVisability());

	        testNode.setVisability(false);
	        equal(false, testNode.getVisability());
	        testNode.show();
	        equal(true, testNode.getVisability());

	        testNode.hide();
	        equal(false, testNode.getVisability());

	        //testNode.show();

	    });
});