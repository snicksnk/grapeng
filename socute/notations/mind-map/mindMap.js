"use strict";
define([
    "socute/elements/abstract/controller",
    "socute/elements/node/basic/controller",
    'socute/coordinates/position',
    'socute/elements/line/controller',
    'socute/elements/node/orders/hierarhy',
    'socute/notations/mind-map/node',
    "socute/oLib"], function(AbstractController, NodeViewController,
        Position, JoinLine, MoveSlave, Node, oLib){

    /*
    var AbstractController = SoCuteGraph.elements.abstractController.Controller;
    var NodeViewController = SoCuteGraph.elements.basicNode.controllers.Controller;
    var Position = SoCuteGraph.helpers.coordinates.Position;
    var JoinLine = SoCuteGraph.elements.joinLine.controllers.Controller;

    var MoveSlave = SoCuteGraph.elements.basicNode.dependencies.MoveSlave;

    */


    var MindMap = function (viewFactory, dispatcher) {
        this._nodeStorage = {};
        this._lastAddedNodeId = false;
        this._viewFactory = viewFactory;
        this._dispather = dispatcher;
        this._nodePathes = {};
        this._selectedNode = false;
        this._rootNode = false;
        this._freeMove = false;

    }


    MindMap.prototype = new AbstractController();

    MindMap.prototype.getRootNode = function () {
        return this._rootNode;
    }

    MindMap.prototype.scrollToCenter = function() {
        var rootNode = this.getRootNode();
        var center = this._viewFactory.getCenter();
        rootNode.getViewController().moveTo(center,true);

    }

    MindMap.prototype.getCentet = function (){
        return this._viewFactory.getCenter();
    }


    MindMap.prototype.getLastAddedNodeId = function (){
        return this._lastAddedNodeId;
    }

    MindMap.prototype.getSelectedNode = function(){
        var selectedNode = this._selectedNode;
        if (selectedNode){
            return selectedNode;
        }
        return null;
    }

    MindMap.prototype.findNode = function(selector, strict){
        if (selector instanceof Node) {
            return selector;
        }

        if (typeof selector['id'] !== 'undefined') {
            return this._nodeStorage[selector['id']];
        }

        if (strict){
            throw new Error('Undefined node');
        }

    }

    MindMap.prototype.launchCommand = function(commandDump){
        var command = commandDump[0];
        var params = commandDump[1];
        this[command].apply(this, params);
    }


    MindMap.prototype.editSelectedNode = function(dump){
        var selectedNode = this._selectedNode;
        if (selectedNode){
            this.editNode(selectedNode, dump);
        }
    }

    MindMap.prototype.editNode = function(node, dump){
        var node = this.findNode(node, true);
        node.setAttr('title', dump['title']);
        node.setAttr('color', dump['color']);
        //node.setAttr('imageUrl', dump['url']);
    }


    MindMap.prototype.deleteSelectedNode = function(){
        var selectedNode = this._selectedNode;
        if (selectedNode) {
            this.deleteNode(selectedNode);
        }
    }

    MindMap.prototype.deleteNode = function (node){
        var node = this.findNode(node);
        if (confirm('Are you sure you want to delete this thing?')){
            node.remove();
            //TODO Надо чистить рекурсивно
            //delete this._nodeStorage[node.getUniqueId()];
        }
    }

    
    MindMap.prototype.addChildToSelectedNode = function(nodeDump){
        var selectedNde = this._selectedNode;
        if (selectedNde){
            return this.addChild(selectedNde, nodeDump);   
        }
    }

    MindMap.prototype.clearPositions = function(nodeDump){
        //delete nodeDump['position'];
        //delete nodeDump['diffFromCalculatedPosition'];
        
        for(i in nodeDump['_childrens']) {
           var child = nodeDump['_childrens'][i];
           nodeDump['_childrens'][i] = this.clearPositions(child); 
        }  

        return nodeDump;
    }

    MindMap.prototype.addChild = function(parentNode, nodeDump){
        var parentNode = this.findNode(parentNode);
        var newNode = this.parseNodesDump(nodeDump, parentNode);
        parentNode.reposeChildrens();
        return newNode;
    }


    MindMap.prototype.setSelectedNode = function(node){
        this._selectedNode = node;
    }

    MindMap.prototype.addNode = function (text, parentNode) {

        var node = this.nodeFactory(parent);

        if (parentNode){
            var parentVC = parentNode.getViewController();
            var currentVC = node.getViewController();
            var joinLine = new JoinLine(this._viewFactory, parentVC, currentVC);
            this.getDispatcher().addObject(joinLine);


            node.setParentJoin(joinLine);
            parentNode.addChildren(node);



        } else {
            node.setIsParent(true);
            node.getViewController().setOrientation('multi');
            this._rootNode = node;

           // node.getViewController().moveTo(new Position());
        }

        this._nodeStorage[node.getUniqueId()] = node;

        return node;

    }



    MindMap.prototype.nodeFactory = function (parent){

        var text = 'new node';
        var position = new Position({'x':0,'y':0});
        var nodeViewController = new NodeViewController(text, this._viewFactory, position);
        this.getDispatcher().addObject(nodeViewController);

        var node = new Node(nodeViewController);

        var that = this;

        Jaspecto(nodeViewController).after('click').advice('selectNode', function(){
            that.setSelectedNode(node);
        });

        Jaspecto(nodeViewController).after('stopDrag').advice('savePositionDiff', function(){

            var calcPos = node.getCalculatedPosition();

            if (calcPos){
                node.setDiffFromCalculatedPosition(calcPos.getDiffWith(node.getPosition()));
            }

        });

        var freeMoveEnabled = false;
        Jaspecto(nodeViewController).after('startDrag').advice('ifFreeMoveStart', function(){
            if (that._freeMove==true){
                this.setIsSlaveAffects(false);
                freeMoveEnabled = true;
            }
        });

        Jaspecto(nodeViewController).after('stopDrag').advice('stopFreeMove', function(){
            if (freeMoveEnabled){
                this.setIsSlaveAffects(true);
            }
        });

        this.getDispatcher().addObject(node);


        return node;
    }

    MindMap.prototype.getPathOf = function (node) {
        return this._nodePathes[node.getUniqueId()];
    }


    MindMap.createFromDump = function (dump, scene, dispatcher) {


        var mm = new MindMap(scene);

        dispatcher.addObject(mm);

        var nodes = dump['nodes'];

        mm.parseNodesDump(nodes);

        return mm;
    }




    MindMap.prototype.parseNodesDump = function (nodesDump, parentNode){
        var that = this;
        var newNode;
        oLib.each(nodesDump, function(i, val){
            newNode = that.addNode(val['title'], parentNode);


            var reposeIsNeed = false;
            if (val['position']){
                newNode.setAttr('position',val['position']);
            } else {
                reposeIsNeed = true;
            }

            newNode.setAttr('title', val['title']);
            newNode.setAttr('color',val['color']);
            newNode.setAttr('diffFromCalculatedPosition', val['diffFromCalculatedPosition']);

            newNode.setAttr('orientation', val['orientation']);


            that.parseNodesDump(val['_childrens'], newNode);




            if (reposeIsNeed) {
                //newNode.reposeChildrens();
            }



            if (parentNode){
                var dep =new MoveSlave(that.getDispatcher(), parentNode.getViewController(), newNode.getViewController());
                newNode.setParentNodeDependecie(dep);
            }



            //n+=10;

            //console.log('-=-=-=-=',val['position']);
            //newNode.getViewController().moveTo(new Position({'x':10,'y':120+n}));

        });

        return newNode;

    }

    MindMap.prototype._parseNodeDump = function (nodeDump){

    }


    MindMap.prototype.setNodePathOf = function (node, parentNode){
        var nodeId = node.getUniqueId();
        if (parentNode) {
            this._nodePathes[nodeId] = this.getPathOf(parentNode).concat(nodeId);
        } else {
            this._nodePathes[nodeId] = {};
        }
    }

    MindMap.prototype.setFreeMove = function (freeMove) {
        this._freeMove = freeMove;
    }


    MindMap.getDump = function (dumped, notRoot) {
        var dump = {};

        if (notRoot){
            dump = dumped.getDump();
            return dump;
        } else {
            var rootNode = dumped.getRootNode();
            console.trace();
            return {'nodes':[MindMap.getDump(rootNode, true)]};
        }
    }

       var Backgroud = function(viewModel){
        this._viewModel = viewModel;
    }

    Backgroud.prototype = new AbstractController;

    Backgroud.prototype




    

    return MindMap;

});    