'use strict'

const fs = require('fs');
const contentType = require('content-type-mime');
const path = require('path')
const jade = require('jade')
const http = require('http')

const basedir = path.dirname(process.argv[1])
const dataFile = path.join(basedir, './data/data.json')
const viewPath = path.join(basedir, 'views')
const assetPath = path.join(basedir, 'assets')

const PREFIX = ':'
const DELIMITER = '/'
const PORT = process.argv.splice(2)[0] || 4000


function genParams(url, pattern){
  let paramIndexes = []
  let params = {}
  
  pattern.split(DELIMITER).forEach(function(p, index){
    if(p.indexOf(PREFIX) === 0){
      paramIndexes.push({index: index, name: p.replace(PREFIX,'')})
    }
  })

  url = url.split(DELIMITER)
  paramIndexes.forEach(function(p){
    if( (typeof url[p.index]) !== undefined){
      params[p.name] = url[p.index]
    }
  })

  return params
}


function getFilesWithPathInfo(){
  return JSON.parse( fs.readFileSync(dataFile,{encoding:'utf-8'}) ).files
}

function getFiles(){
  let filesPathes = getFilesWithPathInfo()
  let files = []
  for( let x in filesPathes){
    let file = filesPathes[x]
    files.push({id: x, name: file.name})
  }
  return files
}


let tss = http.createServer((req, res) => {

  if(req.url.lastIndexOf('.') != -1){
    let filePath = path.join(assetPath, req.url)
    if(fs.existsSync(filePath)){
      fs.createReadStream(filePath).pipe(res)
      return
    }else{
      res.statusCode = 404
      res.end('not found')
      return
    }
  }


  let params = genParams(req.url, '/files/:id/:action')
  if(params.id){
    let id = params.id
    let action = params.action
    let file = getFilesWithPathInfo()[id]

    res.setHeader('Content-Type', contentType(file.name))

    if(action === 'download'){
      res.setHeader('Content-Disposition', 'attachment;filename=' + file.name)
    }

    try{
          fs.existsSync(file.path) ? fs.createReadStream(file.path,{
                      flags: 'r',
                      encoding: null,
                      fd: null,
                      mode: 0o666,
                      autoClose: true
                    })
          .pipe(res) : res.end('file not found')
    }catch(err){
      console.error(err)
      res.end('Unexpected error happend when shareme fetch file data you want, please try later') 
    }

  }else{
    let files = getFiles()
    res.setHeader('Content-Type','text/html')
    res.end(jade.renderFile( path.join(viewPath, 'index.jade'), {cache: false, files: files} ), 'utf-8')
  }

})


tss.listen(PORT)
console.log('Shareme startup on port ' + PORT)