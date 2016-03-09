var child_process = require('child_process');
var store = require('./store');

//Commands

//1. Help 
var helpMsg = '' +
	'add    [file path]  Add file to share list' + '\n' + 
 	'delete [file path]  Delete file from share list ' + '\n' +  
 	'startup             Start sharing' + '\n' +  
'';

var errMsgs = {
	unReg:function(arg){
		return arg + ' could not be discerned';
	}
};

function dispatcher(){
	var cmd = arguments.length&&arguments[0],filepath,msg;
	if(arguments.length === 1){
		cmd = arguments[0];
		if(cmd === 'help'){
			msg = helpMsg;
		}else if(cmd === 'start'){
			require('./server.js');
			msg = 'start sharing';
		}else{
			msg = errMsgs.unReg(cmd);
		}
	}else if(arguments.length === 2){
		cmd = arguments[0];
		filepath = arguments[1];
		msg = 'two args';
		switch(cmd){
			case 'add' : store.add(filepath); msg = filepath + ' has been added to share list'; break ;
			case 'delete' : store.delete(filepath); msg = filepath + ' has been deleted from share list'; break ;
			default : break;
		}
	}else{
		msg = errMsgs.unReg(cmd);
	}
	return msg;
} 

var args = process.argv.slice(2);
var msg = dispatcher.apply(new Object,args);
console.log(msg);