var mmListController = app.controller('mmListController',
	['$scope', '$modal', 'mindMaps', '$location', 
	function ($scope, $modal, $mindMaps, $location) {
		
		$mindMaps.fetchMaps().success(function(data, status, headers, config) {
      		$scope.items = data;
    	});

		$scope.select = function(id){
			$location.path('/map/'+id)
			
		}

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		$scope.create = function () {
			$mindMaps.createMap($scope.newName).success(function(data){
				console.log(data);
				var id = data.dump._id;
				$location.path('/map/'+id);
			})
		}

		$scope.delete = function (id) {
			if (confirm("Delete this?")){
				$mindMaps.del(id).success(function(){
						$mindMaps.fetchMaps().success(function(data, status, headers, config) {
			      		$scope.items = data;
			    	});
				});	
			}
		}
 
	}
	]
);