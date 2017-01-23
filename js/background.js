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
})();
