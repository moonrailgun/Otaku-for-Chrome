$(function() {
  $('.search').bind('keyup change',function(event) {
    var keycode = event.keyCode;
    if(keycode == 38 ||keycode == 40){
      return;
    }

    var searchStr = Search.getCurrentVal();
    if(searchStr != ""){
      Search.showSearchSuggestions();
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
    }else{
      Search.hideSearchSuggestions();
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

  //上下移动建议
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
      var menuName = $(this).attr('data-menu-name');
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
    // console.log("saveChange");
    var obj = $(this);
    var val = obj.val();
    var widgetName = obj.parent('.content-item').attr('data-menu');
    var dataName = obj.attr('data-name');
    if(dataName&&widgetName){
      var ws = Core.widgetSettings.get(widgetName);
      ws[dataName] = val;
      Core.widgetSettings.set(widgetName,ws);
      Core.addWebmessage('保存成功,刷新后生效');
      console.log('保存成功' + JSON.stringify(ws));
    }
  }
  $('#settings').on('change', 'input', saveChange);

  $('#settings .random-wallpaper').click(function(event) {
    /* Act on the event */
    Core.randomLoadWallPaper();
  });
  $('#settings .url-wallpaper').keydown(function(event) {
    /* Act on the event */
    if(event.keyCode == 13){
      var url = $(this).val();
      Core.loadWallPaperByUrl(url);
    }
  });
  $('#settings .local-wallpaper').change(function(event) {
    /* Act on the event */
    var file = this.files[0];
    if(file){
      console.log(file);
      if(file.type == "image/jpeg"){
        Core.writeFile("/background.jpg",{data:file,type:'image/jpeg'},
          function(localUrl){
            console.log("更换壁纸完毕:"+file.name);
            Core.setWallPaper(localUrl);
          });
      }else{
        console.log("文件格式不正确");
      }
    }else{
      console.log("没有选中文件");
    }
  });
  $('#settings .widget-list').on('change', '.widget-layout', function(event) {
    event.preventDefault();
    /* Act on the event */
    var widgetLayout = [];
    var widgetNameList = [];
    $('#settings .widget-list').find('.widget-layout').each(function(index, el) {
      //数据来源于设置面板
      var obj = $(el);
      var widgetName = obj.attr('data-widget');
      var widgetLabel = obj.attr('data-label');
      var widgetPanel = obj.val();
      if(widgetNameList.indexOf(widgetName) < 0){
        //名称列表不存在该布局。确保唯一性
        widgetLayout.push({
          name:widgetName,
          label:widgetLabel,
          layout:widgetPanel
        });
        widgetNameList.push(widgetName);
      }
    });

    // console.log(widgetLayout);
    Core.settings.set("widgetLayout",widgetLayout);
    Core.updateWidgetPanel();
    console.log("布局设置保存完毕");
  });
  $('body').on('click', '.web-message .fa-close', function(event) {
    event.preventDefault();
    /* Act on the event */
    var obj = $(this).parent('.web-message');
    if(obj){
      obj.remove();
    }
  });




  //读取本地缓存壁纸
  var lastWallPaperUrl = Core.settings.get("lastWallPaper")
  if(lastWallPaperUrl){
    Core.setWallPaper(lastWallPaperUrl);
  }

  //初始化widgetLayout
  var defaultWidgetLayout = [
    {
      name:"weather",
      label:"天气",
      layout:"left"
    },
    {
      name:"tasks",
      label:"TODO",
      layout:"left"
    },
    {
      name:"hitokoto",
      label:"一言",
      layout:"center"
    },
    {
      name:"clock",
      label:"时钟",
      layout:"center"
    },
    {
      name:"bilibiliquick",
      label:"bilibili快速入口",
      layout:"right"
    },
    {
      name:"translate",
      label:"百度翻译",
      layout:"right"
    },
    {
      name:"bookmarks",
      label:"书签",
      layout:"right"
    }
  ];
  var widgetLayout = Core.settings.get("widgetLayout");
  if(!widgetLayout){
    //默认布局
    widgetLayout = defaultWidgetLayout;
    Core.settings.set("widgetLayout", widgetLayout);
  }

  var leftPanel = $('#left-panel');
  var centerPanel = $('#center-panel');
  var rightPanel = $('#right-panel');

  $.each(widgetLayout,function(index, el) {
    var widgetName = el.name;
    var widgetLabel = el.label;
    var widgetLayout = el.layout;

    if(widgetLayout=="left"){
      Core.addWidget(widgetName, leftPanel);
    }else if(widgetLayout=="center"){
      Core.addWidget(widgetName, centerPanel);
    }else if(widgetLayout=="right"){
      Core.addWidget(widgetName, rightPanel);
    }

    Core.registerWidgetSettingList(widgetName,widgetLabel,widgetLayout);//注册到设置面板
  });

  //links
  $('#settings .add-link').click(function(event) {
    var label = $.trim($('#settings .link-label').val());
    var website = $.trim($('#settings .link-website').val()) ;

    if(label == "" || website == ""){
      $('#settings .links-tip').text('内容不能为空');
    }else if(!Core.checkUrl(website)){
      $('#settings .links-tip').text(website+' 不是一个合法的网址');
    }else{
      if(website.indexOf("http")<0){
        website = "http://" + website;
      }

      var linksSettings = Core.settings.get("links");
      var obj = {
        label:label,
        website:website
      }
      if(linksSettings){
        for(var i=0;i<linksSettings.length;i++){
          if(linksSettings[i].website == website){
            $('#settings .links-tip').text('网址已存在');
            return;
          }
        }

        linksSettings.push(obj);
      }else{
        linksSettings = [obj];
      }
      Core.settings.set("links", linksSettings);
      // console.log(linksSettings);
      Core.updateLinks();
    }
  });
  $('#settings .links-list').on('click', 'i.fa', function(event) {
    event.preventDefault();
    /* Act on the event */
    var deleteUrl = $(this).parent('.links-item').attr('href');
    var linksSettings = Core.settings.get("links");
    $.each(linksSettings,function(index, el) {
      if(el.website == deleteUrl){
        linksSettings.splice(index, 1);
        return false;
      }
    });
    Core.settings.set("links",linksSettings);
    // console.log(linksSettings);
    Core.updateLinks();
  });

  var linksSettings = Core.settings.get("links");
  if(!linksSettings){
    var defaultLinks = [{
      label:"Gmail",
      website:"https://mail.google.com/mail/"
    }];
    Core.settings.set("links",defaultLinks);
  }
  Core.updateLinks();

  //系统
  $('#settings .system-reset').click(function(event) {
    console.log("清除所有localStorage");
    localStorage.clear();
    location.reload(true);
  });
})
