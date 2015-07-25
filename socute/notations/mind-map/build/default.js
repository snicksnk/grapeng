 define([
    'socute/coordinates/position', 
    'socute/oLib'], function(Position, oLib){

    var Abstract = function(){

    }

    Abstract.prototype.init = function(settings){
        this.defineAttrs();
    }


    Abstract.prototype.defineAttrs = function (){
        this._addAttr('childOffsets', null);
        this._addAttr('neighborhoodOffset',null);

    }


    Abstract.prototype.reposeChildrens = function(parent, children, childrensOrder){

    }



    oLib.mixin(Abstract.prototype, oLib.PropertyesMixin);



    var Default = function (){
        this.init();
        this._childOffsets = new Position({'x':30, 'y':0});
        this._neighborhoodOffset = new Position({'x':0,'y':50});
    }

    Default.prototype = new Abstract();




    Default.prototype._calcNotFirstChildPosition = function (parentNode, childNode, prevChildNode){


        var newPos = new Position();
        newPos.setPos(prevChildNode.getPosition().getPosition());

        var heightFactor = new Position(prevChildNode.getNodeContainerSize().getPosition());
        newPos.setDiff(heightFactor.getPosition());
        newPos.setDiff(this._neighborhoodOffset.getPosition());

        return newPos;

    }

    Default.prototype._calcFirstChildPosition = function (parentNode) {
        var curPosition = parentNode.getViewController().getPosition();
        var newPos = new Position();

        newPos.setPos(curPosition.getPosition());

        var widthFactor = new Position({'x':parentNode.getWidth(),'y':0});

        newPos.setDiff(widthFactor.getPosition());
        newPos.setDiff(parentNode._childOffsets.getPosition());


        return newPos;
    }


    Default.prototype.calcChildPosition = function(parent, childNode, prevChildNode){

        var newPos = new Position();

        if (prevChildNode){
            newPos = this._calcNotFirstChildPosition(parent, childNode, prevChildNode);
        } else {
            newPos = this._calcFirstChildPosition(parent);
        }

        return newPos;
    }

    Default.prototype.reposeChildrens = function (parent, childrens, childrensOrder){
        var prevNode;
        var nextNode;
        for (var pos in childrensOrder){
            pos = parseInt(pos);
            var prevNodeId = childrensOrder[pos-1];
            var nextNodeId = childrensOrder[pos+1];
            var curNodeId = childrensOrder[pos];

            curNode =  parent.getChildrenWithId(curNodeId);


            prevNode = parent.getChildrenWithId(prevNodeId);
            nextNode = parent.getChildrenWithId(nextNodeId);


            var calculated;

            var newPos = this.calcChildPosition(parent, curNode, prevNode);

            if ( calculated = curNode.getCalculatedPosition()){

                //console.log(curNode.getDiffFromCalculatedPosition());
                curNode.getViewController().moveTo(newPos);

                //curNode.getViewController().moveByDiff(curNode.getDiffFromCalculatedPosition());


                continue;
            } else {
                console.log('-=-=-');
                curNode.getViewController().moveTo(newPos);
                curNode.setCalculatedPosition(newPos);
            }









        }





        if (parent.getIsParent()){
           this._reposeParentToCenter(parent, childrens, childrensOrder);
        }
    }
    /*
    Default.prototype._calcParentNodePosition = function (parent, childrens, childrensOrder) {
        var firstNode = parent.getChildrenWithId(childrensOrder[0]);
        var lastNode = parent.getChildrenWithId(childrensOrder[0]);

        return firstNode.getPosition();
    }

    */
    Default.prototype._reposeParentToCenter = function(parent, childrens, childrensOrder){
        var firstChildId = childrensOrder[0];
        var lastChildId = childrensOrder[childrensOrder.length-1];

        var curPos = new Position(parent.getPosition().getPosition());


        var containerSize = parent.getNodeContainerSize();

        oLib.each(childrens, function(i,child){

            var parentNodeDep = child.getParentNodeDependecie();
            if (parentNodeDep){
                //parentNodeDep.cansel();
                //parentNodeDep.apply();


            }
        });

        var yOffset = Math.ceil(containerSize.getPosition()['y']/2)-parent.getHeight()/2;


        curPos.setDiff({'x':0, 'y':yOffset});


        parent.getViewController().moveTo(curPos,true);

        parent.getViewController().moveTo(curPos,true);



        parent.getViewController().moveTo(curPos);


    }

    return Default;
});