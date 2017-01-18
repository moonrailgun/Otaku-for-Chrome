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

    }
  };

  window.Core = Core;
});
