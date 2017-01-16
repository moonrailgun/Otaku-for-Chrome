$(function() {
  Search.toggleVisibility();
  $('.search').bind('keyup change',function(event) {
    var searchStr = Search.getCurrentVal();

    $.ajax({
      url: 'http://suggestion.baidu.com/',
      type: 'GET',
      dataType: 'text',
      data: {
        wd: searchStr,
        json:1,
        cb:"callback"
      },
      success:function(data){
        var text = data.match(/callback\((.*)\);/)[1];
        var json;
        try {
          json = window.eval("(" + text + ")");
        } catch (s) {
          json = JSON.parse(text);
        }
        var sugArr = json.s;
        Search.updateSuggestions(sugArr);
      }
    })
  });

  $('.search').bind('search',function(e){
    var searchText = Search.getCurrentVal();
    if($.trim(searchText) == ""){
      console.log('搜索内容为空');
    }else{
      // console.log(searchText);
      var url = "https://www.baidu.com/s?wd=" + encodeURI(searchText);
      window.open(url, "_self");
    }
  });
})
