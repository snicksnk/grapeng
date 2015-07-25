var app = angular.module('graph-ui', ['ui.bootstrap','ngRoute', 'colorpicker.module']);	

require.config({
    baseUrl: "grapeng",
   	waitSeconds: 15
 });



require([
		'socute/coordinates/position',
		'socute/notations/mind-map/ui/storage/mmList.ctrl'
	], 
	function(AbstractController, NodeViewController, Position, JoinLine, MoveSlave) {

		
	app.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'storage/templates/mm-list.html',
				controller: 'mmListController',
				resolve: {
					// I will cause a 1 second delay
					delay: function($q, $timeout) {
						alert('dsd');
		  				var delay = $q.defer();
		  				$timeout(delay.resolve, 10);

		  				return delay.promise;
					}
				}
			})
			.when('/map/:id', 
	    			{
	    				templateUrl: 'main-panel/templates/edit-map.html',
	    				controller: 'MainPannelController',
	    				resolve: {
							reload: function($rootScope, $timeout) {
			  					$rootScope.forceMapReload = true;
							}
						}
	    			}
	    		)
	    		.when('/good/create', 
	    			{
	    				templateUrl: '/templates/good/create.html',
	    				controller: 'GoodCreateController',
	    				resolve: {
	    					delay: function($q, $timeout){
	    						var delay = $q.defer();
	          					$timeout(delay.resolve, 10);
	          					return delay.promise;
	    					}
	    				}
	    			}
	    		)
	    		.when('/Book/:bookId/ch/:chapterId', {
	    			templateUrl: 'chapter.html',
	    			controller: 'ChapterController'
	    		});
	    	// configure html5 to get links working on jsfiddle
	    	//$locationProvider.html5Mode(true);
	  	});

	var goodsController = app.controller('GoodsController',
		['$scope', function(){
			
		}]
		);

	var buttonCtrl = app.controller('ButtonsCtrl',
		['$scope',
		function ($scope) {
			$scope.singleModel = 1;

			$scope.radioModel = 'Middle';

			$scope.checkModel = {
			left: false,
			middle: true,
			right: false
			};
		}
		]
	);

	app.factory('Jaspecto', function(){
	    return Jaspecto;
	});

});