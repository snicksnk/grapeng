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

    var animateCallback = function(getStartValue, getEndValue, time, onFinish){

        var startVal = getStartValue();
        var endValue = getEndValue();

    }

    var mixin = function (object, threat){
        for (var el in threat){

            var element = threat[el];

            object[el] = element;
        }
    }


    var PropertyesMixin = function () {
        throw new Error('Mixin is not instanceable');
    }


    PropertyesMixin._propetyesStorePrefix = '_attrs';


    PropertyesMixin.setAttr = function(name, value){
        if (typeof this._attrsCallbacks[name] === 'undefined'){
            throw new Error('Undefined property "'+name+'"');
        }



        this._attrsCallbacks[name].setter.call(this, name, value);
        return this;
    }

    PropertyesMixin.getAttr = function(name){
        if (typeof this._attrsCallbacks[name] === 'undefined'){
            throw new Error('Undefined property "'+name+'"');
        }

        return this._attrsCallbacks[name].getter.call(this, name);
    }


    PropertyesMixin._addAttr = function(name, defaultValue, setter, getter) {

        if (typeof this._attrsCallbacks === 'undefined'){
            this._attrsCallbacks = {};
            this[this._propetyesStorePrefix] = {};
        }


        if (!setter){
            setter = this._defaultSetter;
        }

        if (!getter){
            getter = this._defaultGetter;
        }

        this._attrsCallbacks[name] = {};
        this._attrsCallbacks[name].setter = setter;
        this._attrsCallbacks[name].getter = getter;
        this._attrsCallbacks[name].setter.call(this, name, defaultValue);
    }

    PropertyesMixin._defaultGetter = function(name) {
        return this[this._propetyesStorePrefix][name];
    }


    PropertyesMixin._defaultSetter = function(name, value) {
        this[this._propetyesStorePrefix][name] = value;
        return this;
    }





    return {
        'each': each,
        'mixin': mixin,
        'PropertyesMixin':PropertyesMixin
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

        test("mixin test", function(){
            var Obj = function(){
                this.i = 1;
            };


            var Mixin = function(){

            };

            Mixin.addToI = function(){
                this.i++;
            };


            SoCuteGraph.oLib.mixin(Obj.prototype, Mixin);

            var instance = new Obj();

            instance.addToI();

            equal(2, instance.i, 'Mixin method works');
        });

        test("propertyes", function(){
            var Obj = function(){
                this.defineAttrs();
            };

            Obj.prototype.defineAttrs = function(){
                this._addAttr('height', null);
                this._addAttr('width',null);
            }

            SoCuteGraph.oLib.mixin(Obj.prototype, SoCuteGraph.oLib.PropertyesMixin)


            var instance = new Obj();

            instance.setAttr('width', 1000);
            instance.setAttr('height', 25);

            equal(instance.getAttr('width'),1000, 'First attr setted and getted properly');
            equal(instance.getAttr('height'),25, 'Second attr setted and getted properly');

        });

    });



