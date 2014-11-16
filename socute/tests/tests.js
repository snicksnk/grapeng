require.config({
    baseUrl: "../../",
   	waitSeconds: 15
 });


require([
	"socute/coordinates/tests/position-test",
	"socute/elements/node/dependencies/tests/moveSlave-test",
	"socute/elements/node/basic/test/fullTest-test"
	], 
	function(PositionTest, MoveSlave) {

	}
);