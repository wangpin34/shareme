'use strict'
const app = require('koa')();
const router = require('koa-router')();
const fs = require('fs');
const contentType = require('content-type-mime');
const path = require('path')

const basedir = path.dirname(process.argv[1])
const dataFile = path.join(basedir, './data/data.json')

app
  .use(router.routes())
  .use(router.allowedMethods());


const Jade = require('koa-jade')
const jade = new Jade({
  viewPath: path.join(basedir, 'views'),
  debug: false,
  pretty: false,
  compileDebug: false,
  //locals: global_locals_for_all_pages,
  //basedir: 'path/for/jade/extends',
/*  helperPath: [
    'path/to/jade/helpers',
    { random: 'path/to/lib/random.js' },
    { _: require('lodash') }
  ],*/
  app: app // equals to jade.use(app) and app.use(jade.middleware)
})

jade.locals.someKey = 'some value';

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


router
  .get('/', function *(next) {
  	var files = getFiles()
  	this.render('index', { files:files }, true)
  })

  .get('/files/:id/download', function *(next){
      yield next;
      var req = this.request;
      var res = this.response;

      var id = this.params.id;
      var file = getFilesWithPathInfo()[id];

      res.type = contentType(file.name)
      res.attachment(file.name);
      res.body = fs.createReadStream(file.path,{
                      flags: 'r',
                      encoding: null,
                      fd: null,
                      mode: 0o666,
                      autoClose: true
                    });
  })
  .get('/files/:id/preview', function *(next){
      yield next;
      let req = this.request
      let res = this.response

      let id = this.params.id
      let file = getFilesWithPathInfo()[id]

      res.type = contentType(file.name);
      res.body = fs.createReadStream(file.path,{
                      flags: 'r',
                      encoding: null,
                      fd: null,
                      mode: 0o666,
                      autoClose: true
                    })
  });


console.log('shareme started on port %s', 3000);
app.listen(3000);