'use strict';

var fs = require('fs-extra');

var Mappe = (function() {
	function Mappe() {
		this.config = null;
		this.configPath = 'mappe.json';
	}

	Mappe.prototype.loadConfig = function() {
		var configPath = this.configPath;
		try {
			var config = fs.readJsonSync(configPath, {throws: false});
		} catch (error) {
			console.log('There was a problem with your config path file.');
			console.log('Config path: ', configPath);
		}
		return this.setConfig(config);
	};

	Mappe.prototype.setConfigPath = function(configPath) {
		this.configPath = configPath || 'mappe.json';
		this.loadConfig();
		return this;
	}

	Mappe.prototype.saveConfig = function() {
		var config = this.config;
		var configPath = this.configPath || 'mappe.json';
		fs.writeJsonSync(configPath, config, {throws: false});
		return this;
	};

	Mappe.prototype.setConfig = function(config) {
		this.config = config;
		return this;
	};

	Mappe.prototype.generate = function(name) {
		this.loadConfig();
		var path = './' + name;
		fs.mkdirsSync(path);
		try {
			this.config.default.forEach(function (extension) {
				fs.writeFileSync(path + '/' + name + '.' + extension, "");
			});
		} catch (error) {
			var configPath = this.configPath;
			console.log('There was a problem with your config path file.');
			console.log('Config path: ', configPath);
		}

		return this;
	};

	Mappe.prototype.setDefaultConfig = function() {
	  this.config = {"default": ["js","css"],"components": {}};
	  this.saveConfig();
	};

	Mappe.prototype.define = function(name, model) {
		this.loadConfig();
		this.config.components[name] = model;
		return this.saveConfig();
	};

	return Mappe;
})();

module.exports = Mappe;

