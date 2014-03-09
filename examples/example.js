window.onload = function(){
    //Внедряем зависимости

    //Класс обмена событиями между элементами
    var Dispatcher = SoCuteGraph.events.dispatchers.Dispatcher;
    //Класс позиционирования
    var Position = SoCuteGraph.helpers.coordinates.Position;
    //Контроллер вершин (элементов схемы)
    var Node = SoCuteGraph.elements.basicNode.controllers.Controller;
    //
    var Element = SoCuteGraph.elements.basicNode.viewModel.ViewModel;
    //Контроллер соединений между вершинами
    var Line = SoCuteGraph.elements.joinLine.controllers.Controller;
    //Абстрактная фабрика для визуализации с помощью RaphaelJS
    var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;

    //var Animation = SoCuteGraph.elements.animation.controllers.Animation;
    //var MoveSlave = SoCuteGraph.elements.basicNode.dependencies.MoveSlave;

    //Создаем холст RaphaelJs на месте <div id="canvas-example-1"></div>
    var paper = Raphael(document.getElementById('canvas-example-1'), 720,480 );
    //Создаем инстанс абстрактной фабрики виузуализации
    var scene = new Scene(paper);
    //Создаем инстанс диспатчера
    var disp = new Dispatcher();

    //Создаем класс центральной ноды
    var soCute = new Node('SoCuteGraph', scene, new Position({'x':250,'y':250}));
    //Добавляем ноду в диспатчер событий
    disp.addObject(soCute);
    //Указываем двунаправленную оринтацию ноды
    soCute.setOrientation(Element.ORIENTED_MULTI);

    //Создаем ноду helpers
    var helpers = new Node('helpers', scene, new Position({'x':130,'y':150}));
    //Добавляем в диспатчер
    disp.addObject(helpers);
    //Делаем ноду лево орентированной (т.к. она по левую сторону от центральной)
    helpers.setOrientation(Element.ORIENTED_LEFT);

    //Создаем соединение между центральной нодой SoCuteGraph и нодой helpers
    var joinLine1 = new Line(scene, soCute, helpers);
    disp.addObject(joinLine1);


    var position = new Node('Position', scene, new Position({'x':10,'y':50}));
    disp.addObject(position);
    position.setOrientation(Element.ORIENTED_LEFT);

    var joinLine2 = new Line(scene, helpers, position);
    disp.addObject(joinLine2);

    var events = new Node('events', scene, new Position({'x':380,'y':150}));
    disp.addObject(events);

    var joinLine3 = new Line(scene, soCute, events);
    disp.addObject(joinLine3);

    var dispatchers = new Node('dispatchers', scene, new Position({'x':475,'y':50}));
    disp.addObject(dispatchers);

    var joinLine4 = new Line(scene, events, dispatchers);
    disp.addObject(joinLine4);

    var dispatcher = new Node('Dispatcher', scene, new Position({'x':600,'y':10}));
    disp.addObject(dispatcher);

    var joinLine11 = new Line(scene, dispatchers, dispatcher);
    disp.addObject(joinLine11);


    var std = new Node('std', scene, new Position({'x':480,'y':250}));
    disp.addObject(std);

    var joinLine5 = new Line(scene, events, std);
    disp.addObject(joinLine5);

    var moveEvent = new Node('MoveEvent', scene, new Position({'x':570, 'y':170}));
    disp.addObject(moveEvent);

    var joinLine6 = new Line(scene, std, moveEvent);
    disp.addObject(joinLine6);


    var frameEvent = new Node('FrameEvent', scene, new Position({'x':570, 'y':290}));
    disp.addObject(frameEvent);

    var joinLine7 = new Line(scene, std, frameEvent);
    disp.addObject(joinLine7);


    var elements = new Node ('elements', scene, new Position({'x':130,'y':380}));
    disp.addObject(elements);
    elements.setOrientation(Element.ORIENTED_LEFT)

    var joinLine8 = new Line(scene, soCute, elements);
    disp.addObject(joinLine8);

    var basicNode = new Node('BasicNode', scene, new Position({'x':10,'y':320}));
    disp.addObject(basicNode);
    basicNode.setOrientation(Element.ORIENTED_LEFT);

    var joinLine9 = new Line(scene, elements, basicNode);
    disp.addObject(joinLine9);

    var joinLine = new Node('JoinLine', scene, new Position({'x':15,'y':420}));
    disp.addObject(joinLine);
    joinLine.setOrientation(Element.ORIENTED_LEFT);

    var joinLine10 = new Line(scene, elements, joinLine);
    disp.addObject(joinLine10);

    //Стилизуем центральную ноду

    //Получаем Raphael View блока
    var centerView=soCute.getViewObject().frame.getRaphaelElement();

    //Получаем Raphael View Текста
    var centerText=soCute.getViewObject().text.getRaphaelElement();

    centerText.attr("font-family",'Arial');
    centerText.attr("font-weight",'bold');
    centerText.attr("font-size",'13');

    centerView.attr("fill", "#FFEC73");
    centerView.attr("fill-opacity",0.5);
    centerView.attr("stroke", "#A68F00");
    centerView.attr("r", 10);
    soCute.redraw();

    //Стилизуем ноды, обозначающие классы

    //Реализуем простую функцию, которая будет выполнять стилизацию
    function stylizeClass(controller){
        //Получаем Raphael View блока
        var frameView=controller.getViewObject().frame.getRaphaelElement();

        //Получаем Raphael View Текста
        var textView=controller.getViewObject().text.getRaphaelElement();

        textView.attr("font-family",'Arial');

        frameView.attr("fill", "#f4c996");
        frameView.attr("fill-opacity",1);
        frameView.attr("stroke", "#A68F00");
        frameView.attr("r", 10);
        controller.redraw();
    }

    //Применяем функцию к нодам-классам
    stylizeClass(basicNode);
    stylizeClass(joinLine);
    stylizeClass(position);
    stylizeClass(moveEvent);
    stylizeClass(frameEvent);
    stylizeClass(dispatcher);


};