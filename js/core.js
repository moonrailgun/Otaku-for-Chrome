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
    }
  };

  window.Core = Core;
});
