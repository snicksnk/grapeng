require.config({
    baseUrl: "../../",
   	waitSeconds: 15
 });


require([
	"socute/coordinates/tests/position-test",
	"socute/coordinates/tests/area-test",
	"socute/elements/node/dependencies/tests/moveSlave-test",
	"socute/elements/node/basic/test/fullTest-test",
	"socute/elements/node/orders/tests/hierarhy-test"

	], 
	function(PositionTest, AreaTest, MoveSlave, HierarhyTest) {

	}
);