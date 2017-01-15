$(function() {
  $('.suggestions').toggleClass('visibility');
  $('.suggestions').append('<div class="suggestion active">的士</div>');
  $('.suggestions').append('<div class="suggestion">的士</div>');
  $('.suggestions').append('<div class="suggestion">的士</div>');
  $('.suggestions').append('<div class="suggestion">的士</div>');

  $('.search').keyup(function(event) {
    var searchStr = $('.search input').val();
    console.log(searchStr);
    $.post('https://www.baidu.com/su', {
      wd: searchStr,
      json: 1
    }, function(data, textStatus, xhr) {
      console.log(data);
      console.log(textStatus);
      console.log(xhr);
    });
  });
})
