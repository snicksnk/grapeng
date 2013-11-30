SoCuteGraph.nsCrete("elements.joinLine");

SoCuteGraph.elements.joinLine = (function () {
    "use strict";


    var NodeViewModel = SoCuteGraph.elements.basicNode.viewModel.ViewModel;




    var ViewModel = function(paper){

        this.startPos = new Position();
        this.endPos = new Position();

        this._startNodeOrientation=false;
        this._endNodeOrientation=false;

        this.paper = paper;


        this.path = paper.path("0");

        //this.moveStartPoint(new Position({'x':230,'y':'150'}))
        this.curve = paper.path("0");
        //M181 31 L 79 59 Q 181 90 260 90
        //this.curvea=paper.path("M181 31 L 221 61 L 260 90");

    }


    ViewModel.prototype.setStartNodeOrientation=function(orientation) {
        this._startNodeOrientation = orientation;
    }


    ViewModel.prototype.setEndNodeOrientation=function(orientation) {
        this._endNodeOrientation = orientation;
    }




    ViewModel.prototype.moveStartPoint=function(position, orientation){

            this.startPos.setPos(this._resolveNodeOutPoint(position, orientation).getPosition());

            this._startNodeOrientation=orientation;

        this.redrawLine();
    }

    ViewModel.prototype._resolveNodeOutPoint=function(position, orientation){
        var outPointPosition;

        if (orientation===NodeViewModel.ORIENTED_RIGHT){
            outPointPosition=position.sub.rightJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_LEFT){
            outPointPosition=position.sub.leftJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_MULTI){

            var endNodeOrientation=this._endNodeOrientation;

            if (endNodeOrientation===NodeViewModel.ORIENTED_RIGHT) {
                outPointPosition=position.sub.rightJoinPoint;
            } else if (endNodeOrientation===NodeViewModel.ORIENTED_LEFT) {
                outPointPosition=position.sub.leftJoinPoint;
            }
            else if (endNodeOrientation===NodeViewModel.ORIENTED_MULTI){
                throw 'Still not implemented ((';
            } else {
                throw 'Undefined orientation "'+endNodeOrientation+'"';
            }



            //outPointPosition=position.sub.leftJoinPoint;
        } else {
            throw "Can't resolve points for orientation '"+orientation+"'";
        }
        return outPointPosition;
    }





    ViewModel.prototype._resolveNodeInPoint=function(position, orientation){
        var inPointPostion;
        if (orientation===NodeViewModel.ORIENTED_RIGHT){
            inPointPostion=position.sub.leftJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_LEFT){
            inPointPostion=position.sub.rightJoinPoint;
        } else if (orientation===NodeViewModel.ORIENTED_MULTI){
            inPointPostion=position.sub.leftJoinPoint;
        } else {
            throw "Can't resolve points for orientation '"+orientation+"'";
        }
        return inPointPostion;
    }





    ViewModel.prototype.moveEndPoint=function(position, orientation){
        console.log(position, orientation);
        this.endPos.setPos(this._resolveNodeInPoint(position, orientation).getPosition());
        this._endNodeOrientation=orientation;
        this.redrawLine();
    }


    ViewModel.prototype.redrawLine=function(){
        var start=this.getStartPostion();
        var end=this.getEndPosition();

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

    ViewModel.prototype.getStartPostion=function(){
        var start=this.startPos.getPosition();
        return start;
    }

    ViewModel.prototype.getEndPosition=function(){
        var end=this.endPos.getPosition();
        return end;
    }


    return {
        'ViewModel':ViewModel
    };



})();
