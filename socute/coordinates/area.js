"use strict";
define(["socute/oLib", 'socute/coordinates/position'], function (oLib, Position) {
    
    var Area = function (leftTop, width, height) {

        if (leftTop){
            this._leftTop = new Position(leftTop.getCoords());
        } else {
            this._leftTop = new Position();
        }

        this._width = width || 0;
        this._height = height || 0;
        

        this.calcSides();
          
    };

    Area.merge = function (area1, area2) {
        if (arguments.length > 2){ 
            var currentArea, 
            resultArea = Array.prototype.shift.call(arguments);
            while(currentArea = Array.prototype.shift.call(arguments)){
                resultArea = Area.merge(resultArea, currentArea);
            }
            return resultArea;
        };

        var startCords = new Position();
        var position1 = area1.getPosition();
        var position2 = area2.getPosition() ;
        var areaCords = startCords.findNearest([position1, position2]);
        var width, height;

        if (area1.getRight() > area2.getRight()){
            console.log(area1.getRight() , area2.getRight(), areaCords.getCoords()['x'])
            width = area1.getRight() - areaCords.getCoords()['x']
        } else {
            width = area2.getRight() - areaCords.getCoords()['x']
        }    

        if (area1.getBottom() > area2.getBottom()){
            height = area1.getBottom() - areaCords.getCoords()['y']
        } else {
            height = area2.getBottom() - areaCords.getCoords()['y']
        }    
        
        var resultArea = new Area(areaCords, width, height);

        return resultArea;
        
    }



    var AreaMethods = {
        fromTwoPositions: function (position1, position2) {
            var position1 = Position.extract(position1);
            var position2 = Position.extract(position2);
            
            var startCoords = new Position();
            var leftTop = startCoords.findNearest([position1, position2]);
            this.setPosition(leftTop.clone());

            position1.setReverseDiff(position2.getCoords());

            var posDiff = position1.getCoords();
            var width = Math.abs(posDiff['x']);
            var height = Math.abs(posDiff['y']);

            this.setWidth(width);
            this.setHeight(height);

        },
        mergeWith: function (area) {
            
        },
        isIntersectsionWith: function (anotherArea) {
            return !(anotherArea.getLeft() > this.getRight() || 
                anotherArea.getRight() < this.getLeft() || 
                anotherArea.getTop() > this.getBottom() ||
                anotherArea.getBottom() < this.getTop());    
        },
        calcSides: function () {
            var leftTop = this._leftTop;
            var width = this._width;
            var height = this._height;

            this._top = leftTop.getCoords()['y'];
            this._left = leftTop.getCoords()['x'];
            this._right = leftTop.getCoords()['x'] + width;
            this._bottom = leftTop.getCoords()['y'] + height;
        },
        setWidth: function (width) {
            this._width = width;  
            this.calcSides();
        },
        setHeight: function (height) {
            this._height = height;
            this.calcSides();
        },
        getWidth: function () {
            return this._width;
        },
        getHeight: function () {
            return this._height;
        },
        getTop: function () {
            return this._top;
        },

        getLeft: function () {
            return this._left;  
        },

        getRight: function () {
            return this._right;
        },

        getBottom: function () {
            return this._bottom;
        },
        setPosition: function (position) {
            this._leftTop = position;
        },
        getPosition: function () {
            return this._leftTop;
        } 

    };

    oLib.extend(Area.prototype, AreaMethods);

    return Area;
});