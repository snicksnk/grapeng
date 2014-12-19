"use strict";
define(["socute/coordinates/position"], function (Position) {

    var Position;

    var Scene = function(paper){
        this.init(paper);
    }

    Scene.prototype.init=function(paper){

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth /window.innerHeight, 0.1, 1000 );

        var renderer = new THREE.WebGLRenderer();
        var paper = document.getElementById('canvas');
                
        renderer.setSize( 800, 600 );
        paper.appendChild( renderer.domElement );

        this._paper = scene;

            var geometry = new THREE.BoxGeometry( 1, 2, 1 );
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            var cube = new THREE.Mesh( geometry, material );
            scene.add( cube );

        var render = function () {
            requestAnimationFrame( render );
            renderer.render(scene, camera);
        };  



        render();

    }


    Scene.prototype.clear = function () {
        this._paper.clear();
    }

    Scene.prototype.getSize = function(){
        var size = new Position({'x': this._paper.canvas.offsetWidth, 'y':this._paper.canvas.offsetHeight});

        return size;
    }


    Scene.prototype.getCenter = function(){
        var center = Position.getCenterPoint(new Position(), this.getSize());
        return center;
    }



    Scene.prototype.NodeText=function(text){
        return new NodeText(text, this._paper);
    }

    Scene.prototype.NodeFrame=function(position){
        return new NodeFrame(position, this._paper);
    }

    Scene.prototype.JoinPoint=function(){
        return new JoinPoint(this._paper);
    }

    Scene.prototype.Path = function(path){
        return new Path(path, this._paper);
    }








    function AbstractView(){

    }


    AbstractView.prototype.hide = function(){
        //this._element.hide();
    }

    AbstractView.prototype.show = function(){
        //this._element.show();
    }

    AbstractView.prototype._render = function (renderCallback) {
        //setInterval(renderCallback, 0);
        renderCallback();
    }
    
    function AbstractJoinPoint(paper){
    }

    AbstractJoinPoint.prototype = new AbstractView();

    AbstractJoinPoint.prototype.position=null;
    AbstractJoinPoint.prototype._element=null;

    AbstractJoinPoint.prototype.movePosition=function(){
        throw 'specify it!';
    }

    AbstractJoinPoint.prototype._initElement=function(paper){
        this.position=new Position();

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        paper.add( cube );

        this._element = cube;

    }




    function JoinPoint(paper){
        this._initElement(paper);
    }

    JoinPoint.prototype=new AbstractJoinPoint();



    JoinPoint.prototype.movePosition=function(position){

        var pos=position.getPosition();
        var newX=pos['x'];
        var newY=pos['y'];

        this.position.setPos({'x':newX,'y':newY});

        var newXWithoutLineWidth = newX;
        var newYWithoutLineWidth = newY;

        var that = this;
        this._render(function(){
            that._element.position.x = newXWithoutLineWidth;
            that._element.position.y = newYWithoutLineWidth;
        });

        return this;
    }


    JoinPoint.prototype.hide = function(){
        //TODO implement
        //this._element.hide();
    }

    JoinPoint.prototype.show = function(){
        //this._element.show();
    }

    var NodeFrame= function(position, paper) {
        if (position){
            this.init(position, paper);
        }
    }

    NodeFrame.prototype = new AbstractView();


    NodeFrame.prototype.hide = function(){
        //this._nodeFrame.hide();
        //this._nodeCover.hide();
    }

    NodeFrame.prototype.show = function(){
        //this._nodeFrame.show();
        //this._nodeCover.show();
    }



    NodeFrame.prototype.init=function(position, paper){
        this._position = new Position;
        if (position){
            this._position.setPos(position.getPosition());
        }

        this._horizontalOffset=15;
        this._verticalOffset=6;

        var geometry = new THREE.BoxGeometry( 2, 2, 2 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );

        this._nodeFrame = cube;

        this.movePosition(this._position);
    }



    NodeFrame.prototype.movePosition=function(position){
        var pos = position.getPosition();
        this._position.setPos(pos);

        this._nodeFrame.position.x = pos['x'];
        this._nodeFrame.position.y = pos['y'];

    }


    NodeFrame.prototype.afterDrawText=function(){
        //this._nodeCover.toFront();
    }



    NodeFrame.prototype.setHeight=function(height){
       // this._nodeFrame.attr('height', height);
       // this._nodeCover.attr('height', height);
    }

    NodeFrame.prototype.getHeight=function(){
        return 2;
    }

    NodeFrame.prototype.getWidth = function(){
        return ;2
    }


    NodeFrame.prototype.setWidth = function(width){
        //this._nodeFrame.attr('width', width);
        //this._nodeCover.attr('width', width);
    }

    NodeFrame.prototype.getRaphaelElement=function(){
        return this._nodeFrame;
    }

    NodeFrame.prototype.setHorizontalOffset=function(offset){
        this._horizontalOffset=offset;
    }

    NodeFrame.prototype.getHorizontalOffset=function(){
        return this._horizontalOffset;
    }


    NodeFrame.prototype.setVerticalOffset=function(offset){
        this._verticalOffset=offset;
    }

    NodeFrame.prototype.getVerticalOffset=function(){
        return this._verticalOffset;
    }




    NodeFrame.prototype.setDrag=function(onStartMove, onMoving, onStopMove){
  //      this._nodeCover.drag(onStartMove, onMoving, onStopMove);
    }


    NodeFrame.prototype.click = function(handler){
//        this._nodeCover.click(handler);
    }

    NodeFrame.prototype.setColor = function(color){
    //    this._nodeFrame.attr("fill", color);
    }

    NodeFrame.prototype.getColor = function(){
    //    return this._nodeFrame.attr("fill");
    }



    function NodeText(text, paper){
        this.text=text;
        this.position=new Position();
  //      this._element = paper.text(50, 50, text);
  //      this._element.attr('font-size',12);
  //      this._element.attr('fill','#272323');
  //      this._element.attr('font-family','verdana');

    }

    NodeText.prototype = new AbstractView();

    NodeText.prototype.position=null;
    NodeText.prototype._element=null;

    NodeText.prototype.movePosition=function(position){
       /* var pos=position.getPosition();
        var textX=pos['x']+this._element.node.getBBox().width/2;
        var textY=pos['y'];
        this._element.attr('x',textX);
        this._element.attr('y',textY);
        this.position.setPos({'x':textX,'y':textY})
        return this;*/
    }

    NodeText.prototype.getRaphaelElement=function(){
        return this._element;
    }

    NodeText.prototype.getWidth=function(){
        return 2;
    }

    NodeText.prototype.getHeight=function(){
        return 2;
    }

    NodeText.prototype.setText = function(text){
        //this._element.attr('text', text);
    } 

    NodeText.prototype.getText = function(){
        //return this._element.attr('text');
    }

    var Path = function(path, paper){
        if (path && paper){
            this.init(path, paper);
        }
    }

    Path.prototype.init = function(path, paper){
        
        this._paper = paper;


        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( -10, 0, 0 ),
            new THREE.Vector3( 0, 10, 0 ),
            new THREE.Vector3( 0, -10, 0 ),
            new THREE.Vector3( -10, 0, 0 )
        );

        var line = new THREE.Line( geometry, material );
        this._paper.add( line );

    }

    Path.prototype.setSVGPath = function(path){
        /*this._path.attr("path", path);
        this._path.toBack();
        */
    }

    Path.prototype.setPath = function(start, end){

        var centerX=(end['x']-start['x'])/2+start['x'];
        var centerY=(end['y']-start['y'])/2+start['y'];

        //this._paper.circle(centerX, centerY, 1);

        /*
        this._path.attr("path",[
            "M",start['x'],start['y'],
            'Q',centerX,start['y'],
            ,centerX,centerY,
            'Q',centerX,end['y'],
            end['x'],end['y']
        ]);
        this._path.toBack();
        */
    }

    Path.prototype.hide = function(){
        this._path.hide();
    }



    return {
        'Scene': Scene,
        'Path': Path,
        'NodeText':NodeText,
        'NodeFrame':NodeFrame,
        'JoinPoint':JoinPoint
    };

});