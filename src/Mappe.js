/*! https://elenatorro.github.io/mappe v0.0.1 by elenatorro | MIT license */
;(function () {
  const fse = require('fs-extra')
  const fs = require('fs')
  const changeCase = require('change-case')
  const Acho = require('acho')
  const defaultConfig = {
    'default': 'default',
    'styles': {
      'default': [
        'camelCase',
        'upperCaseFirst'
      ]
    },
    'components': {
      'default': {
        'style': 'default',
        'extensions': {
          'js': {
            'style': 'default',
            'src': false
          },
          'css': {
            'style': 'default',
            'src': false
          }
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

    /* MESSAGES */

    mappe.errors = {
      'ENOENT': mappe.write
    }

    mappe.exceptions = {
      'NOT_FOUND_COMPONENT': function (component) {
        return '"' + component + '" component not found'
      },
      'WRONG_COMPONENT_EXTENSION': function (component, extension) {
        return 'File could not be created, wrong extension "' + extension + '" for component "' + component + '"'
      }
    }

    mappe.messages = {
      'GENERATED_COMPONENT': function (name) {
        return 'Component: "' + name + '" generated'
      },
      'GENERATED_FILE': function (name) {
        return 'File: "' + name + '" generated successfully'
      }
    }

    /* UTILS */

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

    mappe.setup = function (configPath) {
      mappe.configPath = configPath || 'mappe.json'
      mappe.read()
      mappe.info()
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

    mappe.componentStyleExists = function (component) {
      return mappe.config.styles[component]
    }

    mappe.componentStyle = function (component) {
      if (mappe.componentStyleExists(component)) {
        return mappe.config.components[component].style
      } else {
        throw mappe.exceptions.NOT_FOUND_COMPONENT(component)
      }
    }

    mappe.extensionStyle = function (component, extension) {
      if (!mappe.config.components[component]) {
        throw mappe.errors.NOT_FOUND_COMPONENT(component)
      }
      if (!mappe.config.components[component].extensions[extension]) {
        throw mappe.exceptions.WRONG_COMPONENT_EXTENSION(component, extension)
      }

      return mappe.config.components[component].extensions[extension].style || 'default'
    }

    mappe.filePath = function (name, extension, component, filename) {
      try {
        filename = filename || mappe.changeName(name, mappe.extensionStyle(component, extension), component)
        return [name, mappe.addExtension(filename, extension)].join('/')
      } catch (error) {
        acho.error(error)
      }
    }

    mappe.changeName = function (name, styleName) {
      mappe.config.styles[styleName].forEach(function (style) {
        name = changeCase[style](name)
      })
      return name
    }

    mappe.addExtension = function (name, extension) {
      return [name, extension].join('.')
    }

    function getExtensionContent (component, extension) {
      if (mappe.config.components[component].extensions[extension].src) {
        return fs.readFileSync(mappe.config.components[component].extensions[extension].src)
      } else {
        return ''
      }
    }

    function writeExtensions (folder, component, name) {
      for (var extension in mappe.config.components[component].extensions) {
        fs.writeFileSync(mappe.path + mappe.filePath(folder, extension, component, name), getExtensionContent(component, extension))
      }
      acho.success(mappe.messages.GENERATED_COMPONENT(folder))
    }

    function writeFile (folder, extension, name, component) {
      try {
        var extensionStyle = mappe.extensionStyle(component, extension)
        folder = mappe.changeName(folder, mappe.componentStyle(component))
        name = mappe.filePath(folder, extension, component, mappe.changeName(name, extensionStyle))
        fs.writeFileSync(mappe.path + name, getExtensionContent(component, extension))
        acho.success(mappe.messages.GENERATED_FILE(name))
      } catch (error) {
        acho.error(error)
      }
    }

    /* Main Functions */

    mappe.info = function () {
      acho.info('config: ' + JSON.stringify(mappe.config))
      acho.info('path: ' + mappe.configPath)
      acho.info('default name: ' + mappe.config.default)
      acho.info('version: ' + mappe.version)
    }

    mappe.generate = mappe.g = function (name, component) {
      mappe.read()
      try {
        name = mappe.changeName(name, mappe.componentStyle(component))
        fse.mkdirsSync(mappe.path + name)
        writeExtensions(name, component)
      } catch (error) {
        acho.error(error)
      }
    }

    mappe.folder = function (name, component) {
      mappe.read()
      name = mappe.changeName(name, mappe.componentStyle(component))
      fse.mkdirsSync(mappe.path + name)
      acho.success('Folder: "' + name + '" generated')
    }

    mappe.file = function (folder, extension, name, component) {
      mappe.read()
      try {
        writeFile(folder, extension, name, component)
      } catch (error) {
        acho.error(error)
      }
    }

    mappe.files = function (folder, name, component) {
      mappe.read()
      writeExtensions(folder, component, name)
    }

    return mappe
  }

  module.exports = Mappe
}())
