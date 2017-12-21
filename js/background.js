(function(){
	var appURL = chrome.extension.getURL("index.html");
	var appTabId = 0;

	var createAppTab = function(){
		chrome.tabs.create({
			url: appURL
		},function(tab){
			appTabId = tab.id;
		});
	}

	chrome.browserAction.onClicked.addListener(function() {
		if(appTabId != 0){
			chrome.tabs.get(appTabId,function(tab){
				if(tab){
					chrome.tabs.highlight({tabs:tab.index});
				}
				else{
					createAppTab();
				}
			});
		}else{
			createAppTab();
		}
	});

  // 设置圣诞帽
	function isChristmasPeriod(){
		var nowDate = new Date();
		var isEndNovember = (nowDate.getMonth() == 10 && nowDate.getDate() >= 28);
		var isDecember = (nowDate.getMonth() == 11);
		var isStartJanuary = (nowDate.getMonth() == 0 && nowDate.getDate() <= 8);
		var isChristmasDate = (isEndNovember || isDecember || isStartJanuary);
		return isChristmasDate;
	}
	function setChristmasIcon() {
		if (isChristmasPeriod()) {
			chrome.browserAction.setIcon({"path":"/icon/16-xmas.png"});
		} else {
			chrome.browserAction.setIcon({"path":"/icon/16.png"});
		}
	}
	setChristmasIcon();
	setInterval(setChristmasIcon, 24 * 60 * 60 * 1000); //每天检测
})();
