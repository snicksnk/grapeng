SoCuteGraph.nsCrete('notations.mindMap');

SoCuteGraph.notations.mindMap = function () {

    var AbstractController = SoCuteGraph.elements.abstractController.Controller;
    var NodeViewController = SoCuteGraph.elements.basicNode.controllers.Controller;
    var Position = SoCuteGraph.helpers.coordinates.Position;
    var JoinLine = SoCuteGraph.elements.joinLine.controllers.Controller;


    var MindMap = function (viewFactory, dispatcher) {
        this._nodeStorage = {};
        this._lastAddedNodeId = false;
        this._viewFactory = viewFactory;
        this._dispather = dispatcher;
        this._nodePathes = {};
    }

    MindMap.prototype.getLastAddedNodeId = function (){
        return this._lastAddedNodeId;
    }

    MindMap.prototype.addNode = function (text, parentNode) {


        var node = this.nodeFactory(text, new Position({'x': 0, 'y': 0}));




        if (parentNode){
            var parentVC = parentNode.getViewController();
            var currentVC = node.getViewController();
            var joinLine = new JoinLine(this._viewFactory, parentVC, currentVC);
            this._dispather.addObject(joinLine);

            parentNode.addChildren(node);


        } else {
            node.getViewController().setOrientation('multi');
        }


        return node;

    }


    MindMap.prototype.nodeFactory = function (text, position){

        var nodeViewController = new NodeViewController(text, this._viewFactory, position);
        this._dispather.addObject(nodeViewController);
        var node = new Node(nodeViewController);
        this._dispather.addObject(node);
        var nodeId = node.getUniqueId();
        this._nodeStorage[nodeId] = node;
        node.setMindMap(this);
        this._lastAddedNode = node;
        return node;
    }

    MindMap.prototype.getPathOf = function (node) {
        return this._nodePathes[node.getUniqueId()];
    }

    MindMap.prototype.setNodePathOf = function (node, parentNode){
        var nodeId = node.getUniqueId();
        if (parentNode) {
            this._nodePathes[nodeId] = this.getPathOf(parentNode).concat(nodeId);
        } else {
            this._nodePathes[nodeId] = {};
        }
    }


    var Node = function (viewController) {
        this._viewController = viewController;
        this._mindMap = false;
        this._childrens = {};
        this._childrensOrder = [];
        this._childOffsets = new Position({'x':30, 'y':0});
        this._neighborhoodOffset = new Position({'x':0,'y':50});

    }

    Node.prototype = new AbstractController();

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

    Node.prototype.reposeChildrens = function (){
        var prevNode;
        var nextNode;
        for (var pos in this._childrensOrder){
            var prevNodeId = this._childrensOrder[pos-1];
            var nextNodeId = this._childrensOrder[pos+1];
            var curNodeId = this._childrensOrder[pos];


            prevNode = this.getChildrenWithId(prevNodeId);
            nextNode = this.getChildrenWithId(nextNodeId);
            curNode =  this.getChildrenWithId(curNodeId);


            if (prevNode){
                var newPos = this.calcChildPosition(curNode, prevNode);
            } else {
                var newPos = this.calcChildPosition(curNode);
            }


            curNode.getViewController().moveTo(newPos);

        }
    }

    Node.prototype.addChildren = function (node) {
        var nodeId = node.getUniqueId();
        this._childrens[nodeId] = node;

        this._childrensOrder.push(nodeId);


        this.reposeChildrens();

    }


    Node.prototype._calcNotFirstChildPosition = function (parentNode, childNode, prevChildNode){


        var newPos = new Position();
        newPos.setPos(prevChildNode.getPosition().getPosition());


        var heightFactor = new Position(prevChildNode.getNodeContainerSize().getPosition());
        newPos.setDiff(heightFactor.getPosition());
        newPos.setDiff(this._neighborhoodOffset.getPosition());

        return newPos;

    }

    Node.prototype._calcFirstChildPosition = function (parentNode) {
        var curPosition = parentNode.getViewController().getPosition();
        var newPos = new Position();

        newPos.setPos(curPosition.getPosition());

        var widthFactor = new Position({'x':parentNode.getWidth(),'y':0});

        newPos.setDiff(widthFactor.getPosition());
        newPos.setDiff(parentNode._childOffsets.getPosition());
        newPos.setDiff(parentNode._childOffsets.getPosition());

        return newPos;
    }


    Node.prototype.calcChildPosition = function(childNode, prevChildNode){

        var newPos = new Position();

        if (prevChildNode){
            newPos = this._calcNotFirstChildPosition(this, childNode, prevChildNode);
        } else {
            newPos = this._calcFirstChildPosition(this);
        }



        return newPos;
    }



    Node.prototype.init = function (NodeViewController) {

    }

    Node.prototype.getViewController = function () {
        return this._viewController;
    }


    Node.prototype.setMindMap = function (mindMap) {
        this._mindMap = mindMap;
    }

    Node.prototype.setCaption = function () {

    }

    Node.prototype.getCaption = function () {

    }

    Node.prototype.setColor = function (color) {

    }

    return {
        'Map': MindMap,
        'Node': Node
    }

}();



SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.nsCrete.notations.mindMap',
    function(){
        "use strict";

        var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;
        var MindMap = SoCuteGraph.notations.mindMap.Map;
        var Node = SoCuteGraph.notations.mindMap.Node;
        var disp = new SoCuteGraph.events.dispatchers.Dispatcher;

        var paper;

        test( "Test create mm",
            function() {

                var paper = Raphael(document.getElementById('mm-canvas'), 600, 600);

                var mm = new MindMap(new Scene(paper),disp);
                var rootNode = mm.addNode('root node');

                mm.addNode('Первый ребенок',rootNode);

                mm.addNode('Второй ребенок',rootNode);


                var threeNode = mm.addNode('Третий ребенок',rootNode);

                mm.addNode('нода1',threeNode);
                var inclNode2 = mm.addNode('2',threeNode);

                mm.addNode('Вложенная нода1',inclNode2);
                mm.addNode('Вложенная нода2',inclNode2);

                mm.addNode('Четвертый ребенок',rootNode);
            }
        );

    }
);


