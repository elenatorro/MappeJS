/*! https://elenatorro.github.io/mappe v0.0.1 by elenatorro | MIT license */
;(function () {
  const fse = require('fs-extra')
  const fs = require('fs')
  const changeCase = require('change-case')
  const Acho = require('acho')
  const defaultConfig = {
    styles: {
      default: ['camelCase', 'upperCaseFirst']
    },
    components: {
      default: {
        js: 'default'
      }
    }
  }

  const Mappe = function (path) {
    const mappe = {}
    const acho = new Acho()

    mappe.path = (path || '.') + '/'
    mappe.version = '0.0.1'
    mappe.default = 'default'
    mappe.config = defaultConfig
    mappe.configPath = mappe.path + 'mappe.json'

    mappe.read = function () {
      try {
        mappe.config = fse.readJsonSync(mappe.configPath, {throws: false}) || {}
      } catch (error) {
        acho.warn('No mappe config, mappe.json file automatically generated with default config')
        mappe.errors[error.code]()
      }
      mappe.validConfig(mappe.config)
      mappe.write()
    }

    mappe.setDefault = function (config, property) {
      mappe.config[property] = config[property] || mappe[property] || defaultConfig[property]
    }

    mappe.validConfig = function (config) {
      mappe.setDefault(config, 'components')
      mappe.setDefault(config.components, 'default')
      mappe.setDefault(config, 'styles')
      mappe.setDefault(config.styles, 'default')
    }

    mappe.write = function () {
      fse.writeJsonSync(mappe.configPath, mappe.config)
    }

    mappe.generate = mappe.g = function (name, component, content) {
      mappe.read()
      name = mappe.fileName(name, component || 'default')
      fse.mkdirsSync(mappe.path + name)
      for (var extension in mappe.config.components[component || 'default']) {
        fs.writeFileSync(mappe.path + mappe.filePath(name, extension, component || 'default'), content)
      }
      return acho.success('Component: ' + name + ' generated')
    }

    mappe.filePath = function (name, extension, component) {
      return [name, mappe.addExtension(name, extension)].join('/')
    }

    mappe.fileName = function (name, component) {
      mappe.config.styles[component].forEach(function (style) {
        name = changeCase[style](name)
      })
      return name
    }

    mappe.addExtension = function (name, extension) {
      return [name, extension].join('.')
    }

    mappe.info = function () {
      acho.info(JSON.stringify({
        'config': mappe.config,
        'path': mappe.configPath,
        'default style': mappe.default,
        'version': mappe.version
      }))
    }

    mappe.errors = {
      'ENOENT': mappe.write
    }

    return mappe
  }

  module.exports = Mappe
}())
