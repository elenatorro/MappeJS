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
        'lowerCaseFirst'
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
    mappe.configPath = 'mappe.json'

    /* MESSAGES */

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
        return 'Component: "' + name + '" generated successfully'
      },
      'GENERATED_FILE': function (name) {
        return 'File: "' + name + '" generated successfully'
      },
      'GENERATED_FOLDER': function (name) {
        return 'Folder: "' + name + '" generated successfully'
      },
      'GENERATED_AUTOMATICALLY': function () {
        return 'No mappe config, mappe.json file automatically generated with default config'
      },
      'READ_CONFIG': function () {
        return 'mappe config read'
      }
    }

    /* UTILS */

    function getExtensionContent (component, extension) {
      if (mappe.config.components[component].extensions[extension].src) {
        return fs.readFileSync(mappe.config.components[component].extensions[extension].src)
      } else {
        return ''
      }
    }

    function writeExtensions (folder, component, name) {
      var extension, filePath
      folder = changeName(folder, componentStyle(component))
      name = name || folder
      for (extension in mappe.config.components[component].extensions) {
        filePath = getFileName(folder, extension, component, name)
        fs.writeFileSync(mappe.path + filePath, getExtensionContent(component, extension))
        acho.success(mappe.messages.GENERATED_FILE(filePath))
      }
    }

    function writeFile (folder, extension, name, component) {
      try {
        var extensionStyle = getExtensionStyle(component, extension)
        folder = changeName(folder, componentStyle(component))
        name = getFileName(folder, extension, component, changeName(name, extensionStyle))
        fs.writeFileSync(mappe.path + name, getExtensionContent(component, extension))
        acho.success(mappe.messages.GENERATED_FILE(name))
      } catch (error) {
        acho.error(error)
      }
    }

    function addExtension (name, extension) {
      return [name, extension].join('.')
    }

    function setDefault (config, property) {
      mappe.config[property] = mappe.config[property] || defaultConfig[property]
    }

    function setDefaultConfig (config) {
      setDefault(config, 'components')
      setDefault(config.components, 'default')
      setDefault(config, 'styles')
      setDefault(config.styles, 'default')
    }

    function write () {
      fse.writeJsonSync(mappe.configPath, mappe.config)
    }

    function componentStyleExists (component) {
      return mappe.config.styles[mappe.config.components[component].style]
    }

    function componentStyle (component) {
      if (componentStyleExists(component)) {
        return mappe.config.components[component].style
      } else {
        throw mappe.exceptions.NOT_FOUND_COMPONENT(component)
      }
    }

    function getExtensionStyle (component, extension) {
      mappe.read()
      if (!mappe.config.components[component]) {
        throw mappe.errors.NOT_FOUND_COMPONENT(component)
      }
      if (!mappe.config.components[component].extensions[extension]) {
        throw mappe.exceptions.WRONG_COMPONENT_EXTENSION(component, extension)
      }

      return mappe.config.components[component].extensions[extension].style || 'default'
    }

    function getFileName (name, extension, component, filename) {
      try {
        if (filename) {
          filename = changeName(filename, getExtensionStyle(component, extension), component)
        } else {
          filename = changeName(name, getExtensionStyle(component, extension), component)
        }
        return [name, addExtension(filename, extension)].join('/')
      } catch (error) {
        acho.error(error)
      }
    }

    function changeName (name, styleName) {
      mappe.config.styles[styleName].forEach(function (style) {
        name = changeCase[style](name)
      })
      return name
    }

    /* Main Mappe Functions */
    mappe.info = function () {
      acho.info('config: ' + JSON.stringify(mappe.config))
      acho.info('path: ' + mappe.configPath)
      acho.info('default name: ' + mappe.config.default)
      acho.info('version: ' + mappe.version)
    }

    mappe.read = function () {
      try {
        mappe.config = fse.readJsonSync(mappe.configPath, {throws: false}) || {}
      } catch (error) {
        acho.warn(mappe.messages.GENERATED_AUTOMATICALLY())
      }
      setDefaultConfig(mappe.config)
      write()
      acho.success(mappe.messages.READ_CONFIG())
    }

    mappe.setup = function (configPath) {
      mappe.configPath = configPath || 'mappe.json'
      mappe.read()
      mappe.info()
    }

    mappe.generate = mappe.g = function (name, component) {
      mappe.read()
      try {
        name = changeName(name, componentStyle(component))
        fse.mkdirsSync(mappe.path + name)
        writeExtensions(name, component)
        acho.success(mappe.messages.GENERATED_COMPONENT(name))
      } catch (error) {
        acho.error(error)
      }
    }

    mappe.folder = function (name, component) {
      mappe.read()
      try {
        name = changeName(name, componentStyle(component))
        fse.mkdirsSync(mappe.path + name)
        acho.success(mappe.messages.GENERATED_FOLDER(name))
      } catch (error) {
        acho.error(error)
      }
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
      try {
        writeExtensions(folder, component, name)
      } catch (error) {
        acho.error(error)
      }
    }

    return mappe
  }

  module.exports = Mappe
}())
