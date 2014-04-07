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

        //TODO Fix it
        var Default = SoCuteGraph.notations.mindMap.building.Default;


        this._viewController = viewController;
        this._mindMap = false;
        this._childrens = {};
        this._childrensOrder = [];
        this._childOffsets = new Position({'x':30, 'y':0});
        this._neighborhoodOffset = new Position({'x':0,'y':50});
        this._buildStrategy = new Default();

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


    Node.prototype.addChildren = function (node) {
        var nodeId = node.getUniqueId();
        this._childrens[nodeId] = node;

        this._childrensOrder.push(nodeId);

        this._buildStrategy.reposeChildrens(this, this._childrens, this._childrensOrder);

    }

    /*
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

    */

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





SoCuteGraph.notations.mindMap.building = function () {


    var Position = SoCuteGraph.helpers.coordinates.Position;

    var Abstract = function(){
        this.init();
    }

    Abstract.prototype.init = function(settings){
        this.defineAttrs();
    }

    Abstract.prototype.setAttr = function(name, value){
        if (typeof this._attrsSetters[name] === 'undefined'){
            throw new Error('Undefined property "'+name+'"');
        }

        this._attrsSetters[name].setter.call(this, name, value);
        return this;
    }

    Abstract.prototype.getAttr = function(name){
        if (typeof this._attrsSetters[name] === 'undefined'){
            throw new Error('Undefined property "'+name+'"');
        }

        return this._attrsSetters[name].getter.call(this, name);
    }

    Abstract.prototype.defineAttrs = function (){
        this._attrsSetters = {};

        this._addAttr('childOffsets', null);
        this._addAttr('neighborhoodOffset',null);


    }

    Abstract.prototype._addAttr = function(name, defaultValue, setter, getter) {

        if (!setter){
            setter = this._defaultSetter;
        }

        if (!getter){
            getter = this._defaultGetter;
        }



        this._attrsSetters[name] = {};
        this._attrsSetters[name].setter = setter;
        this._attrsSetters[name].getter = getter;
        this._attrsSetters[name].setter.call(this, name, defaultValue);

    }

    Abstract.prototype._defaultGetter = function(name) {

        return this['_'.name];
    }


    Abstract.prototype._defaultSetter = function(name, value) {

        this['_'.name] = value;
        return this;
    }


    Abstract.prototype.reposeChildrens = function(parent, children, childrensOrder){

    }


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
            var prevNodeId = childrensOrder[pos-1];
            var nextNodeId = childrensOrder[pos+1];
            var curNodeId = childrensOrder[pos];


            prevNode = parent.getChildrenWithId(prevNodeId);
            nextNode = parent.getChildrenWithId(nextNodeId);
            curNode =  parent.getChildrenWithId(curNodeId);


            var newPos = this.calcChildPosition(parent, curNode, prevNode);



            curNode.getViewController().moveTo(newPos);


        }


        parent.getViewController().moveTo(this._calcParentPosition(parent, childrens, childrensOrder));

    }


    Default.prototype._calcParentPosition = function(parent, childrens, childrensOrder){
        var firstChildId = childrensOrder[0];
        var lastChildId = childrensOrder[childrensOrder.length-1];

        var curPos = new Position(parent.getPosition().getPosition());
        console.log(parent.getText(),curPos.getPosition());

        if (firstChildId && lastChildId){

            var firstChild = parent.getChildrenWithId(firstChildId);
            var lastChild = parent.getChildrenWithId(lastChildId);



            var yOffset = lastChild.getPosition().getPosition()['y'] - firstChild.getPosition().getPosition()['y'];
            console.log(yOffset);
            curPos.setDiff({'x': 0,'y':3    });
        }



        console.log(curPos.getPosition());
        return curPos;

    }

    return {
        'Default':Default
    }

}();

SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.notations.mindMap.building',
    function(){
        "use strict"


        var Default = SoCuteGraph.notations.mindMap.building.Default;
        var Position = SoCuteGraph.helpers.coordinates.Position;

        test ("Test settings propetyes of building strategy", function(){
            var def = new Default();


            var coords = ({'x':10,'y':20});

            def.setAttr('childOffsets', new Position(coords));

            equal(def.getAttr('childOffsets').getPosition(), (new Position(coords)).getPosition(), "getter return same value as setter");



        });


    }

)

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



