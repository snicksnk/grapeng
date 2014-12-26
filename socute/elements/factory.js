"use strict"
define([
	"socute/coordinates/position",
	"socute/elements/node/basic/controller",
	"socute/events/dispatchers/dispatcher",
	"socute/elements/line/controller",
	"socute/elements/node/basic/viewModel",
	"socute/oLib"
	], function(Position, NodeController, Dispatcher, LineController, 
		ControllerViewModel, oLib)
	{

		var factory = function(scene, dispatcher) {
			this._scene = scene;
			this._dispatcher = dispatcher;
		}


    	var factoryMethods = 
    	{
    		node: function(NameOrSetting) {
		    	if (typeof NameOrSetting === "object"){
		    		//TODO implement it
		    	} else {
		    		var content = NameOrSetting;
		    		var node = new NodeController(content, this._scene);
		    	}
		    	this._dispatcher.addObject(node);
		    	return node;
   			},

   			line: function(start, end, strategy) {

   			}


   		}

   		oLib.extend(factory.prototype, factoryMethods);

   		return factory;
	}
);
