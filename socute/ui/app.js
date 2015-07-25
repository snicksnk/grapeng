'use strict';
define([
	'angular',
	'ngRoute',
	'socute/ui/modules/mm/main-pannel',
	'socute/ui/modules/mm/mm-canvas.svc',
	'socute/ui/modules/mm/mm-list.ctrl',
	'socute/ui/modules/mm/mindMaps.svc',
	], function(ng, route, mainPannel, mmCanvas, mmList, mindMaps) {
	var module = ng.module('graph-ui', ['ngRoute', 'ui.bootstrap', /*'ngMockE2E''ui.splash'*/])

	module.factory("mindMaps", mindMaps);
	/*module.factory('GoodsInOrder', GoodsInOrderSvc);*/
	
	module.factory("mmCanvas", mmCanvas);

	module.controller("mmListController", mmList);



	module.controller('MainPannelController', mainPannel);
	/*module.controller("print", printCtrl);*/

	module.factory('Jaspecto', function(){
		return Jaspecto;
	});

	module.config(function($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: '/grapeng/socute/ui/modules/mm/views/mm-list.html',
					controller: 'mmListController',
					resolve: {
						// I will cause a 1 second delay
						delay: function($q, $timeout) {
			  				var delay = $q.defer();
			  				$timeout(delay.resolve, 10);

			  				return delay.promise;
						}
					}
				})
				.when('/map/:id', 
		    			{
		    				templateUrl: '/grapeng/socute/ui/modules/mm/views/edit-map.html',
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
		    				templateUrl: '/grapeng/socute/ui/modules/mm/views/create.html',
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

	return module;
});