$(document).ready(function() {
    $('.mobile-nav').click(function() {
	   $('.mobile-nav__icon').toggleClass('active'); 
        $('.menu').slideToggle();
    });
});

// Aria Compliance

  function handleBtnClick(event) {
    event = event || window.event;
    var pressed = event.target.getAttribute("aria-pressed") == "true";
    //change the aria-pressed value as the button is toggled:
    event.target.setAttribute("aria-pressed", pressed ? "false" : "true");
    //... (perform the button's logic here)
  }

  function handleBtnKeyUp(event) {
    event = event || window.event;
    if (event.keyCode === 32) { // check for Space key
      handleBtnClick(event);
    }
  }