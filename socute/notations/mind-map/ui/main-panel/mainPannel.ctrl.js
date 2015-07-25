app.controller('MainPannelController',
	[

	'$scope', '$modal', 'mindMaps', '$location', '$routeParams', 'Jaspecto', 'mmCanvas',
	function ($scope, $modal, $mindMaps, $location, $routeParams, Jaspecto, mmCanvas) {


		



		var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;
        var MindMap = SoCuteGraph.notations.mindMap.Map;
        var Node = SoCuteGraph.notations.mindMap.Node;
        var disp = new SoCuteGraph.events.dispatchers.Dispatcher;

       
        	
  		var mmId;
      	var mm;

      	$scope.loadMap = function(){
      		var scene = mmCanvas.getCanvas();
      		mmId = $routeParams.id;
      		$mindMaps.getMap(mmId)
	        .success(function(data){
	        	var mmDump = JSON.parse(data[0]['json']);
	        	mm = MindMap.createFromDump(mmDump, scene, disp);
	        	Jaspecto(mm).after('setSelectedNode').advice('afterSelectNode', function(node){
	        		var dump = node.getDump(true);
	        		$scope.currentNode = dump;
	        		$scope.showPannel = true;
	        		$scope.$apply(); 
	        		$scope.selectNode();
	        	});
	        	$scope.center();

	        	window.mm = mm;
	        	
	        });
			$scope.showPannel = false;	

		};


        




        var defaultNodeDump = {
	            "title": 'new node',
	            "color": "#73ed76",
	            "orientation":'right',
	            "_childrens":[

	            ]
        	};

        $scope.currentNode = defaultNodeDump;

        var buffer;

        $scope.selectNode = function(){
        	$('.edit-form-name').focus();
        }

		$scope.open = function(){
			$location.path('/'); 
			/*
			$scope.items = ['ssa','sasa'];
			var modalInstance = $modal.open({
				templateUrl: '/template/modal.html',
				controller: ModalInstanceCtrl,	
				resolve: {
				items: function () {
						return $mindMaps.fetchMaps()
					}
				}
			});
			*/
		}

		$scope.center = function(){
			mm.scrollToCenter();
		}


		$scope.save = function(){
			var dump = MindMap.getDump(mm);

			$mindMaps.saveMap(mmId, dump);
		}

		$scope.addChild = function(dump){

			if (dump){
				var dump = [dump]	
			} else {
				var dump = [defaultNodeDump]
			}

			var newNode = mm.addChildToSelectedNode(dump);

			mm.setSelectedNode(newNode);
			$('.edit-form-name').focus();
		}

		$scope.$watch('currentNode.title', function(oldVal, newVal){
			$scope.saveNode();
		});

		$scope.$watch('currentNode.color', function(oldVal, newVal){
			$scope.saveNode();
		});

		$scope.$watch('currentNode.imageUrl', function(oldVal, newVal){
			$scope.saveNode();
		});

		$scope.$watch('currentNode.linkUrl', function(oldVal, newVal){
			$scope.saveNode();
		});

		$scope.saveNode = function(){
			var nodeDump = $scope.currentNode;
			if (mm){
        		mm.editSelectedNode(nodeDump);
        	}
		}

		$scope.add = function(){
			$('.edit-form-name').focus();
		}


		$scope.copy = function(){
			var currentNodeDump = mm.getSelectedNode().getDump();
			buffer = mm.clearPositions(currentNodeDump);
		}

		$scope.cut = function(){
			var currentNodeDump = mm.getSelectedNode().getDump();
			buffer = mm.clearPositions(currentNodeDump);
			mm.deleteSelectedNode();
		}




		$scope.paste = function(){
			console.log(buffer);
			$scope.addChild(buffer);
		}


		var listener = new window.keypress.Listener();
		
		listener.simple_combo("ctrl s", function() {
            that.save();
        });

        listener.register_combo({
    		"keys"              : "shift",
    		"on_keydown"        : function(){
        		mm.setFreeMove(true);
    		},
    		"on_keyup"          : function(){
        		mm.setFreeMove(false);
    		}
        });

        listener.register_combo({
            "keys"              : "delete",
            "on_keydown"        : function(){
                mm.deleteSelectedNode();
            }
        });


        listener.register_combo({
            "keys"              : "tab",
            "on_keydown"        : function(){
                $scope.addChild();
            }
        });


        listener.register_combo({
            "keys"              : "ctrl c",
            "on_keydown"        : function(){
                $scope.copy();
            }
        });

        listener.register_combo({
            "keys"              : "ctrl v",
            "on_keydown"        : function(e){
                $scope.paste();
                console.log(e);
                e.preventDefault();
            }
        });


         listener.register_combo({
            "keys"              : "ctrl x",
            "on_keydown"        : function(){
                $scope.cut();
            }
        });





        	
	}
	]
);


app.controller('BottomPannelController',
	[

	'$scope', '$modal', 'mindMaps', '$location', '$routeParams', 'Jaspecto', 'mmCanvas',
	function ($scope, $modal, $mindMaps, $location, $routeParams, Jaspecto, mmCanvas) {

	}
	]
);


var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

	$scope.items = items;
	$scope.selected = {
	};


	$scope.items = items.data;

	$scope.select = function(id){
		$modalInstance.close($scope.selected.item);
	}

	$scope.ok = function () {
		$modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

};

