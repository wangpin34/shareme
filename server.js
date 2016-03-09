var app = require('koa')();
const router = require('koa-router')();
var fs = require('fs');
var contentType = require('content-type-mime');

app
  .use(router.routes())
  .use(router.allowedMethods());


const Jade = require('koa-jade')
const jade = new Jade({
  viewPath: './views',
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


var files,
    fullFiles;


function clone(obj){
  var copy = {};
  for(var x in obj){
    if(typeof obj[x] === 'object'){
      copy[x] = clone(obj[x]);
    }else{
      copy[x] = obj[x];
    }
  }
  return copy;
}

function searchFile(id){

  if(!files){
    files = require('./data/data.json').files;
    fullFiles = clone(files);
  }
  for(var x in files){
    var o = {};
    o.name = files[x].name;
    files[x] = o;
  }

  if(!id){
    return files;
  }else{
    return fullFiles[id];
  }
}


router
  .get('/', function *(next) {
  	var files = searchFile();
    console.log(JSON.stringify(files));
  	this.render('index', { files:files }, true)
    //this.body = data;
  })
  .get('files/:id',function *(next){
    yield next;

  })
  .post('/files', function *(next) {
    // ...
  })
  .put('/files/:id', function *(next) {
    // ...
  })
  .del('/files/:id', function *(next) {
    // ...
  })

  .get('/files/:id/download', function *(next){
      yield next;
      var req = this.request;
      var res = this.response;

      var id = this.params.id;
      var file = searchFile(id);

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
      var req = this.request;
      var res = this.response;

      var id = this.params.id;
      var file = searchFile(id);

      res.type = contentType(file.name);
      res.body = fs.createReadStream(file.path,{
                      flags: 'r',
                      encoding: null,
                      fd: null,
                      mode: 0o666,
                      autoClose: true
                    });
  });


console.log('shareme started on port %s', 3000);
app.listen(3000);