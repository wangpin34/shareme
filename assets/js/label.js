function addEvent(element, type, listener){

	var funcWrapper = function(e){
		var event = e || window.event;
		listener(event)
	}

	if(element.addEventListener){
		element.addEventListener(type, funcWrapper);
	}else{
		element.attach('on' + type, funcWrapper);
	}
}


var promptDiv = document.createElement('div');
promptDiv.setAttribute('class','prompt');
document.body.appendChild(promptDiv);

var labels = document.querySelectorAll('label');
var length = labels.length;
var showPromptTimeout = null;
var hiddenPromptTimeout = null;
for(var i = 0 ; i < length ; i++){
	addEvent(labels[i], 'mouseover', function(e){
		window.clearTimeout(showPromptTimeout);
		window.clearTimeout(hiddenPromptTimeout);
		showPromptTimeout = setTimeout(function(){
			var textNode = null;
			if((textNode = promptDiv.childNodes[0])){
				textNode.remove();
			}
			var content = e.target.innerHTML;
			var newContent = document.createTextNode(content); 
			promptDiv.appendChild(newContent);
			promptDiv.style.display = 'block';
			promptDiv.style.left = e.clientX + 'px';
			promptDiv.style.top = e.clientY + 'px';
		}, 500)

		
	})

	addEvent(labels[i], 'mouseout', function(e){
		hiddenPromptTimeout = setTimeout(function(){
			promptDiv.style.display = 'none';	
			console.log('hidden prompt');
		}, 1000)
	})
}



