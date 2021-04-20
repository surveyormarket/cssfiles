var slideCount;
var slideWidth;
var slideHeight;
var sliderUlWidth;

$(function() {
	getRssFeed("http://feeds.feedburner.com/samerica-surveyingjobs", mapFeed);
	
	$('.left-arrow').on('click', function () {
		moveLeft();
	});

	$('.right-arrow').on('click', function () {
		moveRight();
	});
	
	$(window).on('resize', function () {
		returnCarouselList();
	});
});

function moveLeft() {
	$('.carousel').animate({
		left: + slideWidth
	}, 200, function () {
		$('.carousel li:last-child').prependTo('.carousel');
		$('.carousel').css('left', '');
	});
}

function moveRight() {
	$('.carousel').animate({
		left: - slideWidth
	}, 200, function () {
		$('.carousel li:first-child').appendTo('.carousel');
		$('.carousel').css('left', '');
	});
}

function getRssFeed(url, callback) {
	return feednami.loadGoogleFormat(encodeURI(url), callback);
}

function mapFeed(result) {
	if (result.error) {
      console.log(result.error)
  } else {
		createCarouselList(result.feed.entries.slice(0, 5));
		createFeedList(result.feed.entries.slice(0, 20));
  }
}

function createCarouselList(elements) {
	var list = [];
	$(elements).each(function(index, element) {
		list.push("<li><h3><a href='"+ element.link +"'>"+ element.title +"</a></h3><p>"+ new Date(element.publishedDate).toLocaleDateString("pt-BR") +"</p><span class='carousel-footer'>"+ (index + 1) +" out of 5</span></li>");
	});
	
	$(".carousel").append(list);
	
}

function createFeedList(elements) {
	var list = [];
	$(elements).each(function(index, element) {
		list.push("<li><a href='"+ element.link +"'>"+ element.title +"</a></li>");
	});
	$(".list").append(list);
	returnCarouselList();
}

function returnCarouselList() {
	slideCount = $('.carousel li').length;
	slideWidth = $('.carousel li').width();
	slideHeight = $('.carousel li').height();
	sliderUlWidth = slideCount * slideWidth;
	$('.slider').css({ width: slideWidth, height: slideHeight });
	$('.carousel').css({ width: sliderUlWidth, marginLeft: - slideWidth });
	$('.carousel li:last-child').prependTo('.carousel');
}
