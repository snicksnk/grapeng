var Jaspecto = function () {
    "use strict";
    var wrap = function (subject) {
        subject.jas = new Introducer(subject);
        return subject;
    };

    var jas = function (subject) {
        if (!subject.hasOwnProperty('jas')){
            wrap(subject);
        }

        return subject.jas;
    }

    var Introducer = function (subject) {
        this._subject = subject;
        this._pointcut = {};
        this._originalMethods = {};
    };

    /*
    Introducer.prototype.callBeforeStack = function(method, args) {
        this.callStack(method, 'before', args);
    };

    Introducer.prototype.callAfterStack = function(method, args) {
        this.callStack(method, 'after', args);
    }
    */

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

    Introducer.prototype.callStack = function(methodName, stackName, args) {
        var aspect;

        var stack = this._pointcut[methodName][stackName];
        for(aspect in stack) {
            stack[aspect]['callback'].apply(this._subject, args);
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
                that.addToStack(methodName,'before',aspectName,aspectCallback);
                return that;
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
                return that;
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
            //that.callBeforeStack(methodName, arguments);
            that.callStack(methodName, 'before', arguments);
            that._originalMethods[methodName].apply(that._subject, arguments);
            //that.callAfterStack(methodName, arguments);
            that.callStack(methodName, 'after', arguments);
        }
    }


    jas.wrap = wrap;

    return jas;



}();


SoCuteGraph.testTool.Module.Tests.add('Jaspecto',
    function(){
        "use strict";
        var A = function () {
            this.a = 1;
            this.b = 2;
        };

        A.prototype.setA = function (val) {
            this.a = val;
        }

        A.prototype.setB = function (val) {
            this.b = val;
        }


        test( "Test wrap object",
            function() {

                var a =new A;

                a.setA(32);

                var newA =  Jaspecto.wrap(a);

                var beforeWasCalled = false;
                var afterWasCalled = false;
                newA.jas.before('setA').advice('beforeAdvice', function(val){
                    equal(3,val,'before advice called with properly value');
                    beforeWasCalled = true;
                });

                newA.jas.after('setA').advice('afterAdvice', function(val){
                    equal(3,val,'after advice called with properly value')
                    afterWasCalled = true;
                });


                newA.setA(3);

                ok(beforeWasCalled, 'Before was called');
                ok(afterWasCalled, 'After was called');


            }
        );

        test ("many aspects", function(){
            var a = new A;
            Jaspecto.wrap(a);

            var advice1compl = false;
            var advice2compl = false;
            var advice3compl = false;
            var advice4compl = false;
            a.jas.before('setB').advice('beforeBFirst', function(){
                advice1compl = true;
            }).before('setB').advice('beforeBSecond', function(){
                advice2compl = true;
            }).after('setA').advice('afterAFirst', function(){
                advice3compl = true;
            }).after('setA').advice('afterASecond', function(){
                advice4compl = true;
            });

            a.setA(2);
            a.  setB(3);

            ok(advice1compl, 'Advice 1 is ok');
            ok(advice2compl, 'Advice 2 is ok');
            ok(advice3compl, 'Advice 3 is ok');
            ok(advice4compl, 'Advice 4 is ok');




        });
    }
);


