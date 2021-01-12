(function($){
    $.fn.spinwheel = function(options, callback){
        
        var params = $.extend({},$.fn.spinwheel.default_options, options), $that = $(this), ctx = null, 
        startAngle = 0, arc = Math.PI / 4, spinTimeout = null, spinArcStart = 10, spinTime = 0, spinTimeTotal = 0,
        spinAngleStart = 0, pplLength = 8, pplArray = params.pplArray;

        var colors=["#24aef0", "#1d75bd", "#662e93", "#92278f", "#ee1c25", "#f25a29", "#f7941d", "#fcb040", "#24aef0", "#1d75bd", "#662e93", "#92278f", "#ee1c25", "#f25a29", "#f7941d", "#fcb040", "#24aef0", "#1d75bd", "#662e93", "#92278f", "#ee1c25", "#f25a29", "#f7941d", "#fcb040", "#24aef0", "#1d75bd", "#662e93", "#92278f", "#ee1c25", "#f25a29", "#f7941d", "#fcb040", "#24aef0", "#1d75bd", "#662e93", "#92278f", "#ee1c25", "#f25a29", "#f7941d", "#fcb040", "#24aef0", "#1d75bd", "#662e93", "#92278f", "#ee1c25", "#f25a29", "#f7941d", "#fcb040"];

        if($.isFunction(options)){
            callback = options;
            options = {};
        } 
        
        var methods = {
            init: function() {
                methods.getContext();
                methods.setup();
                drawWheel();                
            },       
            setup: function() {
                $(params.spinTrigger).one('click touchend', function(e){
                    e.preventDefault();
                    methods.spin();
                });
                                              
                $(params.addPplTrigger).bind('click', function(e){
                    e.preventDefault();
                    var item = $('<li />').append($(params.joiner).val());
                    $(params.paricipants).append(item);
                    methods.updatePanel();
                });               
            },            
            getContext: function() {         
                if(ctx !== null)
                    return ctx;

                var canvas = $that[0];
                ctx = canvas.getContext("2d");  
                
                // retina conversion
                if(window.devicePixelRatio == 2) {
                    canvas.setAttribute('width', 880);
                    canvas.setAttribute('height', 880);
                    ctx.scale(2, 2);
                }
            },
            spin: function() {
                wheelSound(); 
                spinAngleStart = Math.random() * 10 + 10;
                spinTime = 0;
                spinTimeTotal = Math.random() * 3 + 4 * 1000;
                rotateWheel(); 

                // winner calculating msg...
                $(params.winnerDiv).html('spinning, please wait...')                              
            },
            updatePanel: function() {
                var $ppl = $(params.paricipants).children();
                pplArray = [];
                $ppl.each(function(key, value){
                    pplArray.push(value.innerHTML);
                });
                arc = 2 * Math.PI / $ppl.length;
                pplLength = $ppl.length;
                drawWheel();
            }
        }
        
       var rotateWheel = function rotateWheel() {
            spinTime += 5.5;
            if(spinTime >= spinTimeTotal) {
                stopRotateWheel();
                return;
            }

            var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
            startAngle += (spinAngle * Math.PI / 180);
            drawWheel();
            spinTimeout = setTimeout(rotateWheel, 30);            
        }
        
        function stopRotateWheel () {
            clearTimeout(spinTimeout);
            var degrees = startAngle * 180 / Math.PI + 90;
            var arcd = arc * 180 / Math.PI;
            var index = Math.floor((360 - degrees % 360) / arcd);
            ctx.save();
            var text = pplArray[index];           
          
            // winner output
            $(params.winnerDiv).html(text).show();
            ctx.restore();
          
            resultSound();
        }  

        function wheelSound() {
            clicker = new Audio('https://s3.amazonaws.com/mrktapp/socialbungy/wheel.mp3');
            clicker.volume = .52;
            clicker.play();
        }
      
        function resultSound() {
            result = new Audio('	https://s3.amazonaws.com/mrktapp/socialbungy/prize-alert.mp3');
            result.volume = .32;
            result.play();
        }
        
        function drawArrow() {
            // layer1
            ctx.beginPath();
            ctx.moveTo(202.5 + 8.8, 23.0);
            ctx.lineTo(202.5 + 17.4, 38.0);
            ctx.lineTo(202.5 + 17.4, 0.0);
            ctx.lineTo(202.5 + 0.0, 8.0);
            ctx.lineTo(202.5 + 8.8, 23.0);
            ctx.closePath();
            ctx.fillStyle = "rgb(152, 152, 152)";
            ctx.fill();

            // layer2
            ctx.beginPath();
            ctx.moveTo(202.5 + 17.4, 0.0);
            ctx.lineTo(202.5 + 17.4, 38.0);
            ctx.lineTo(202.5 + 26.4, 23.0);
            ctx.lineTo(202.5+ 35.0, 8.0);
            ctx.lineTo(202.5 + 17.4, 0.0);
            ctx.closePath();
            ctx.fillStyle = "rgb(102, 102, 103)";
            ctx.fill();              
        }

        function drawOutterBorder() {
            ctx.fillStyle = '#e6e6e6';
            ctx.beginPath();
            ctx.arc(220,220,215,0,Math.PI*2, false); // outer (filled)
            ctx.fill();
        }

        function drawInnerBorder() {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.arc(220,220,210,0,Math.PI*2, false); // outer (filled)
            ctx.arc(220,220,190,0,Math.PI*2, true); // outer (unfills it)
            ctx.fill();
        }
        
        function drawWheel() {
            ctx.strokeStyle = params.wheelBorderColor;
            ctx.lineWidth = params.wheelBorderWidth;
            ctx.font = params.wheelTextFont;            
            ctx.clearRect(0,0,440,440);

            var text = null, i = 0, totalJoiner = pplLength;

            drawOutterBorder();

            for(i = 0; i < totalJoiner; i++) {
                text = pplArray[i];           
                var angle = startAngle + i * arc;                
                ctx.fillStyle = colors[i];
                
                ctx.beginPath();
                // ** arc(centerX, centerY, radius, startingAngle, endingAngle, antiClockwise);
                ctx.arc(220, 220, params.outterRadius, angle, angle + arc, false);
                ctx.arc(220, 220, params.innerRadius, angle + arc, angle, true);
                ctx.fill();

                ctx.save();
                ctx.clip();
                ctx.fillStyle = params.wheelTextColor;
                ctx.translate(220 + Math.cos(angle + arc / 2) * params.textRadius, 220 + Math.sin(angle + arc / 2) * params.textRadius);
                ctx.rotate(angle + arc / 2 + Math.PI / 90);
                
                ctx.fillText(text.toUpperCase(), -ctx.measureText(text).width / 1.5, 6);                

                ctx.restore();
                //ctx.closePath();
            }
            drawInnerBorder();       
            drawArrow();
        }          
  
        function easeOut(t, b, c, d) {
            var ts = (t/=d)*t;
            var tc = ts*t;
            return b+c*(tc + -3*ts + 3*t);
        } 
                
        methods.init.apply(this,[]);
    }
    
    /*  ---  please look at the index.html source in order to understand what they do ---
     *  outterRadius : the big circle border
     *  innerRadius  : the inner circle border
     *  textRadius   : How far the the text on the wheel locate from the center point
     *  spinTrigger  : the element that trigger the spin action 
     *  wheelTextFont : what is the style of the text on the wheel
     *  wheelTextColor : what is the color of the tet on the wheel
     *  participants : what is the container for participants for the wheel
     *  joiner : usually a form input where user can put in their name
     *  addPplTrigger : what element will trigger the add participant
     *  winDiv : the element you want to display the winner
     */
    $.fn.spinwheel.default_options = {
        outterRadius:210,
        innerRadius:50,
        textRadius: 120,
        spinTrigger: '.spin-trigger',
        wheelTextFont : '13px sans-serif',
        wheelTextColor: 'RGBA(255,255,255,0.4)',
        paricipants:'.participants',
        addPplTrigger:'.add',
        joiner:'.joiner',
        winnerDiv:'.winner span'
    }
})(jQuery);

$(document).ready(function(){
   $('.spin2win').spinwheel({
       pplArray : ["•", "•", "•", "•","•", "•", "•", "•"]
   });

   $('.spin-start').on('click touchend', function (){
        $(this).addClass('spin-btn');
   })
});