<?php

$config = array(
    'cacheDirPatch' => 'builds/',
    'cacheDirUrl' => 'builds/',
    'stateStorage' => __DIR__.'/cache/glueState.json',
    'glueEnable' => false,
    'preventCaching' => true,
    'baseUrl' => '',
    'collerctions' => array(
        'socutegraph'=>array(
            'files' =>array(
                "grapheng/SoCuteGraph.js",
                "grapheng/testTool/Module.js",
                "grapheng/oLib.js",
                "grapheng/elements/viewFactory/raphael.js",
                "grapheng/helpers/coordinates.js",
                "grapheng/events/dispatchers.js",
                "grapheng/events/std.js",
                "grapheng/elements/abstractController.js",
                "grapheng/elements/emptyElement.js",
                "grapheng/elements/basicNode.js",
                "grapheng/elements/joinLine.js",
                "grapheng/elements/animation.js"
            ),
            'className' => 'glueTypeJavascript',
            'fileName' => 'SoCuteGraph-0.1.0.js',
        ),
        'raphael' => array(
            'files' =>array(
                "resources/raphael-min.js"
            ),
            'className' => 'glueTypeJavascript',
            'fileName' => 'script.js'
        ),

        ));