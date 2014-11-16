"use strict";
define([
    "socute/elements/abstract/controller",
    "socute/oLib",
    "socute/elements/line/controller",
    "socute/events/std/move"], 
    function(AbstractController, oLib, LineController, MoveEvent){
	
    var BeamLines = {
        setUp: function (propertyes){

            var Beam = function (){

            };

            Beam.prototype = new AbstractController;
            oLib.mixin(Beam.prototype, BeamLines);

            var beam = new Beam();

            beam.setPaper(propertyes['paper']);
            beam.setParent(propertyes['parent']);
            beam.setChildrens(propertyes['childs']);

            propertyes['dispatcher'].addObject(beam);
            beam.rebuild();



            return beam;
        },
        BeamLines: function(){

        },
        setPaper: function(paper){
            this._paper = paper;
        },
        setParent: function(parentNode){
            this._parentNode = parentNode;
        },
        setChildrens: function(childrens){
            this._childrens = childrens;
        },
        rebuild: function(){


            var childrens = this._childrens;


            this._lines = [];

            for(var i in childrens){
                var child = childrens[i];
                var line = new LineController(this._paper, this._parentNode, child);
                this.getDispatcher().addObject(line);
                this._lines.push(line);
                this.addSubscription(new MoveEvent(line), function(){

                });
            }
        }
    }

    return BeamLines;
});