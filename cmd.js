#! /usr/bin/env node
'use strict'

const exec = require('child_process').exec
const store = require('./store')
const path = require('path')
const fs = require('fs')

const basedir = path.dirname(process.argv[1])
const logFile = path.join(basedir, 'server.log')

const ADD = 'add'
const DELETE = 'delete'
const LIST = 'list'
const START = 'start'


const argv = require('yargs')
	.command(ADD, '-A', function(args){
		let argv = args.reset()
			.argv
		let file = argv._[1]
		dispatch(ADD,{file:file})
		console.log('Added '+ file + ' into shared-list successfully')
	})
	.command(DELETE, '-D', function(args){
		let argv = args.reset()
			.argv
		let file = argv._[1]
		dispatch(DELETE,{file:file})
		console.log('Removed '+ file + ' from shared-list successfully')
	})
	.command(LIST, '-L', function(args){
		let files = dispatch(LIST).map(function(f){
			return f.name + ' *** ' + f.path
		})
		console.log('All shared files \n\n' + files.join('\n'))
	})
	.command(START, START, function(args){
		console.log('Start sharing')
		let argv = args.reset()
					.alias('p','port')
					.argv
		let port = argv.p
		dispatch(START, {port: port})
	})
	.usage('Usage: shareme [options]')
	.example('shareme add photo.jpg', 'Add photo.jpg into shared list')
	.help('h')
	.alias('h','help')
	.epilog('copyright 2016')
	.argv

return

function dispatch(action,option){
	switch(action){
		case ADD: return store.add(option.file)
		case DELETE: return store.delete(option.file)
		case LIST: return store.list()
		case START: 
			let child = exec('node --harmony "' + path.join(basedir, 'server.js') + '" ' + (option.port||'') , function(err, stdout, stderr){
				if(err) log(err)
				log(stdout)
    			log(stderr)
			})
			return
		default : return
	} 
}

function log(str){
	fs.appendFileSync(logFile, new Date())
	fs.appendFileSync(logFile, str)
}