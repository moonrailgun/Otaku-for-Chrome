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
      if(Core.checkUrl(searchText)){
        var url = searchText;
        if(searchText.indexOf("http")<0){
          url = "http://" + url;
        }
        window.open(url, "_self");
      }else{
        Search.openSearchWindow(searchText);
      }
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

  $('.menu-toggle').click(function(event) {
    Core.toggleSettings();
  });

  $('#settings').on('click', '.menu-item', function(event) {
    event.preventDefault();

    if(!$(this).hasClass('active')){
      $('#settings .menu-item').removeClass('active');
      $(this).addClass('active');

      //切换内容框内容
      var menuName = $.trim($(this).text());
      $('#settings .content-item').removeClass('active');
      $('#settings .content-item').each(function(index, el) {
        var obj = $(el);
        if(obj.attr('data-menu') == menuName){
          obj.addClass('active');

          return false;
        }
      });
    }
  });
  $('#settings .close').click(function(event) {
    Core.toggleSettings();
  });
  var saveChange = function(event){
    console.log("saveChange");
  }
  $('#settings').on('change', 'input', saveChange);


  var leftPanel = $('#left-panel');
  var centerPanel = $('#center-panel');
  var rightPanel = $('#right-panel');

  Core.addWidget('weather', leftPanel);
  Core.addWidget('hitokoto', centerPanel);
  Core.addWidget('clock', centerPanel);
  Core.addWidget('bilibiliquick', rightPanel);
  Core.addWidget('translate', rightPanel);
})
