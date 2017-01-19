(function(){
	var appURL = chrome.extension.getURL("index.html");

	chrome.browserAction.onClicked.addListener(function() {
		chrome.tabs.create({
			url: appURL
		});
	});
})();
