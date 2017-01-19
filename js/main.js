$(function() {
  Search.toggleVisibility();
  $('.search').bind('keyup change',function(event) {
    var keycode = event.keyCode;
    if(keycode == 38 ||keycode == 40){
      return;
    }

    var searchStr = Search.getCurrentVal();
    if(searchStr != ""){
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
      });
    }
  });

  $('.search').bind('search',function(e){
    var searchText = Search.getCurrentVal();
    if($.trim(searchText) == ""){
      console.log('搜索内容为空');
    }else{
      // console.log(searchText);
      Search.openSearchWindow(searchText);
    }
  });

  $('.search').keydown(function(event) {
    //为兼容中文输入法不能与keyup事件公用
    if(event.keyCode == 38){
      //up
      var oldActiveItem = $('.suggestions .suggestion.active');
      var newActiveItem = oldActiveItem.prev('.suggestion');
      if(newActiveItem[0]){
        oldActiveItem.removeClass('active');
        newActiveItem.addClass('active');
      }else{
        oldActiveItem.removeClass('active');
        oldActiveItem.nextAll().last().addClass('active');
      }
      Search.setCurrentVal(newActiveItem.text());
    }else if(event.keyCode == 40){
      //down
      var oldActiveItem = $('.suggestions .suggestion.active');
      var newActiveItem = oldActiveItem.next();
      if(newActiveItem[0]){
        oldActiveItem.removeClass('active');
        newActiveItem.addClass('active');
      }else{
        oldActiveItem.removeClass('active');
        oldActiveItem.prevAll().last().addClass('active');
      }
      Search.setCurrentVal(newActiveItem.text());
    }
  });

  $('.search').on('mousedown','.suggestion', function(event) {
    var target = $(event.target);
    console.log(target);
    if(target.hasClass('suggestion')){
      var searchText = target.text();
      Search.openSearchWindow(searchText);
    }
  });

  var leftPanel = $('#left-panel');
  var centerPanel = $('#center-panel');
  var rightPanel = $('#right-panel');

  Core.addWidget('weather', leftPanel);
  Core.addWidget('hitokoto', centerPanel);
  Core.addWidget('bilibiliquick', rightPanel);
})
