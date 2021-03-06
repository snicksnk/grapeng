"use strict";
define (["socute/oLib", "socute/coordinates/position", "socute/coordinates/area"], function(oLib, Position, Area){
    
    var Hierarhy = function (settings) {
        this.settings = {
            childrensOffset: {'x':0, 'y': 20},
            childrensBlockOffset: {'x':30, 'y':0}
        };

        if (settings) {
            this.setSettings(settings);   
        }
    }

    var HierarhyMethods = {
        setSettings: function (settings) {
            oLib.extend(this.settings, settings);
        },
        build: function  (parent, childrens) {
            var parentPosition = parent.getPosition();

            var parentWidth = parent.getWidth();
            var childrensBlockOffset = new Position(this.settings.childrensBlockOffset); 
            
            childrensBlockOffset.setDiff({x: parentWidth, y:0});
            var childensOffset = new Position(parentPosition.getPosition());
            var parentOrientation = parent.getOrientation();
            
            if (parentOrientation === 'right'){
                childensOffset.setDiff(childrensBlockOffset.getCoords());
            } else if (parentOrientation === 'left') {
                childensOffset.setReverseDiff(childrensBlockOffset.getCoords());
            } else if (parentOrientation === 'multi') {
                //TODO Implement
                //childensOffset.setReverseDiff(childrensBlockOffset);
            }

           
            var currentChildrenOffset = new Position(childensOffset.getPosition());
            var that = this;

            var blockArea = new Area(parentPosition.clone(), parent.getWidth(), parent.getHeight())

            oLib.each(childrens, function(index, child){
                child.moveTo(currentChildrenOffset);
                var currentNodeHeight = child.getHeight();
                var currentHeightOffset = {'x': 0, 'y':currentNodeHeight};
                currentChildrenOffset.setDiff(that.settings.childrensOffset, currentHeightOffset);
            	/**
            	* Calculating block area
            	*/
            	var currentNodeArea = new Area();
            	//blockArea = 

            });

            return new Area(parentPosition.clone());
        }
    };


    oLib.extend(Hierarhy.prototype, HierarhyMethods);


    return Hierarhy;

});