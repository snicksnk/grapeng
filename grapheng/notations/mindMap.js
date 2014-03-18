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


        var node = this.nodeFactory(text, new Position({'x': 30, 'y': Math.random()*130}));

        if (parentNode){
            var parentVC = parentNode.getViewController();
            var currentVC = node.getViewController();
            var joinLine = new JoinLine(this._viewFactory, parentVC, currentVC);
            this._dispather.addObject(joinLine);

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
    }

    Node.prototype = new AbstractController();


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
            }
        );

    }
);


