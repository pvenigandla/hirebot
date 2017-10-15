const ExpressWrapper = require('./lib/ExpressWrapper.js')

function requireController(path) {
    let controllerClass = require(path)
    return new controllerClass()
}

var server = ExpressWrapper.builder()
    .withContentPath(process.cwd())
    .with404('notfound.html')
    .with500('internalerror.html')
    .addStaticView('/adminlogin', 'html/adminlogin.html')
    .addStaticView('/', 'html/index.html')
    .addView('/admin', requireController('./lib/controllers/views/AdminViewController.js'))
    .build()

server.run()