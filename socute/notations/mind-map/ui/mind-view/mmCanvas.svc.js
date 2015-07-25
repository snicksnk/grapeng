app.factory('mmCanvas',
 function(mindMaps, Jaspecto){
 	return {
 		getCanvas: function(){
 			var paper = Raphael(document.getElementById('mm-canvas'), 1200, 600);
		 	var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;
		 	var scene = new Scene(paper);
		 	return scene;
 		}
 	};

});