SoCuteGraph.nsCrete("elements.emptyElement.controllers");

SoCuteGraph.elements.emptyElement.controllers = (function () {
    "use strict";
    var AbstractController = SoCuteGraph.elements.abstractController.Controller;
    var Empty = function() {

    }

    Empty.prototype=new AbstractController();

    return {
        'Controller':Empty
    }

})();