#MappeJS

**[Under Construction]**

CLI tool that helps with the process of managing project folders and files based on components. Let's say you're building a web application and you want to create a new component.

Component:

```
- component/
 |_ component.html
 |_ component.service.js
 |_ component.factory.js
 |_ component.css
```

##Current Options
###Configuration
* Create a mappe.json file for custom configuration. If you don't, a new mappe.json file will be created with the default configuration:

```
{
    styles: {
      default: {
        format: 'camelCase',
        typeFormat: 'upperCaseFirst'
      }
    },
    components: {
      default: {
        js: 'default'
      }
    }
  }

```

###Generate Component
```
$ mappe generate default Index Component
```

Result:

```
- IndexComponent/
 |_ IndexComponent.js
```
