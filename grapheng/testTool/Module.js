SoCuteGraph.nsCrete('testTool.Module');

SoCuteGraph.testTool.Module=(function () {
    "use strict";


    var Tests = {};
    Tests.__tests=[];
    Tests.add = function(moduleName, testFunction){

        Tests.__tests[moduleName] = testFunction;


    };

    Tests.start = function(whiteList){
        var testName;

        for (testName in Tests.__tests){
            if (typeof whiteList === 'undefined' || typeof whiteList[moduleName] !== 'undefined' )
            {
                Tests.__tests[testName]();
            }
        };
    };
    return {'Tests': Tests};
})();


