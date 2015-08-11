'use strict';

var fs = require('fs-extra');

var Mappe = (function() {
	function Mappe() {
		this.config = null;
		this.configPath = 'mappe.json';
	}

	Mappe.prototype.loadConfig = function() {
		var configPath = this.configPath;
		var config = fs.readJsonSync(configPath, {throws: false});
		return this.setConfig(config);
	};

	Mappe.prototype.setConfigPath = function(configPath) {
		this.configPath = configPath;
		return this;
	}

	Mappe.prototype.saveConfig = function() {
		var config = this.config;
		var configPath = this.configPath;
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
		this.config.default.forEach(function (extension) {
			fs.writeFileSync(path + '/' + name + '.' + extension, "");
		})
		return this;
	};

	Mappe.prototype.define = function(name, model) {
		this.loadConfig();
		this.config.components[name] = model;
		return this.saveConfig();
	};

	return Mappe;
})();

module.exports = Mappe;

