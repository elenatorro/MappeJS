/*! https://elenatorro.github.io/mappe v0.0.1 by elenatorro | MIT license */
;(function () {
  const fse = require('fs-extra')
  const fs = require('fs')
  const changeCase = require('change-case')
  const Acho = require('acho')
  const defaultConfig = {
    default: 'default',
    styles: {
      default: ['camelCase', 'upperCaseFirst']
    },
    components: {
      default: {
        title: 'default',
        extensions: {
          js: 'default'
        }
      }
    }
  }

  const Mappe = function (path) {
    const mappe = {}
    const acho = new Acho()

    mappe.path = (path || '.') + '/'
    mappe.version = '0.0.1'
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
      mappe.config[property] = mappe.config[property] || defaultConfig[property]
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

    mappe.titleStyle = function (component) {
      return mappe.config.components[component].title
    }

    mappe.extensionStyle = function (component, extension) {
      return mappe.config.components[component].extensions[extension]
    }

    mappe.generate = mappe.g = function (name, component, content) {
      mappe.read()
      component = component || 'default'
      name = mappe.fileName(name, mappe.titleStyle(component))
      fse.mkdirsSync(mappe.path + name)
      for (var extension in mappe.config.components[component].extensions) {
        fs.writeFileSync(mappe.path + mappe.filePath(name, extension, component), content)
      }
      acho.success('Component: ' + name + ' generated')
    }

    mappe.filePath = function (name, extension, component) {
      var fileName = mappe.fileName(name, mappe.extensionStyle(component, extension), component)
      return [name, mappe.addExtension(fileName, extension)].join('/')
    }

    mappe.fileName = function (name, styleName) {
      mappe.config.styles[styleName].forEach(function (style) {
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
        'default style': mappe.config.default,
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
