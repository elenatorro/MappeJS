'use strict';

var fs = require('fs-extra');

var Mappe = (function() {
	function Mappe() {
		this.config = null;
	}

	Mappe.prototype.loadConfig = function(filepath) {
		var config = fs.readJsonSync(filepath, {throws: false});
		this.setConfig(config);
	};

	Mappe.prototype.setConfig = function(config) {
		this.config = config;
	};

	Mappe.prototype.generate = function(name) {
		var path = './' + name;
		fs.mkdirsSync(path);
		this.config.default.forEach(function (extension) {
			fs.writeFileSync(path + '/' + name + '.' + extension, "");
		})
	};

	return Mappe;
})();

module.exports = Mappe;

