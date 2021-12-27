$(document).ready(function() {

  $('#search').on('click', function() {
    $('#article').text('');
    var searchTerm = $('input').val().split(' ').join('_') || 'computer_science';
    $.ajax({
      type: 'GET',
      url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=' + searchTerm + '&callback=?',
      contentType: 'application/json; charset=utf-8',
      async: false,
      dataType: 'json',
      success: function(data) {
        var results = [];
        var page = 'http://en.wikipedia.org/?curid=';
        var sets = data.query.pages;
        for (var prop in sets) {
          results.push({
            title: sets[prop].title,
            body: sets[prop].extract,
            page: page + sets[prop].pageid
          });
        }
        results.forEach(function(info) {
          $('#article').append('<div class="section"><h3>' + info.title + '</h3><p>' + info.body + '</p><a href="' + info.page + '" target="_blank">Read More</a></div>');
        });
        $('#article').append('<div id="up"><a href="#one"><i class="fa fa-chevron-up"></i></a></div>')
        $('#input').val('');
        $('#down').fadeIn(500, function() {
          self.location.href = '#article';
        });
        $('#two').fadeIn(500);
      }
    });
  });

});