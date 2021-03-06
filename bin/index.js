#!/usr/bin/env node
;(function () {
  var mappe = require('../src/Mappe')()
  var input = {
    option: process.argv[2]
  }
  var log = console.log
  var functions = {}

  functions.generate = functions.g = function (input) {
    input.component = process.argv[3]
    input.name = process.argv.splice(4)
    mappe.generate(input.name, input.component)
  }

  functions.folder = function (input) {
    input.component = process.argv[3]
    input.name = process.argv.splice(4)
    mappe.folder(input.name, input.component)
  }

  functions.files = function (input) {
    input.folder = process.argv[4]
    input.component = process.argv[3]
    input.name = process.argv.splice(5)
    mappe.files(input.folder, input.name, input.component)
  }

  functions.file = function (input) {
    input.component = process.argv[3]
    input.folder = process.argv[4]
    input.extension = process.argv[5]
    input.name = process.argv.splice(6)
    mappe.file(input.folder, input.extension, input.name, input.component)
  }

  functions.info = function () {
    mappe.info()
  }

  functions.setup = function (input) {
    input.config = process.argv[3]
    mappe.setup(input.config)
  }

  var main = function () {
    if ((!input.option) && (!input.component) && (!input.name)) {
      log('Error: mappe requires a component type and a name.')
      log('Try `mappe --help` for more information.')
      return process.exit(1)
    }

    /* Help */
    if (/^(?:-h|--help|undefined)$/.test(input.option)) {
      log('mappe v%s', mappe.version)
      log([
        '\nUsage:\n',
        '\tmappe generate [component name] [files name]',
        '\tmappe g [component name] [files name]',
        '\t --> Generates a component folder with its files\n',
        '\tmappe folder [component name] [folder name]',
        '\t --> Creates a folder with a component syntax\n',
        '\tmappe files [component name] [folder name] [files name]',
        '\t --> Generates all the files in a component inside a certain file\n',
        '\tmappe file [component name] [folder name] [extension] [file name]',
        '\t --> Generates a single file in a component inside a certain file, given its extension\n',
        '\tmappe info',
        '\t --> Shows current mappe setup\n',
        '\tmappe setup [config path]',
        '\t --> Loads the given setup, or the default config if no file is passed\n'
      ].join('\n'))
      return process.exit(1)
    }

    /* Version */
    if (/^(?:-v|--version)$/.test(input.option)) {
      log('v%s', mappe.version)
      return process.exit(1)
    }

    try {
      functions[input.option](input)
    } catch (error) {
      log(error.message + '\n')
      log('Error: failed to %s.', input.option)
      log(
        '\nStack trace using mappe@%s:\n',
        mappe.version
      )
      log(error.stack)
      return process.exit(1)
    }
    return process.exit(0)
  }

  main()
}())
