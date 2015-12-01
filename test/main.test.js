var Mappe = require('../src/Mappe.js')
var assert = require('assert')
var should = require('should')
var fs = require('fs-extra')

var mappe = Mappe(__dirname)

var mappeTestPath = './test'
var mappeFileConfig = [mappeTestPath, 'mappe.json'].join('/')

describe('Read configuration from mappe.json: ', function () {
  var isValidConfig = function () {
    assert(mappe.config.styles)
    assert(mappe.config.styles.default)
    assert(mappe.config.components)
    assert(mappe.config.components.default)
  }

  it('should create it if it does not exist', function () {
    mappe.read()
    assert(fs.existsSync(mappeFileConfig))
  })

  it('should set default config if it was not setted in the json file', function () {
    assert.equal(mappe.config.default, 'default')
    isValidConfig()
  })

  it('should set default config if the given json is not complete', function () {
    fs.writeJsonSync(mappeFileConfig, {})
    mappe.read()
    isValidConfig()
  })

  it('should generate a directory for a given component using the default configuration', function () {
    mappe.generate('index')
    assert(fs.existsSync('./test/Index'))
    assert(fs.existsSync('./test/Index/Index.js'))
  })

  it('should generate a directory for a given component using the default configuration using only "g"', function () {
    mappe.g('index2')
    assert(fs.existsSync('./test/Index2'))
    assert(fs.existsSync('./test/Index2/Index2.js'))
  })

  it('should generate a directory for a given component using the default configuration 2', function () {
    mappe.generate('index component')
    assert(fs.existsSync('./test/IndexComponent'))
    assert(fs.existsSync('./test/IndexComponent/IndexComponent.js'))
  })

  after(function () {
    fs.remove(mappeFileConfig)
    fs.removeSync([mappeTestPath, 'Index'].join('/'))
    fs.removeSync([mappeTestPath, 'Index2'].join('/'))
    fs.removeSync([mappeTestPath, 'IndexComponent'].join('/'))
  })
})
