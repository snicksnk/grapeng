var Jaspecto = function () {
    "use strict";
    var wrap = function (subject) {
        subject.jas = new Introducer(subject);
        return subject;
    };

    var Introducer = function (subject) {
        this._subject = subject;
        this._pointcut = {};
        this._originalMethods = {};
    };

    Introducer.prototype.callBeforeStack = function(method, args) {
        this.callStack(method, 'before', args);
    };

    Introducer.prototype.callAfterStack = function(method, args) {
        this.callStack(method, 'after', args);
    }

    Introducer.prototype.addToStack = function(methodName, stack, aspectName, aspectCallback) {

        if (typeof this._subject[methodName] !== "function") {
            throw new Error('Object has no method "' + methodName + '"');
        }

        if (!this.wasWrapped(methodName)){
            this.wrapMethod (methodName);
        }

        if (typeof this._pointcut[methodName][stack] === 'undefined') {
            this._pointcut[methodName][stack] = [];
        }
        this._pointcut[methodName][stack].push({'name':aspectName,'callback':aspectCallback});
    }

    Introducer.prototype.callStack = function(methodName, stack, args) {
        var aspect;
        for(aspect in this._pointcut[methodName][stack]) {
            console.log(this._pointcut[methodName][stack][aspect]);
            this._pointcut[methodName][stack][aspect]['callback'].apply(this._subject, args);
        }
    }

    Introducer.prototype.wasWrapped = function(methodName) {
        if (typeof this._subject[methodName] !== "function") {
            throw new Error('Object has no method "' + methodName + '"');
        }

        if (typeof this._pointcut[methodName] === 'undefined') {
            return false;
        } else {
            return true;
        }
    }

    Introducer.prototype.before = function (methodName) {
        if (!this.wasWrapped(methodName)) {
            this.wrapMethod(methodName);
        }

        var that = this;
        return {
            'advice':function (aspectName, aspectCallback) {
                that.addToStack(methodName,'before',aspectName,aspectCallback)
            }
        };
    };

    Introducer.prototype.after = function (methodName) {

        if (!this.wasWrapped(methodName)) {
            this.wrapMethod(methodName);
        }

        var that = this;
        return {
            'advice':function (aspectName, aspectCallback) {
                that.addToStack(methodName,'after', aspectName, aspectCallback)
            }
        };
    };



    Introducer.prototype.wrapMethod = function (methodName) {
        if (typeof this._pointcut[methodName] === 'undefined') {
            this._pointcut[methodName] = {};
        }
        this._originalMethods[methodName] = this._subject[methodName];
        var that = this;
        this._subject[methodName] = function () {
            that.callBeforeStack(methodName, arguments);
            that._originalMethods[methodName].apply(that._subject, arguments);
            that.callAfterStack(methodName, arguments);
        }

    }


    return {
        'wrap':wrap
    }

}();


SoCuteGraph.testTool.Module.Tests.add('Jaspecto',
    function(){
        "use strict";
        var A = function () {
            this.a = 1;
            this.b = 2;
        };

        A.prototype.addToA = function (val) {
            this.a = val;
        }
        

        test( "Test wrap object",
            function() {

                var a =new A;

                a.addToA(32);

                var newA =  Jaspecto.wrap(a);

                var beforeWasCalled = false;
                var afterWasCalled = false;
                newA.jas.before('addToA').advice('beforeAdvice', function(val){
                    equal(3,val,'before advice called with properly value');
                    beforeWasCalled = true;
                });

                newA.jas.after('addToA').advice('afterAdvice', function(val){
                    equal(3,val,'after advice called with properly value')
                    afterWasCalled = true;
                });


                newA.addToA(3);

                ok(beforeWasCalled, 'Before was called');
                ok(afterWasCalled, 'After was called');


            }
        );
    }
);


