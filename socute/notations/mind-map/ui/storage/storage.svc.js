app.factory('mindMaps', function ($http) {
	var currentMapId = null;
	var isCurrentMapId = false;
	return {
		fetchMaps: function () {
			return $http.get('/storage/maps');
		},
		getMap: function (id) {

			currentMapId = id;
			var result = $http.get('/storage/map/'+id);
			return result;

		},
		saveMap: function (id, dump) {
			var json = JSON.stringify(dump);
			alert(json);
			$http.post('/storage/map/save/'+id, json);
		},
		createMap: function (name){
			return $http.get('/storage/maps/create/'+name);
		},
		del: function(id){
			return $http.get('/storage/delete/'+id);
		}	
	}
});
