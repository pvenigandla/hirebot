
const ExpressWrapper = require('./lib/ExpressWrapper.js')
const ContentProvider = require('./lib/ContentProvider.js')

var contentProvider = new ContentProvider(process.cwd())
var server = new ExpressWrapper(contentProvider, require('./lib/controllers/views/NotFoundViewController.js'))

server.viewController(require('./lib/controllers/views/AdminLoginViewController.js'))

server.run()