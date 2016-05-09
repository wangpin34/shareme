/*
 * Data storage, provide file info save,remove interface
 */
 'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const md5sum = crypto.createHash('md5')
const os = require('os')

let dataFile = path.join(os.homedir(), 'shareme.data')
let data;
let dataTemplate =  {

		//Store file info 
		// hash : { name : 'xxx', path : 'xxx'} 
		files : {

		}

}


data = fs.existsSync(dataFile) ? JSON.parse( fs.readFileSync(dataFile,{encoding:'utf-8'}) ) : dataTemplate;	

//Private functions
var funcs = {
	updateData : function(filepath,data){
		fs.writeFile(filepath,JSON.stringify(data, null, 4),function(err){
			if(err){
				console.log(err);
			}
		});
	},
	encodeFilepath : function (filepath){
		return md5sum.update(filepath).digest('hex');
	}
}

var main = {
	add : function(filepath){
		if(fs.existsSync(filepath)){
			var fullPath = path.join(process.cwd(),filepath);
			var hashId = funcs.encodeFilepath(fullPath);
			if(!data.files[ hashId ]){
				data.files[ hashId ] = { name : path.basename(fullPath), path : fullPath  };
				funcs.updateData(dataFile,data);	
			}
			
		}

	},
	delete : function(filepath){
		let absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(),filepath)
		let hashId = funcs.encodeFilepath( absolutePath )
		if(data.files[hashId]){
			delete data.files[hashId]
			funcs.updateData(dataFile,data)
		}
	},
	list: function(){
		let files = []
		for(let x in data.files){
			files.push(data.files[x])
		}
		return files
	}

}

module.exports = main;