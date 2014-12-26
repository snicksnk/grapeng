"use strict";
define (["socute/oLib", "socute/coordinates/position",], function(oLib, Position){
    
    var build = function  (parent, childrens) {
        var parentPosition = parent.getPosition();

        var parentWidth = parent.getWidth();
        var childrensBlockOffset = {'x':30 + parentWidth, 'y':0};
        var childensOffset = new Position(parentPosition.getPosition());

        var parentOrientation = parent.getOrientation();
        
        if (parentOrientation === 'right'){
            childensOffset.setDiff(childrensBlockOffset);
        } else if (parentOrientation === 'left') {
            childensOffset.setReverseDiff(childrensBlockOffset);
        } else if (parentOrientation === 'multi') {
            //TODO Implement
            //childensOffset.setReverseDiff(childrensBlockOffset);
        }

        var childrensOffset = {'x':0, 'y': 20};
       
        var currentChildrenOffset = new Position(childensOffset.getPosition());
        oLib.each(childrens, function(index, child){
            child.moveTo(currentChildrenOffset);
            var currentNodeHeight = child.getHeight();
            var currentHeightOffset = {'x': 0, 'y':currentNodeHeight};
            currentChildrenOffset.setDiff(childrensOffset, currentHeightOffset);
        });
    }






    return {
        'build': build
    };

});