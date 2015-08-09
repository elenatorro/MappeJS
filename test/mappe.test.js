var Mappe = require('../src/Mappe');
var should = require("should");
var mappe = new Mappe();

describe('Create Mappe object: ', function(){
	it('should return a Mappe object when creating one', function(){
	  mappe.should.be.ok;
	})

	it('should have a method called "loadConfig"', function(){
	  mappe.loadConfig.should.be.ok;
	})

	it('should load the content of a json file', function(){
	  mappe.loadConfig('./test/test.json');
	  mappe.config.test.should.be.true;
	})

	it('should load the content of a json file', function(){
	  mappe.loadConfig('./test/config.json');
	  mappe.generate('index');
	})
})