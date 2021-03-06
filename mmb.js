SoCuteGraph.nsCrete('notations.mindMap');

SoCuteGraph.notations.mindMap = function () {

    var AbstractController = SoCuteGraph.elements.abstractController.Controller;
    var NodeViewController = SoCuteGraph.elements.basicNode.controllers.Controller;
    var Position = SoCuteGraph.helpers.coordinates.Position;
    var JoinLine = SoCuteGraph.elements.joinLine.controllers.Controller;

    var MoveSlave = SoCuteGraph.elements.basicNode.dependencies.MoveSlave;

    var MindMap = function (viewFactory, dispatcher) {
        this._nodeStorage = {};
        this._lastAddedNodeId = false;
        this._viewFactory = viewFactory;
        this._dispather = dispatcher;
        this._nodePathes = {};
        this._selectedNode = false;

        this.setUpKeyCodes();

    }


    MindMap.prototype = new AbstractController();

    MindMap.prototype.getLastAddedNodeId = function (){
        return this._lastAddedNodeId;
    }


    MindMap.prototype.setUpKeyCodes = function () {
        document.onkeypress =  zx;

        var that = this;

        function zx(e){
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode
            console.log(charCode)

            if (charCode == 105){
                that.addChildToSelectedNode();
            } else if (charCode == 120) {
                that.deleteSelectedNode();
            }
 
        }
    }

    MindMap.prototype.deleteSelectedNode = function(){
        var selectedNode = this._selectedNode;

        if (selectedNode){
            if (confirm('Are you sure you want to delete this thing?')){
                //this.addNode(newNodeText, selectedNde);
                selectedNode.remove();
            }
        }

    }

     MindMap.prototype.addChildToSelectedNode = function(){
        var selectedNde = this._selectedNode;

       if (selectedNde){
            var newNodeText = prompt('Enter name');



    MindMap.prototype.setSelectedNode = function(node){
        this._selectedNode = node;
    }

    MindMap.prototype.addNode = function (text, parentNode) {


        var node = this.nodeFactory(text, new Position({'x': 0, 'y': 0}));




        if (parentNode){
            var parentVC = parentNode.getViewController();
            var currentVC = node.getViewController();
            var joinLine = new JoinLine(this._viewFactory, parentVC, currentVC);
            this.getDispatcher().addObject(joinLine);


            node.setParentJoin(joinLine);

            parentNode.addChildren(node);


            new MoveSlave(this.getDispatcher(), parentNode.getViewController(), node.getViewController());


        } else {
            node.getViewController().setOrientation('multi');
        }

        return node;

    }



    MindMap.prototype.nodeFactory = function (text, position){

        var nodeViewController = new NodeViewController(text, this._viewFactory, position);
        this.getDispatcher().addObject(nodeViewController);

        Jaspecto.wrap(nodeViewController);

        var that = this;


        var node = new Node(nodeViewController);
        this.getDispatcher().addObject(node);
        var nodeId = node.getUniqueId();
        this._nodeStorage[nodeId] = node;
        node.setMindMap(this);
        this._lastAddedNode = node;


        nodeViewController.jas.after('click').advice('selectNode', function(){
            that.setSelectedNode(node);

        });



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
        this._parentJoin = false;

    }

    Node.prototype = new AbstractController();

    Node.prototype.setParentJoin = function (joinLine) {

        this._parentJoin = joinLine;

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



    SoCuteGraph.oLib.mixin(Abstract.prototype, SoCuteGraph.oLib.PropertyesMixin);



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


        parent.getViewController().moveTo(this._reposeParentToCenter(parent, childrens, childrensOrder));

    }


    Default.prototype._reposeParentToCenter = function(parent, childrens, childrensOrder){
        var firstChildId = childrensOrder[0];
        var lastChildId = childrensOrder[childrensOrder.length-1];

        var curPos = new Position(parent.getPosition().getPosition());


        if (firstChildId && lastChildId){

            var firstChild = parent.getChildrenWithId(firstChildId);
            var lastChild = parent.getChildrenWithId(lastChildId);



            var yOffset = lastChild.getPosition().getPosition()['y'] - firstChild.getPosition().getPosition()['y'];

            curPos.setDiff({'x': 0,'y':0   });
        }



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

                var paper = Raphael(document.getElementById('mm-canvas'), 1200, 1200);

                var mm = new MindMap(new Scene(paper) );

                disp.addObject(mm);

                var rootNode = mm.addNode('root node');

                mm.addNode('Первый ребенок',rootNode);

                mm.addNode('Второй ребенок',rootNode);


                var threeNode = mm.addNode('Третий ребенок',rootNode);

                mm.addNode('нода1',threeNode);
                var inclNode2 = mm.addNode('2',threeNode);

                mm.addNode('Вложенная нода1',inclNode2);
                mm.addNode('Вложенная нода2',inclNode2);

                mm.addNode('Четвертый ребенок',rootNode);

                ok('true');
            }
        );

    }
);



