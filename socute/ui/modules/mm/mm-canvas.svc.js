"use strict"
define(['angular', 'socute/elements/viewFactory/raphael'], function (ng, Scene) {
	return  function (mindMaps, Jaspecto){
	 	return {
	 		getCanvas: function(){
	 			var paper = Raphael(document.getElementById('mm-canvas'), 1200, 600);
			 	var scene = new Scene.Scene(paper);
			 	return scene;
	 		}
		};
}});