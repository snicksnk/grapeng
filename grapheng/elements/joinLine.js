SoCuteGraph.nsCrete("elements.joinLine");

SoCuteGraph.elements.joinLine = (function () {
    "use strict";

    var ViewModel = function(paper){

        this.startPos = new Position();
        this.endPos = new Position();
        this.paper = paper;


        this.path = paper.path("0");

        //this.moveStartPoint(new Position({'x':230,'y':'150'}))
        this.curve = paper.path("0");
        //M181 31 L 79 59 Q 181 90 260 90
        //this.curvea=paper.path("M181 31 L 221 61 L 260 90");

    }



    ViewModel.prototype.moveStartPoint=function(position){
        this.startPos.setPos(position.getPosition());
        this._redrawLine();
    }

    ViewModel.prototype.moveEndPoint=function(position){
        this.endPos.setPos(position.getPosition());
        this._redrawLine();
    }

    ViewModel.prototype._redrawLine=function(){
        var start=this._resolveStartPostion();
        var end=this._resolveEndPosition();

        var centerX=(end['x']-start['x'])/2+start['x'];
        var centerY=(end['y']-start['y'])/2+start['y'];

        //this.paper.circle(centerX, centerY, 10);

        console.log(centerX,centerY);
        this.curve.attr("path", [
            "M",start['x'],start['y'],
            'Q',centerX,start['y'],
            ,centerX,centerY,
            'Q',centerX,end['y'],
            end['x'],end['y']
        ]);

    }

    ViewModel.prototype._resolveStartPostion=function(){
        var start=this.startPos.getPosition();
        return start;
    }

    ViewModel.prototype._resolveEndPosition=function(){
        var end=this.endPos.getPosition();
        return end;
    }


    return {
        'ViewModel':ViewModel
    };



})();
