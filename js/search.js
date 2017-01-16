$(function(){
  var Search = {
    getCurrentVal:function(){
      return $('.search input').val();
    },
    toggleVisibility:function(){
      $('.suggestions').toggleClass('visibility');
    },
    updateSuggestions:function(arr){
      $('.suggestions').html('');
      $('.suggestions').append('<div class="suggestion active">'+ this.getCurrentVal() +'</div>');
      // foreach(var item in arr){
      //   $('.suggestions').append('<div class="suggestion">'+item+'</div>');
      // }
      $.each(arr,function(index, el) {
        $('.suggestions').append('<div class="suggestion">'+el+'</div>');
      });
    }
  }

  window.Search = Search;
})
