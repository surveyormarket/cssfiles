$(function() {
    // Define variables
    var canvas, width, height, context, diameter, radius, centreX, centreY;
    
    var white = '#FFFFFF';
    var grey = '#424242';
    var red = '#FF0000';
    
    window.onresize = function(event) {
        init();
    }
    
    function init() {
        canvas = $("#canvas")[0];
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight;
        width = canvas.width;
        height = canvas.height;
        //console.log("width: " + width);
        //console.log("height: " + height);
        centreX = Math.floor(width/2) + 0.5;
        centreY = Math.floor(height/2) + 0.5;
        //console.log("centreX: " + centreX);
        //console.log("centreY: " + centreY);
        context = canvas.getContext("2d");
        clearCanvas();
        drawDial();
    }
    
    function clearCanvas() {
        context.fillRect(0, 0, width, height);
    }
    
    function drawDial() {
        diameter = Math.floor(Math.min(canvas.width, canvas.height) * 0.7);
        radius = Math.floor(diameter/2);
        diameter = radius * 2;
        //console.log("diameter: " + diameter);
        //console.log("radius: " + radius);
        
        // Draw cross hairs
        context.beginPath();
        context.strokeStyle = grey;
        context.moveTo(centreX - radius, centreY);
        context.lineTo(centreX + radius, centreY);
        context.moveTo(centreX, centreY - radius);
        context.lineTo(centreX, centreY + radius);
        context.moveTo(centreX, centreY);
        var endObj = getPolarPoint(centreX, centreY, 45, radius);
        context.lineTo(endObj.x, endObj.y);
        context.stroke();
        
        // Draw part circle
        context.beginPath();
        context.strokeStyle = grey;
        var innerCircleRadius = radius*0.33;
        context.arc(centreX, centreY, radius*0.33, 0, degToRad(320), false);
        context.stroke();
        
        // Draw arrow head
        var rotationOffsetDegrees = 10;
        var arrowHeadLegth = radius*0.05;
        var arrowHeadPoint = getPolarPoint(centreX, centreY, 320, innerCircleRadius);
        var endPoint1 = getPolarPoint(arrowHeadPoint.x, arrowHeadPoint.y, 270 + rotationOffsetDegrees, arrowHeadLegth);
        var endPoint2 = getPolarPoint(arrowHeadPoint.x, arrowHeadPoint.y, 180 + rotationOffsetDegrees, arrowHeadLegth);
        context.strokeStyle = grey;
        context.beginPath();
        context.moveTo(arrowHeadPoint.x, arrowHeadPoint.y);
        context.lineTo(endPoint1.x, endPoint1.y);
        context.moveTo(arrowHeadPoint.x, arrowHeadPoint.y);
        context.lineTo(endPoint2.x, endPoint2.y);
        context.stroke();
        
        // Draw outer circle
        context.beginPath();
        context.arc(centreX, centreY, radius, 0 , 2 * Math.PI, false);
        context.lineWidth = 1;
        context.strokeStyle = white;
        context.stroke();
        
        // Draw long outer dividing lines (Radians)
        context.beginPath();
        var numLines = 40;
        var angleIncrement = 360/numLines;
        var lineLength = radius * 0.1;
        var startAngle = 0;
        for (var i=0; i<numLines; i++) {
            var startPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), radius);
            context.moveTo(startPosObj.x, startPosObj.y);
            var endPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), radius + lineLength);
            context.lineTo(endPosObj.x, endPosObj.y);
        }
        context.stroke();
        
        // Draw short outer dividing lines (Radians)
        context.beginPath();
        var numLines = 40;
        var angleIncrement = 360/numLines;
        var lineLength = radius * 0.05;
        var startAngle = angleIncrement/2;
        for (var i=0; i<numLines; i++) {
            var startPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), radius);
            context.moveTo(startPosObj.x, startPosObj.y);
            var endPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), radius + lineLength);
            context.lineTo(endPosObj.x, endPosObj.y);
        }
        context.stroke();
        
        // Draw long inner dividing lines (Degrees)
        context.beginPath();
        var numLines = 9*4;
        var angleIncrement = 360/numLines;
        var lineLength = radius * 0.1;
        var startAngle = 0;
        for (var i=0; i<numLines; i++) {
            var startPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), radius);
            context.moveTo(startPosObj.x, startPosObj.y);
            var endPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), radius - lineLength);
            context.lineTo(endPosObj.x, endPosObj.y);
        }
        context.stroke();
        
        // Draw short inner dividing lines (Degrees)
        context.beginPath();
        var numLines = 9*4;
        var angleIncrement = 360/numLines;
        var lineLength = radius * 0.05;
        var startAngle = angleIncrement/2;
        for (var i=0; i<numLines; i++) {
            var startPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), radius);
            context.moveTo(startPosObj.x, startPosObj.y);
            var endPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), radius - lineLength);
            context.lineTo(endPosObj.x, endPosObj.y);
        }
        context.stroke();
        
        // Display radians title text
        var titleText = "Radians (0 to 2π)";
        context.fillStyle = white;
        context.font = (diameter*0.03) + 'px sans-serif';
        var metrics = context.measureText(titleText);
        var titleTextWidth = metrics.width;
        context.fillText(titleText, centreX - (titleTextWidth/2), centreY - radius - (radius*0.3));
        
        // Display degrees title text
        var titleText = "Degrees (0 to 360)";
        context.fillStyle = white;
        context.font = (diameter*0.03) + 'px sans-serif';
        var metrics = context.measureText(titleText);
        var titleTextWidth = metrics.width;
        context.fillText(titleText, centreX - (titleTextWidth/2), centreY - (radius*0.65));
        
        // Display radians values
        var numLines = 40;
        var angleIncrement = 360/numLines;
        var startAngle = 0;
        var radianValue = 3.14 / (numLines/2);
        context.font = (diameter*0.02) + 'px sans-serif';
        for (var i=0; i<numLines; i++) {
            var textPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), (radius*1.15));
            var radianText = Math.round((radianValue * i) * 100)/100;
            radianText = radianText + "";
            if (radianText.length === 1) {
                radianText = radianText + ".00";
            } else if (radianText.length === 3) {
                radianText = radianText + "0";
            }
            var metrics = context.measureText(radianText);
            var titleTextWidth = metrics.width;
            context.fillText(radianText, textPosObj.x - (titleTextWidth/2), textPosObj.y + ((diameter*0.02)/3));
        }
        
        // Display degrees values
        var numLines = 9*4;
        var angleIncrement = 360/numLines;
        var startAngle = 0;
        var degreesValue = 360 / numLines;
        context.font = (diameter*0.02) + 'px sans-serif';
        for (var i=0; i<numLines; i++) {
            var textPosObj = getPolarPoint(centreX, centreY, startAngle + (angleIncrement*i), (radius*0.85));
            var degreesText = Math.round((degreesValue * i) * 100)/100;
            degreesText = degreesText + "°";
            var metrics = context.measureText(degreesText);
            var titleTextWidth = metrics.width;
            context.fillText(degreesText, textPosObj.x - (titleTextWidth/2), textPosObj.y + ((diameter*0.02)/3));
        }
        
        // Display PI text
        var piText1 = "TWO_PI";
        context.fillStyle = white;
        context.font = (diameter*0.022) + 'px sans-serif';
        textPosObj = getPolarPoint(centreX, centreY, 0, (radius*1.30));
        metrics = context.measureText(piText1);
        var piTextWidth = metrics.width;
        context.fillText(piText1, textPosObj.x - (piTextWidth/2), textPosObj.y + ((diameter*0.02)/3));
        
        var piText2 = "QUARTER_PI";
        textPosObj = getPolarPoint(centreX, centreY, 45, (radius*1.30));
        metrics = context.measureText(piText2);
        piTextWidth = metrics.width;
        context.fillText(piText2, textPosObj.x - (piTextWidth/2), textPosObj.y + ((diameter*0.02)/3));
        
        var piText3 = "HALF_PI";
        textPosObj = getPolarPoint(centreX, centreY, 90, (radius*1.23));
        metrics = context.measureText(piText3);
        piTextWidth = metrics.width;
        context.fillText(piText3, textPosObj.x - (piTextWidth/2), textPosObj.y + ((diameter*0.02)/3));
        
        var piText4 = "PI";
        textPosObj = getPolarPoint(centreX, centreY, 180, (radius*1.30));
        metrics = context.measureText(piText4);
        piTextWidth = metrics.width;
        context.fillText(piText4, textPosObj.x - (piTextWidth/2), textPosObj.y + ((diameter*0.02)/3));
        
        var piText5 = "PI + HALF_PI";
        textPosObj = getPolarPoint(centreX, centreY, 270, (radius*1.23));
        metrics = context.measureText(piText5);
        piTextWidth = metrics.width;
        context.fillText(piText5, textPosObj.x - (piTextWidth/2), textPosObj.y + ((diameter*0.02)/3));
    
    }
    
    function drawCursorPoint($mouseX, $mouseY) {
        context.lineWidth = 2;
        var angle = -(angleOfLine(centreX, centreY, $mouseX, $mouseY));
        if (angle < 0) {
            angle = angle * -1;
        } else {
            angle = 360 - angle;
        }
        var angleStr = Math.floor(angle * 10) / 10;
        var dist = distanceBetween2Points(centreX, centreY, $mouseX, $mouseY);
        var lineLength = dist;
        if (lineLength < radius*0.33) {
            lineLength = radius*0.33;
        } else if (lineLength > radius) {
            lineLength = radius;
        }
        var endPoint = getPolarPoint(centreX, centreY, angle, lineLength);
        context.strokeStyle = red;
        context.beginPath();
        context.moveTo(centreX, centreY);
        context.lineTo(endPoint.x, endPoint.y);
        
        // Red arrow head
        context.moveTo(endPoint.x, endPoint.y);
        var redArrowHeadEnd1 = getPolarPoint(endPoint.x, endPoint.y, 220 + angle, 6);
        context.lineTo(redArrowHeadEnd1.x, redArrowHeadEnd1.y);
        context.moveTo(endPoint.x, endPoint.y);
        var redArrowHeadEnd2 = getPolarPoint(endPoint.x, endPoint.y, 140 + angle, 6);
        context.lineTo(redArrowHeadEnd2.x, redArrowHeadEnd2.y);
        context.stroke();
        
        // Show red text
        var radians = degToRad(angle);
        var radiansStr = Math.floor(radians * 1000) / 1000;
        var degreesText = angleStr + "° = " + radiansStr + " radians";
        context.font = (diameter*0.02) + 'px sans-serif';
        if (angle < 180) {
            textPosObj = getPolarPoint(centreX, centreY, 270, (radius*0.1));
        } else {
            textPosObj = getPolarPoint(centreX, centreY, 90, (radius*0.1));
        }
        metrics = context.measureText(degreesText);
        var degreesTextWidth = metrics.width;
        context.fillStyle = red;
        context.fillText(degreesText, textPosObj.x - (degreesTextWidth/2), textPosObj.y + ((diameter*0.02)/3));
    }
    
    function getPolarPoint($x, $y, $degrees, $distance) {
        var destinationPt = new Object();
        destinationPt.x = $x + Math.round($distance * Math.cos( $degrees * Math.PI / 180 ));
        destinationPt.y = $y + Math.round($distance * Math.sin( $degrees * Math.PI / 180 ));
        return destinationPt;
    }
    
    function angleOfLine($x1, $y1, $x2, $y2){
        return atan2Degrees($y2 - $y1, $x2 - $x1);
    }
    
    function distanceBetween2Points($x1, $y1, $x2, $y2) {
        var dx = $x2 - $x1;
        var dy = $y2 - $y1;
        return Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dy, 2 ) );
    }
    
    function atan2Degrees($y, $x){
        return Math.atan2($y, $x) * (180/Math.PI);
    }
    
    function degToRad($degrees) {
        return $degrees * (Math.PI/180);
    }
    
    function radToDeg($radians) {
        return $radians * (180/Math.PI);
    }
    
    // Tracking mouse position in canvas
    // http://stackoverflow.com/questions/5085689/tracking-mouse-position-in-canvas
    function findPos($obj) {
        var curleft = 0, curtop = 0;
        if ($obj.offsetParent) {
            do {
                curleft += $obj.offsetLeft;
                curtop += $obj.offsetTop;
            } while ($obj = $obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    }
    
    $('#canvas').mousemove(function(e) {
        var pos = findPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        init();
        drawCursorPoint(x, y);
    });
    
    init();
});