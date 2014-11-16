define(function () {
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

    PropertyesMixin.getAttrs = function (){
        var callbacks = this._attrsCallbacks;
        var dump = {};
        for (var property in callbacks){
            dump[property] = this.getAttr(property);
        }
        return dump;
    }

    PropertyesMixin.setAttrs = function (dump){
        var callbacks = this._attrsCallbacks;
        for (var property in callbacks){
            this.setAttr(property, dump[property]);
        }
        return this;
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


    var baseRequirePath = '/grapeng/grapheng';
    var requireJsFile = function(path){

        path = path.replace(/^SoCuteGraph/,baseRequirePath);

        console.log(path);
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = path;
        js.async = false;
        document.body.appendChild(js);
    }



    var isLoadedScriptChecket = function(){

    }




    var require = function (name, requireFunction){
        if (!requireFunction){
            requireFunction = requireJsFile;
        }
        var path = name.replace(/\.\w+$/,'');
        var path = path.replace(/\./g,'/') + '.js';
        requireFunction(path);

        var pathParts = name.split('.');

        var currentPart = window;
        for (var i in pathParts) {
            var part = pathParts[i];
            try{
                currentPart = currentPart[part];
            } catch (error){
                console.log(error);
            }
        };

        return currentPart;
    }

    var setRequireBasePath = function(path){
        baseRequirePath = path;
    }


    return {
        'each': each,
        'mixin': mixin,
        'PropertyesMixin':PropertyesMixin,
        'require':require
    };

});