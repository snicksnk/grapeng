"use strict";
define([
	'socute/coordinates/position',
	'socute/oLib',
    "socute/elements/node/basic/viewModel"], 
    function(Position, oLib, ViewModel){
    

    	var ViewBehavior = function(){
    	
    	}

    	//TODO fix call private _views varible


    	var Methods = {
    		nodeText:function(viewModel, position){
  				//return ;
    			var pos=position.getPosition();
		        var textX=pos['x'] + viewModel._views.nodeFrame.getHorizontalOffset();

		        var nodeHeight = viewModel._views.nodeText.getHeight();
		        var nodeVerticalOffset = viewModel._views.nodeFrame.getVerticalOffset();


		        if (viewModel._advanceViewMode){
		            var textY=pos['y'] + nodeVerticalOffset + 
		            nodeHeight/2-(nodeHeight/2);   
		        } else {
		            var textY=pos['y'] + nodeVerticalOffset + 
		            nodeHeight/2;   
		        }

		        return new Position({'x':textX,'y':textY});
    		},
    		leftJoinPoint:function(viewModel, position){
    			var pos=position.getPosition();
		        var leftX=pos['x']-1;
		        var leftY=pos['y']+viewModel._views.nodeFrame.getHeight()/2;
     			return new Position({'x':leftX,'y':leftY});
    		},
    		rightJoinPoint:function(viewModel, position){
    			var nodeWidth=viewModel._views.nodeFrame.getWidth();
		        var pos=position.getPosition();
		        var rightX=pos['x']+nodeWidth-1;
		        var rightY=pos['y']+viewModel._views.nodeFrame.getHeight()/2;
		        return new Position({'x':rightX,'y':rightY});
    		},
    		nodeFrame:function(viewModel, position){
    			return position;
    		}
    	};

    	oLib.extend(ViewBehavior.prototype, Methods);

    	return ViewBehavior;
	}
);