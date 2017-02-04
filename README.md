# Otaku-for-Chrome
![](/icon/128.png)

**Otaku - 新标签页替换**

## 安装与简介

[Chrome 应用商店](https://chrome.google.com/webstore/detail/otaku-%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%9B%BF%E6%8D%A2/meobjhkdifjealkiaanikkpajiaalcad)
或者在[github release](https://github.com/moonrailgun/Otaku-for-Chrome/releases)下载对应的crx安装包进行手动安装

![](/images/预览.jpg)
![](/images/预览2.jpg)

## 环境与依赖
为了使项目轻量化，依赖内容仅为:
- dom操作库 `jquery`
- 沙盒文件操作库 `filer.js`
- 字符字体 `font-awesome`
- 全局格式与栅格布局 `bootstrap-grid`与`bootstrap-reboot`

没有大型的JS框架应用。使项目小型化

## 小部件的开发与约定
### 简介
遵从jquery ajax方法加载网页内容的方式注册widget  

### 约定
所有部件位于widgets目录下，部件名必须唯一。部件入口文件必须命名为 `index.html`。部件内容必须包裹在一个id与部件名相同的div下。
css与jquery选择器必须前置根dom节点id名防止污染。

如时钟部件:  
`widgets/clock/index.html`
```html
<style>
#clock{
  /*...*/
}

#clock .date{
  /*...*/
}
</style>
<div id="clock">
  <!-- ... -->
</div>
<script>
$('#clock .class');
</script>
```

也可以分离js与css文件。引入方式遵循ajax载入解析方式。

## 注册小部件信息到设置页面
可以通过`Core.widgetSettings.registerUI(widgetName,data,widgetLabel)`方法来将部件的设置内容注册到主设置中。以达到给用户自定义个性化设置的目的。

- widgetName:部件的唯一名
- data:注册的数据，是一个数组，可以注册多个值
  - type:输入input标签的类型。如text
  - name:输入标签的唯一名
  - label:输入标签的对应显示名。为一个对象{唯一名:显示名}
- widgetLabel:部件的显示名，可以为空

天气的例子：
```JavaScript
Core.widgetSettings.registerUI("weather",[{
  type:"text",
  name:"city",
  label:{
    city:"城市"
  }
}],"天气");
```


### 应用部件
在`js/main.js`目录下找到默认部件js对象`defaultWidgetLayout`上，手动添加部件内容。并删除`localStorage`上的`setting`内容使应用能够加载默认部件列表。
添加的部件信息格式如下:
```js
{
  name:"部件唯一名(英文)",
  label:"部件中文名",
  layout:"部件默认位置(left/center/right)"
}
```

## 开源协议
基于GPLv3发布开源协议：[协议内容](./LICENSE)
