$(function(){
  var Core = {
    addWidget:function(widgetName, container){
      if(!container){
        container = $('#center-panel');
      }

      var url = "../widgets/" + widgetName + "/index.html";
      $.get(url,function(data,status){
        container.append(data);
      });
    },
    loadWallPaper:function(wallPaperUrl){
      var obj = new Image();

      obj.onload = function(){
        $("#background img").attr('src', wallPaperUrl);
        obj.src = "",
        $(obj).remove()
      }
      obj.onerror = function(){
        $(obj).remove();
      }
      return obj.src = wallPaperUrl;
    },
    settings:{
      add:function(key, value){
        var localSetting = localStorage.setting;
        var obj = {};
        if(localSetting){
          obj = JSON.parse(localSetting);
          if("undefined" == typeof obj[key]){
            obj[key] = value;
          }else{
            //该项已存在
          }
        }else{
          obj[key] = value;
        }
        localStorage.setting = JSON.stringify(obj);
      },
      get:function(key){
        var localSetting = localStorage.setting;
        var obj = JSON.parse(localSetting);
        if(typeof obj[key] == "undefined"){
          return ""
        }else{
          return obj[key]
        }
      },
      set:function(key,value){
        var localSetting = localStorage.setting;
        var obj = {};
        if(localSetting){
          obj = JSON.parse(localSetting);
          obj[key] = value;
        }else{
          obj[key] = value;
        }
        localStorage.setting = JSON.stringify(obj);
      }
    },
    checkUrl:function(url){
      // var RegUrl = new RegExp();
      // RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
      // if (!RegUrl.test(str)) {
      //     return false;
      // }
      // return true;
      var domainNameList = [
        ".ac",
        ".top",
        ".com",
        ".cn",
        ".top",
        ".edu",
        ".gov",
        ".mil",
        ".arpa",
        ".net",
        ".org",
        ".biz",
        ".info",
        ".pro",
        ".name",
        ".coop",
        ".aero",
        ".museum",
        ".mobi",
        ".asia",
        ".tel",
        ".int",
        ".cc",
        ".us",
        ".travel",
        ".xxx",
        ".idv"
      ];
      var res = false;
      $.each(domainNameList, function(index, el) {
        if(url.indexOf(el) > 0){
          res = true;
        }
      });
      return res;
    },
    toggleSettings:function(){
      $('#settings').toggleClass('active');
      $('#overlay').toggleClass('active');
    },
    widgetSettings:{
      set:function(widgetName, jsonData){
        widgetName = "widget-" + widgetName;
        var data = jsonData;
        if("object" == typeof data){
          data = JSON.stringify(data);
        }
        localStorage[widgetName] = data
      },
      get:function(widgetName){
        widgetName = "widget-" + widgetName;
        var ls = localStorage[widgetName];
        if(ls){
          return JSON.parse(ls);
        }else{
          return undefined;
        }

      },
      //widgetLabel可以为空
      registerUI:function(widgetName,data,widgetLabel){
        var html = '<div class="content-item" data-menu="'+widgetName+'">';
        var ws = Core.widgetSettings.get(widgetName);
        for(var i=0;i<data.length; i++){
          var item = data[i];
          var itemHtml = '';
          var label = item.label;
          itemHtml += '<label>'+ (label[item.name]?label[item.name]:item.name) +'</label>';
          itemHtml += '<input type="'+item.type+'" data-name="'+item.name+'" value="'+ws[item.name]+'">';
          html += itemHtml;
        }
        html += '</div>';

        $('#settings .menu-list').append('<div class="menu-item" data-menu-name="'+widgetName+'">'+(widgetLabel?widgetLabel:widgetName)+'</div>');
        $('#settings .content').append(html);
      }
    }
  };

  window.Core = Core;
});
