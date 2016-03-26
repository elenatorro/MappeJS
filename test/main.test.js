var Mappe = require('../src/Mappe.js')
var assert = require('assert')
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
    mappe.generate('index', 'default')
    assert(fs.existsSync('./test/index'))
    assert(fs.existsSync('./test/index/index.js'))
  })

  it('should generate a directory for a given component using the default configuration using only "g"', function () {
    mappe.g('index2', 'default')
    assert(fs.existsSync('./test/index2'))
    assert(fs.existsSync('./test/index2/index2.js'))
  })

  it('should generate a directory for a given component using the default configuration', function () {
    mappe.generate('index component', 'default')
    assert(fs.existsSync('./test/indexComponent'))
    assert(fs.existsSync('./test/indexComponent/indexComponent.js'))
  })

  it('should create an empty directory for using default configuration', function () {
    mappe.folder('index folder', 'default')
    assert(fs.existsSync('./test/indexFolder'))
  })

  it('should create a file for a certain path using default configuration', function () {
    mappe.file('indexFolder', 'js', 'index file', 'default')
    assert(fs.existsSync('./test/indexFolder/indexFile.js'))
  })

  it('should create a file for each file for a certain path using default configuration', function () {
    mappe.files('indexFolder', 'index files', 'default')
    assert(fs.existsSync('./test/indexFolder/indexFiles.js'))
  })

  it('should display main mappe info', function () {
    assert(mappe.info)
  })

  after(function () {
    fs.remove(mappeFileConfig)
    fs.removeSync([mappeTestPath, 'index'].join('/'))
    fs.removeSync([mappeTestPath, 'index2'].join('/'))
    fs.removeSync([mappeTestPath, 'indexFolder'].join('/'))
    fs.removeSync([mappeTestPath, 'indexComponent'].join('/'))
  })
})
