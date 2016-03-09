/*
 * Data storage, provide file info save,remove interface
 */

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');

var dataFile = './data/data.json';
var data;
var dataTemplate =  {

		//Store file info 
		// hash : { name : 'xxx', path : 'xxx'} 
		files : {

		},
		//Store index
		// path : hash
		index : {

		}
};


data = fs.existsSync(dataFile) ? require(dataFile) : dataTemplate;	

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
		var hashId = funcs.encodeFilepath( path.join(process.cwd(),filepath) );
		if(fs.existsSync(filepath) && data.files[hashId]){
			delete data.files[hashId];
			funcs.updateData(dataFile,data);	
		}
	}

}

module.exports = main;