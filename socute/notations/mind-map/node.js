define([
	"socute/elements/abstract/controller",
	"socute/oLib",
	'socute/notations/mind-map/build/default',
	'socute/coordinates/position'
	], function(AbstractController, oLib, Default, Position){
	var Node = function (viewController) {

        //TODO Fix it
        //var Default = SoCuteGraph.notations.mindMap.building.Default;


        this._viewController = viewController;
        this._mindMap = false;
        this._childrens = {};
        this._childrensOrder = [];
        this._childOffsets = new Position({'x':30, 'y':0});
        this._neighborhoodOffset = new Position({'x':0,'y':50});
        this._buildStrategy = new Default();
        this._parentJoin = false;
        this._parent = false;

        this._calculatedPosition = false;
        this._structureOffset = new Position();



        this._diffFromCalculatedPosition = false;

        this._parentDep = false;
        this._isParent = false;

        this.defineAttrs();

        this._color = false;

    }

    Node.prototype = new AbstractController();

    Node.prototype.setIsParent = function (isParent) {
        this._isParent = isParent;
    }

    Node.prototype.getIsParent = function () {
        return this._isParent;
    }


    Node.prototype.setDiffFromCalculatedPosition = function (diff) {

        if (!diff){
            diff = false;
        } else {
            this._diffFromCalculatedPosition = diff;
        }
    }


    Node.prototype.getDiffFromCalculatedPosition = function () {
        return this._diffFromCalculatedPosition;
    }


    Node.prototype.setParentNodeDependecie = function (dependencie){
        this._parentDep = dependencie;
    }

    Node.prototype.getParentNodeDependecie = function () {

        return this._parentDep;
    }

    Node.prototype.setParentJoin = function (joinLine) {

        this._parentJoin = joinLine;

    }

    Node.prototype.setCalculatedPosition = function (position) {

        this._calculatedPosition = position;
    }

    Node.prototype.getCalculatedPosition = function () {
        if (this._calculatedPosition){
            return this._calculatedPosition;
        } else {
            return false;
        }
    }

    Node.prototype.getDump = function (noChilds) {
        var dump = {};
        dump['title'] = this.getAttr('title');
        dump['_childrens'] = [];

        if (!noChilds){
            var childrens = this.getChildrens();
            SoCuteGraph.oLib.each(childrens, function(i,child){
                dump['_childrens'].push(child.getDump());
            });
        }
        dump['position'] = this.getAttr('position');

        dump['diffFromCalculatedPosition'] = this.getAttr('diffFromCalculatedPosition');



        dump['color'] = this.getAttr('color');

        return dump;

    }



    Node.prototype.removeChild = function (child) {
        var childId = child.getUniqueId();

        delete this._childrens[childId];

        for (var p in this._childrensOrder){
            childNodeId = this._childrensOrder[p];
            
            if (childNodeId === childId){
                this._childrensOrder.splice(p,1);
            }
        }

        //console.log(this._childrens, this._childrensOrder);
        this.reposeChildrens();
    }

    Node.prototype.getParentJoin = function () {
        return this._parentJoin;
    }

    Node.prototype.getChildrens = function () {
        return this._childrens;
    }


    Node.prototype.getText = function () {
        return this.getViewController().getTitle();
    }

    Node.prototype.getNodeContainerSize = function(){

        var heightDiff = new Position();

        var firstChildrenId = this._childrensOrder.slice(0,1)[0];
        var lastChildrenId = this._childrensOrder.slice(-1)[0];

        var firstChildren = this.getChildrenWithId(firstChildrenId);
        var lastChildren = this.getChildrenWithId(lastChildrenId);

        if (firstChildren){

            var topPoint = firstChildren.getPosition().getPosition()['y'];

            var bottomPoint = lastChildren.getPosition().getPosition()['y'] + lastChildren.getNodeContainerSize().getPosition()['y'];

            var height = bottomPoint - topPoint;




        } else {
            var height = this.getHeight();
        }
        heightDiff.setPos({'x':0, 'y':height});
        return heightDiff;

    }

    Node.prototype.getChildren = function (node) {
        return this._childrens[node.getUniqueId()];
    }

    Node.prototype.getPosition = function(){
        return this.getViewController().getPosition();
    }

    Node.prototype.getWidth = function() {
        return this.getViewController().getWidth();
    }

    Node.prototype.getHeight = function(){
        //TODO Реализовать
        return 30;
    }


    Node.prototype.getChildrenWithId = function (id) {
        return this._childrens[id];
    }

    Node.prototype.remove = function () {
        for(var id in this._childrens){
            var childNode = this._childrens[id];
            childNode.remove();
        }
        this.getParentJoin().hide();
        this.getViewController().hide();
        this.getParentNode().removeChild(this);
    }

    Node.prototype.addChildren = function (node) {
        var nodeId = node.getUniqueId();
        this._childrens[nodeId] = node;

        this._childrensOrder.push(nodeId);
        node.setParent(this);

        //this.reposeChildrens();
        //Todo Fi
        //this.reposeChildrens();
    }

    Node.prototype.reposeChildrens = function (){


        this._buildStrategy.reposeChildrens(this, this._childrens, this._childrensOrder);


        var parentNode = this.getParentNode();
        if (parentNode){
           //parentNode.reposeChildrens();
        }
    }

    Node.prototype.init = function (NodeViewController) {

    }

    Node.prototype.getViewController = function () {
        return this._viewController;
    }


    Node.prototype.setParent = function (parentNode) {
        this._parent = parentNode;
    }

    Node.prototype.getParentNode = function () {
        return this._parent;
    }


    Node.prototype.setMindMap = function (mindMap) {
        this._mindMap = mindMap;
    }

    Node.prototype.setCaption = function () {

    }

    Node.prototype.getCaption = function () {

    }

    Node.prototype.setColor = function (color) {
        this.getViewController().getViewObject().frame.setColor(color);
        this._color = color;
    }

    Node.prototype.getColor = function (){
        return this._color;
    }



    Node.prototype.defineAttrs = function (){

        this._addAttr('title', 'new node', function(name, val){
            this.getViewController().setText(val);
        },
        function(){
            console.log(this.getViewController().getText())
            return this.getViewController().getText();
        }
        )

        var positionGetter = function(){
            return this.getViewController().getPosition().getPosition();
        }

        var positionSetter = function(name,val) {
            if (val){;
                this.getViewController().moveTo(new Position(val));
            }
        }

        this._addAttr('position', null, positionSetter, positionGetter);

        this._addAttr('color', 'blue',
        function(name, val){
            this.setColor(val);
        },
        function() {
            return this.getColor() || 'blue';
        }
        )

        this._addAttr('calculatedPosition', null,
            function (name, val){
                if (val){
                    this.setCalculatedPosition(new Position(val));
                }
            },

            function () {

                var calcPosition = this.getCalculatedPosition();

                if (calcPosition){
                   return this.getCalculatedPosition();
                }
                return false;
            }

        );

        this._addAttr('diffFromCalculatedPosition',false,
            function(name, val){
                this.setDiffFromCalculatedPosition(val);
            },
            function() {
                return this.getDiffFromCalculatedPosition();
            }
        );


        this._addAttr('orientation', 
                'right',
                function(name, val){
                    var val = val || 'right'    ;
                    this.getViewController().setOrientation(val);
                },
                function(){
                    return this.getViewController().getOrientation();
                }
            )

        /*
        var textGetter = function(){
            return this.getText();
        }
        */
        //this._addAttr('text',null, null, textGetter());
    }

    oLib.mixin(Node.prototype, oLib.PropertyesMixin);

    return Node;

});