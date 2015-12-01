#!/usr/bin/env node
;(function () {
  var mappe = require('../src/Mappe')()
  var fs = require('fs')
  var input = {
    option: process.argv[2],
    component: process.argv[3],
    name: process.argv.splice(4)
  }
  var log = console.log

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
        '\tmappe generate [style name] [component name you want]',
        '\tmappe g [style name] [component name you want]',
        '\t --> Generates a component with certain setup\n',
        '\tmappe info',
        '\t --> Shows current mappe setup\n',
      ].join('\n'))
      return process.exit(1)
    }

    /* Version */
    if (/^(?:-v|--version)$/.test(input.option)) {
      log('v%s', mappe.version)
      return process.exit(1)
    }

    var result
    try {
      result = mappe[input.option](input.name, input.component)
      log(result)
    } catch(error) {
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
