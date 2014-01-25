SoCuteGraph.nsCrete("oLib");

SoCuteGraph.oLib = (function () {
    "use strict";

    var each = function (obj, callback) {
        var value,
        i = 0,
        length = obj.length;

        for (i in obj) {
            value = callback.call(obj[i], i, obj[i], obj);
            if ( value === false ) {
                break;
            }
        }
        return obj;
	};

    return {
        'each': each
    };

})();


SoCuteGraph.testTool.Module.Tests.add('SoCuteGraph.oLib',
    function(){
        test( "Test each with array", 
        	function() {
                var ar = [10,20,30,40];
                var newAr=[];
                SoCuteGraph.oLib.each(ar, function(key, val){
                    newAr[key]=val;
                });
               deepEqual(newAr, ar, 'Generated each array equals to prototype');
    		});

        test("Test changin propertyes in object with each",
            function() {
                var obj = {'a':2,'b':3,'c':4};
                var resObj = {'a':4, 'b':6, 'c':8};
                SoCuteGraph.oLib.each(obj, function(key, val, subj){
                    subj[key] = val * 2;
                });

                deepEqual(obj, resObj, "Object modification processed properly");

            });
    });



