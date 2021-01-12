var angles = [22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5]
var colors = ["#2cc5d2","#38c88e","#fab320","#f97903","#ca2231","#79022c","#0a4366","#0a97d0"]
var spinBtn = document.querySelector('#spin-btn')
var spinArrow = document.querySelector('#spin-arrow')
var offerBtn = document.querySelector('#si-btn')
var spinOffer = document.querySelectorAll('.spin-offer')


var urlSpin = (new URL(document.location)).searchParams
// var urlParams = new URLSearchParams("?editors=0010&nlm=sara")
var spinname = urlSpin.get('nlmlp')
if(spinname == null || spinname == "") {
 var spinname = "z"
}
var num = spinname.length > 7 ? Math.floor(spinname.length/8) - 1 : spinname.length;
// console.log(spinname)
// console.log(num)

function spinToWin() { 
  var offer = Math.floor(Math.random()*spinOffer.length)  
    
  spinBtn.style.pointerEvents = "none"
  spinBtn.style.animation = "none"
     
  spinArrow.style.transform = "rotate("+((360*5)+angles[num])+"deg)"
  
  spinOffer[num].style.background = colors[num];  
  
  setTimeout(function() {
    spinOffer[num].style.display = "inline-block";  
    offerBtn.style.opacity = "1";
    offerBtn.style.transition = "1.5s";
  },3000)  
}

spinBtn.addEventListener('click', function(){   
      spinToWin()   
})