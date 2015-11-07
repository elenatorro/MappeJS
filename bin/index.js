#! /usr/bin/env node

var Mappe = require('../src/Mappe'); 

var cli = require('meow')({
  pkg: '../package.json'
  // help: fs.readFileSync(__dirname + '/help.txt', 'utf8')
});

var fs = require('fs');
var mappe = new Mappe();
mappe.loadConfig('./mappe.json');

var command = cli.input.shift();

var commands = {
	generate: function() {
		mappe.generate(cli.input[0]);
	},
	define: function() {
		mappe.define(cli.input[0], cli.input[1]);
	},
	add: {
		config: function() {
			mappe.setConfigPath(cli.input[0]);
		},
		default: function() {
			mappe.setDefaultConfig();
		}
	},
	load: {
		config: function() {
			mappe.loadConfig();
		}
	}
};

var existCommand = Object.keys(commands).indexOf(command) > -1;

if (existCommand) {
    return commands[command]();
};

cli.showHelp();