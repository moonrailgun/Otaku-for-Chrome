$(function(){
  var Search = {
    getCurrentVal:function(){

      return $.trim($('.search input').val());
    },
    setCurrentVal:function(str){
      $('.search input').val(str)
    },
    toggleVisibility:function(){
      $('.suggestions').toggleClass('visibility');
    },
    hideSearchSuggestions:function(){
      if($('.suggestions').hasClass('visibility')){
        $('.suggestions').removeClass('visibility');
      }
    },
    showSearchSuggestions:function(){
      if(!$('.suggestions').hasClass('visibility')){
        $('.suggestions').addClass('visibility');
      }
    },
    updateSuggestions:function(arr){
      var currentVal = this.getCurrentVal()
      $('.suggestions').html('');
      $('.suggestions').append('<div class="suggestion active">'+ currentVal +'</div>');
      $.each(arr, function(index, el) {
        if(currentVal != el){
          $('.suggestions').append('<div class="suggestion">'+el+'</div>');
        }
      });
    },
    openSearchWindow:function(searchText){
      var url = "https://www.baidu.com/s?wd=" + encodeURI(searchText);
      window.open(url, "_self");
    }
  }

  window.Search = Search;
})
