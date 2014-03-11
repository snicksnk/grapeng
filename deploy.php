<?php
ini_set('display_errors', true);
spl_autoload_register(function ($class) {
    require_once 'CodeGlue/classes/' . $class . '.php';
});
$glue = new codeGlue('CodeGlue/config.php');
$glue->flushCash();
$glue->glueEnable = true;
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <link href='https://fonts.googleapis.com/css?family=Chivo:900' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="demo-data/stylesheets/stylesheet.css" media="screen" />
    <link rel="stylesheet" type="text/css" href="demo-data/stylesheets/pygment_trac.css" media="screen" />
    <link rel="stylesheet" type="text/css" href="demo-data/stylesheets/print.css" media="print" />
    <!--[if lt IE 9]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <script type="text/javascript" src="http://yandex.st/jquery/2.1.0/jquery.min.js"></script>
    <?= $glue->genIncluder('socutegraph') ?>
    <?= $glue->genIncluder('raphael') ?>
    <script src="examples/example.js"></script>
    <title>So Cute Graph by snicksnk</title>
    <style>
        #canvas-example-1{
            height: 480px;
            width: 620px;
        }
    </style>
</head>

<body>
<div id="container">
    <div class="inner">

        <header>
            <h1>SoCuteGraph <span>(alpha)</span></h1>
            <h2>Библиотека браузерной визуализации графовых структур</h2>
        </header>

        <section id="downloads" class="clearfix">
            <a href="https://github.com/snicksnk/grapeng/zipball/master" id="download-zip" class="button"><span>Source .zip</span></a>
            <a href="https://github.com/snicksnk/grapeng/tarball/master" id="download-tar-gz" class="button"><span>Source .tar.gz</span></a>
            <a href="https://github.com/snicksnk/grapeng" id="view-on-github" class="button"><span>View on GitHub</span></a>
        </section>

        <hr>

        <section id="main_content">
            <h3>
                <a name="welcome-to-github-pages" class="anchor" href="#welcome-to-github-pages">
                    <span class="octicon octicon-link"></span>
                </a>Демо (структура библиотеки)
            </h3>

            <p>
                Любой элемент можно перетащить
            </p>


            <div id="canvas-example-1"></div>

            <script>

            </script>

            <a href="Код целиком">Посмотреть код примера целиком</a>

            <p>
            <h2>Разберем подробнее</h2>

            <h3>
                <a name="designer-templates" class="anchor" href="#designer-templates"><span class="octicon octicon-link"></span></a>
                Внедряем зависимости
            </h3>



<pre><code>
//Класс обмена событиями между элементами
var Dispatcher = SoCuteGraph.events.dispatchers.Dispatcher;

//Класс позиционирования
var Position = SoCuteGraph.helpers.coordinates.Position;

//Контроллер вершин (элементов схемы)
var Node = SoCuteGraph.elements.basicNode.controllers.Controller;

//View model
var Element = SoCuteGraph.elements.basicNode.viewModel.ViewModel;

//Контроллер соединений между вершинами
var Line = SoCuteGraph.elements.joinLine.controllers.Controller;

//Абстрактная фабрика для визуализации с помощью RaphaelJS
var Scene = SoCuteGraph.elements.viewFactory.raphael.Scene;
</code></pre>

<h3>Инициализируем вспомогательные классы</h3>
<pre><code>
//Создаем холст RaphaelJs на месте div id="canvas-example-1"
var paper = Raphael(document.getElementById('canvas-example-1'), 800, 600);

//Создаем инстанс абстрактной фабрики виузуализации
var scene = new Scene(paper);

//Создаем инстанс диспатчера
var disp = new Dispatcher();
</code></pre>

<h3>Создаем ноды, отображаемые на холсте и соединительные линии</h3>
<pre><code>
//Создаем класс центральной ноды
var soCute = new Node('SoCuteGraph', scene, new Position({'x':250,'y':250}));
//Добавляем ноду в диспатчер событий
disp.addObject(soCute);
//Указываем двунаправленную оринтацию ноды
soCute.setOrientation(Element.ORIENTED_MULTI);

//Создаем ноду helpers
var helpers = new Node('helpers', scene, new Position({'x':130,'y':230}));
//Добавляем в диспатчер
disp.addObject(helpers);
//Делаем ноду лево орентированной (т.к. она по левую сторону от центральной)
helpers.setOrientation(Element.ORIENTED_LEFT);

//Создаем соединение между центральной нодой SoCuteGraph и нодой helpers
var joinLine1 = new Line(scene, soCute, helpers);
disp.addObject(joinLine1);
</code></pre>

<h3>Стилизуем центральную ноду</h3>

<pre><code>
//Стилизуем центральную ноду

//Получаем Raphael View блока
var centerView=soCute.getViewObject().frame.getRaphaelElement();

//Получаем Raphael View Текста
var centerText=soCute.getViewObject().text.getRaphaelElement();

centerText.attr("font-family",'Arial');
centerText.attr("font-weight",'bold');

centerView.attr("fill", "#FFEC73");
centerView.attr("fill-opacity",0.5);
centerView.attr("stroke", "#A68F00");
centerView.attr("r", 10);
soCute.redraw();


</code></pre>

<h3>Стилизуем ноды, обозначающие класс</h3>
<pre><code>
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

</code></pre>




</p>
        <footer>
            SoCuteGraph is maintained by <a href="https://github.com/snicksnk">snicksnk</a><br>
            This page was generated by <a href="http://pages.github.com">GitHub Pages</a>. Tactile theme by <a href="https://twitter.com/jasonlong">Jason Long</a>.
        </footer>


    </div>
</div>
</body>
</html>