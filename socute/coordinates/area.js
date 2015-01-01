"use strict";
define(["socute/oLib", 'socute/coordinates/position'], function (oLib, Position) {
    
    var Area = function (leftTop, width, height) {
        this._leftTop = new Position(leftTop.getCoords());
        this._width = width;
        this._height = height;

        this.calcSides();
          
    };

    var AreaMethods = {
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
        setHeight: function () {
            this._width = height;
            this.calcSides();
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
        }

    };

    oLib.extend(Area.prototype, AreaMethods);

    return Area;
});