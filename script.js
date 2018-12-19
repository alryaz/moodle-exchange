var runExchange = function() {
	// settings
	var answersUrl = 'https://raw.githubusercontent.com/alryaz/moodle-exchange/master/answers/' + window.location.hostname + '.json';
	var skipNumber = 0;
	var showAll = false;
	var enabled = true;

	// data
	var data = [];
	var cheatInterval;
	var topBar = document.createElement('div');
	topBar.style.cssText = "position:fixed;bottom:0;left:0;background:white;z-index:9999999;font-size:12px;font-weight:400;color:black;padding:2px;max-height:60%;overflow-y:auto";
	document.body.appendChild(topBar);
	
	resetHint = function(){
		topBar.innerHTML = "_";
	}
	showHint = function(content){
		topBar.innerHTML = content;
	}

	// panic
	var one=false,two=false;
	window.onkeydown = function(e) {
		if(e.keyCode == 65) {
			clearInterval(cheatInterval);
			showHint('');
		}
		if(e.keyCode == 83) {
			showAll = !showAll;
			console.log('showAll', showAll);
		}
		if(e.keyCode == 68) {
			skipNumber += 1;
		}
	}

	// selection parser
	function getSelectionText() {
		var text = "";
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection && document.selection.type != "Control") {
			text = document.selection.createRange().text;
		}
		return text;
	}

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				//lowercase data
				casedData = JSON.parse(xhr.responseText);
				data = casedData.map(function(item) {return {"q":item.q.toLowerCase(),"a":item.a}})

				// show loaded sign
				showHint("loaded!!!");

				var doSelelection = '';
				cheatInterval = setInterval(function() {
					var nowSelection = getSelectionText().toLowerCase().trim();
					if(nowSelection == '') {
						skipNumber = 0;
						resetHint();
					} else if(doSelelection != nowSelection) {
						doSelelection = '';
						var k = 0;
						for (var i = 0; i < data.length; i++) {
							var q = data[i].q;
							var pos = q.indexOf(nowSelection);
							if (pos != -1) {
								k+=1;
								if(k > skipNumber) {
									var end = pos+nowSelection.length;
									doSelelection += q.slice(0,pos)+'<u><b>'+q.slice(pos,end)+'</b></u>'+q.slice(end)+'<br/>'+data[i].a;
									if(!showAll) break;
									else doSelelection += '<br/><br/>';
								}
							}
						}
						if(doSelelection == '') doSelelection = 'not found';
						showHint(doSelelection);
					}

				}, 200);
			} else {
				showHint("failed");
			}
		}
	};
	xhr.open("GET", answersUrl, true);
	xhr.send();

	console.log('cheat loaded');
};

var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		runExchange();
	}
}, 10);
