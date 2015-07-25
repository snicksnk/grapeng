'use strict';
	console.log('saas');
define([
     'require',
     'angular',
     '/grapeng/socute/ui/app.js',
     'uiBootstrap'
 ], function (require, ng, app) {
 
	require(['domReady!', '/grapeng/socute/ui/app.js'], function (document, app) {
		ng.bootstrap(document, ['graph-ui']);
	});
});