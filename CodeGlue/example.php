<?php
spl_autoload_register(function ($class) {
            require_once 'classes/' . $class . '.php';
        });
$glue = new codeGlue('config.php');

/**
 * Дефолтные наборы, подгружаемые из конфига
 */
$cssSetName = 'front_end_css';
$jsSetName = 'front_end_javascript';

if (isset($_GET['act'])) {
    $act = $_GET['act'];
} else {
    $act = 'index';
}
/**
 * Страница с разъединенными файлами
 */
if ($act == 'separated') {
    $glue->glueEnable = false;
}
/**
 * Страница очистки кэша
 */ elseif ($act == 'flush') {
    $glue->flushCash();
    $message = 'Кэш очищен';
}
/**
 * Страница с альтернативным скином
 */ elseif ($act == 'other') {
    $glue->glueEnable = false;
    $cssSetName = 'other_front_end_css';
}
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link href="example_data/favicon.ico" rel="shortcut icon">
        <?= $glue->genIncluder($cssSetName) ?>
        <?= $glue->genIncluder($jsSetName) ?>
        <title>Code glue</title>  
        <!--[if lt IE 9]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
    </head>

    <body>
        <div class="container">

            <header class="header clearfix">
                <div class="logo">Code glue</div>

                <nav class="menu_main">
                    <ul>
                        <li <?php if ($act == 'index'): ?>class="active"<?php endif; ?> ><a href="example.php">Описание</a></li>
                        <li <?php if ($act == 'separated'): ?>class="active"<?php endif; ?> ><a href="example.php?act=separated">Разъединить файлы</a></li>
                        <li <?php if ($act == 'other'): ?>class="active"<?php endif; ?> ><a href="example.php?act=other">Другой скин</a></li>
                        <li <?php if ($act == 'flush'): ?>class="active"<?php endif; ?> ><a href="example.php?act=flush">Очистить кэш</a></li>
                    </ul>
                </nav>
            </header>


            <div class="info">
                <article class="hero clearfix">
                    <div class="col_100">
                        <?php if (isset($message)): ?>
                            <p class="success"><?= $message ?></p>
                        <?php endif; ?>

                        <h1>Simplest solution for your simple tasks</h1>
                        <p>
                            Разработанный мною инструмент code glue служит для упрощения процессов управления наборами javascript и css файлов, подключаемых к веб приложениям, а также для управления кэшированием этих файлов. Код этого инструмента размещен в папке classes. Основные возможности, а также способы использования инструмента демонстрируются в example.php. Кроме этого, модульная структура инструмента позволяет внедрять поддержку новых типов подключаемых файлов, к примеру подключать файлы содержащие код на языке dart, или автоматизировать склейку и абфрускацию php файлов в больших приложениях для ускорения работы на продакшн сервере, либо генерации кода коробочных продуктов со скрытым исходным кодом, с сохранением удобной структуры файлов в окружение разработчиков.            
                        </p>
                    </div>
                </article>


            </div>

        </div>
    </body>
</html>

