requirejs.config({
    shim: {
        'jquery': {
            exports: 'jQuery',
        }
    }
});



require(["helper/utils"], function(util) {

    console.log(util);

});