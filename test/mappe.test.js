var should = require("should");
var fse = require('fs-extra');
var fs = require('fs');

var Mappe  = require('../src/Mappe');
var mappe  = new Mappe();

describe('Create Mappe object: ', function(){
	it('should return a Mappe object when creating one', function(){
	  mappe.should.be.ok;
	})

	it('should have a method called "loadConfig"', function(){
	  mappe.loadConfig.should.be.ok;
	})

	it('should load the content of a json file', function() {
	  mappe.setConfigPath('./test/test.json');
	  mappe.loadConfig();
	  mappe.config.test.should.be.true;
	})

	it('should generate a modular folder with the default configuration', function() {
	  mappe.setConfigPath('./test/config.json');
	  mappe.generate('index');
	  fs.exists('./index', function(exists) {
	  	exists.should.be.true;
	  });
	  fs.exists('./index/index.js', function(exists) {
	  	exists.should.be.true;
	  });
	  fs.exists('./index/index.css', function(exists) {
	  	exists.should.be.true;
	  });
	})
})

describe('Create components: ', function(){
	it('should define a mappe component called "box"', function(){
	  mappe.setConfigPath('./test/mappe.json');
	  mappe.define('box', 'default');
	  mappe.config.components.box.should.be.ok;
	})
})