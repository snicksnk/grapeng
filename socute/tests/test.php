<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Socute</title>
	<link rel="stylesheet" href="../../bower_components/qunit/qunit/qunit.css">

    <style type="text/css">
      #canvas {
          width: 800px;
          height: 500px;
          border: 1px solid #aaa;
      }
      #testCanvas {
        width: 10px;
        height: 10px;
      }
    </style>

</head>
<body>
	
	<div id="canvas"></div>
    <div id="testCanvas"></div> 
	
    <div id="qunit"></div>
    <div id="qunit-fixture"></div>
    <script src="../../bower_components/three.js/three.js"></script>
    <script type="text/javascript" src="../../bower_components/raphael/raphael.js"></script>
  	<script data-main="tests" src="../../bower_components/requirejs/require.js"></script>
  	<script src="../../bower_components/qunit/qunit/qunit.js"></script>
    <script type="text/javascript" src="../resources/raphael-min.js"></script>
</body>
</html>