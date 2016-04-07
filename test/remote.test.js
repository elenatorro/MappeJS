var Mappe = require('../src/Mappe.js')
var assert = require('assert')
var fs = require('fs-extra')

var mappe = Mappe(__dirname)

var mappeTestPath = './test'
var mappeFileConfig = [mappeTestPath, 'mappe.test.json'].join('/')

describe('Read remote file content from mappe.json file: ', function () {
  mappe.setup(mappeFileConfig)
  it('should read remote .js file', function () {
    assert(mappe.getExtensionContent)
    assert.equal(mappe.getExtensionContent('default', 'js'), '/* remote content */')
  })
})