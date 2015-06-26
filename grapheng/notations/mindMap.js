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
        SoCuteGraph.oLib.each(nodesDump, function(i, val){
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

    SoCuteGraph.oLib.mixin(Node.prototype, SoCuteGraph.oLib.PropertyesMixin);



    return {
        'Map': MindMap,
        'Node': Node
    }

}();



SoCuteGraph.notations.mindMap.ui = function () {

    var MindMap = SoCuteGraph.notations.mindMap.Map;

    var AbstractController = SoCuteGraph.elements.abstractController.Controller;

    var Basic = function (scene, app){
        this._scene = scene;
        this._app = app;
        this._shiftPressed = false;
        this._nodeDialogMode = false;
    }

    Basic.prototype = new AbstractController();

    Basic.prototype.setUpApp = function (mindMap){
        /*
        var uiModel = this;

        var app = angular.module('mind', ['ui.bootstrap']);


        /*
        var pannel = app.controller('mainPannel', ['$scope', function($scope){
            $scope.add = function(){
                   uiModel.addNode(mindMap);
            };

            $scope.open = function(){
                uiModel.load();
            };

            $scope.save = function(){
                uiModel.save(mindMap);
            };

            $scope.edit = function(){
                uiModel.editSelectedNode(mindMap);
            };

            this.showPopover = function(){

            }
        }]);

        function setDefaultValues($scope){
            $scope.name = "";
            $scope.color = "cyan";
            $scope.orientation = 'right';
        }


        var that = this;


        var listener = new window.keypress.Listener();
        
        listener.simple_combo("ctrl s", function() {
            that.save(mindMap);
        });

        listener.simple_combo("ctrl l", function() {
            that.load();
        });

        listener.simple_combo("ctrl e", function() {
            that.editSelectedNode(mindMap);
        });


        listener.simple_combo("shift", function() {
        });

        listener.register_combo({
            "keys"              : "shift",
            "on_keydown"        : function(){
                mindMap.setFreeMove(true);
            },
            "on_keyup"          : function(){
                mindMap.setFreeMove(false);
            }
        });




        listener.register_combo({
            "keys"              : "delete",
            "on_keydown"        : function(){
                mindMap.deleteSelectedNode();
            }
        });


        var NodeFormEditController = app.controller('NodeFormEditController',
            ['$scope',function($scope) {

                $scope.modalMode = that._nodeDialogMode;


            }]);



        var NodeFormCreateController = app.controller('NodeFormCreateController',
            ['$scope',function($scope) {
                setDefaultValues($scope);

                $scope.isCreate = '--';


                var mode = 'editing';

                listener.register_combo({
                    "keys"              : "insert",
                    "on_keydown"        : function(){
                        console.log('sasa');
                        $scope.isCreate = true;
                        that.addNode(mindMap);
                    }
                });


                $scope.save = function(){
                    var nodeData = [{"title":"hello","color":"yssello","orientation":"right","_childrens":[]}];
                    nodeData[0].title = $scope.name;
                    nodeData[0].color = $scope.color;
                    nodeData[0].orientation = $scope.orientation;


                    console.log($scope.isEdit);

                    if ($scope.isEdit==1){
                        alert('editing');
                    } else {
                        alert('creating');
                    }


                    //TODO Fix hack
                    mindMap.addChildToSelectedNode(nodeData);


                    $('#myModal').modal('hide');



                   setDefaultValues($scope);

                }

            }]
        );





        angular.resumeBootstrap();

        */



    }

    Basic.prototype.setUpKeys = function (mindMap) {

        var that = this;


        this.setUpApp(mindMap);

    }


    Basic.prototype.save = function (mindMap) {
        var dump = MindMap.getDump(mindMap);

        alert(JSON.stringify(dump));

    }

    Basic.prototype.editSelectedNode = function(mindMap){
        var selectedNode = mindMap.getSelectedNode();

        if (selectedNode){

            var selectedNodeDump = selectedNode.getAttrs();

            $('#nodeText').val(JSON.stringify(selectedNodeDump));


            this._nodeDialogMode = 'edit';
            $('#myModal').modal('show');

            /*
            $('#nodeDataSave').click(function(e){
                var nodeDump = JSON.parse($('#nodeText').val());
                selectedNode.setAttrs(nodeDump);
                $('#nodeDataSave').unbind('click');
                $('#myModal').modal('hide');
            });
            */

        }


    }
/*
    $(function ()
    {

    $('.main-panel button').popover(
        {
            trigger: 'manual',
            title: "save",
            html: true,
            placement: 'right',
            content: 'hello world'
        });
    }).click(function(e){
        $('.popover').hide();
        console.log(e.target);
        $(e.target).popover('toggle');
    }).hover(function(e){
        $(this).popover('hide');
    });

    $('.popover').blur(function(){
        alert('sasa');
    })


    $('.main-panel button').blur(function(){
       $(this).popover('hide');
    });

*/

    Basic.prototype.load = function () {

        var dump = JSON.parse(prompt("enter mm dump"));

        this._scene.clear();

        var mm = MindMap.createFromDump(dump, this._scene, this.getDispatcher());

        this.setUpKeys(mm);

    }

    Basic.prototype.addNode = function (mindMap) {

        var sourceNodeDump =  [{
            "title": '',
            "color": "yello",
            "orientation":'right',
            "_childrens":[

            ]
        }];

        this._nodeDialogMode = 'create';
        $('#myModal').modal('show');

        $('#nodeText').val(JSON.stringify(sourceNodeDump));
        $('#isEdit').val(0);
        $('#nodeDataSave').click(function(e){
            /*
            $('#nodeText').focus();
            var nodeDump = JSON.parse($('#nodeText').val());
            mindMap.addChildToSelectedNode(nodeDump);
            $('#nodeText').val('');
            $('#nodeDataSave').unbind('click');
            $('#myModal').modal('hide');
            */
        });






    }

    return {
        'Basic':Basic
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

        SoCuteGraph.oLib.each(childrens, function(i,child){

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
        var Ui = SoCuteGraph.notations.mindMap.ui.Basic;



        var paper;

        test("create from notation", function(){

            var mmDump = {
                "nodes":[
                    {
                        "title":"Mother node",
                        "position":{'x':120,'y':30},
                        "color":"#FFEC73",
                        "_childrens":[
                            {
                                "title":"Children 1",
                                "_childrens":[
                                    {
                                        "title":"Children 1 of 1",
                                        "_childrens":[

                                        ]
                                    },
                                    {
                                        "title":"Children 2 of 1",
                                        "_childrens":[

                                        ]
                                    }

                                ]
                            },
                            {
                                "title":"Children 2",
                                "position":{'x':300,'y':330},

                                "_childrens" : [

                                ]
                            },


                        ]
                    }
                ]
            };




            var mmDump ={
                "nodes":[
                    {
                        "title":"Mother node",
                        "_childrens":[
                            {
                                "title":"Children 1",
                                "_childrens":[
                                    {
                                        "title":"Children 1 of 1",
                                        "_childrens":[],
                                        "position":
                                        {
                                            "x":644,
                                            "y":22
                                        },
                                        "diffFromCalculatedPosition":false,
                                        "color":"#FFEC73"
                                    },
                                    {
                                        "title":"Children 2 of 1",
                                        "_childrens":[],
                                        "position":
                                        {
                                            "x":636,
                                            "y":199
                                        },
                                        "diffFromCalculatedPosition":false,
                                        "color":"#FFEC73"
                                    }
                                ],
                                "position":
                                {
                                    "x":354,
                                    "y":64
                                },
                                "diffFromCalculatedPosition":false,
                                "color":"#FFEC73"
                            },
                            {
                                "title":"Children 2",
                                "_childrens":[],
                                "position":{
                                    "x":300,"y":330},"diffFromCalculatedPosition":false,"color":"#FFEC73"}],"position":{"x":120,"y":30},"diffFromCalculatedPosition":false,"color":"red"}]} ;

            var paper = Raphael(document.getElementById('mm-canvas'), 1200, 600);

            var scene = new Scene(paper);

            var ui = new Ui(scene);



            disp.addObject(ui);


            var mm = MindMap.createFromDump(mmDump, scene, disp);

            ui.setUpKeys(mm);

            deepEqual(mmDump, MindMap.getDump(mm), 'Dump of created map equls to source');



        });


        /*
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
        */

    }
);



