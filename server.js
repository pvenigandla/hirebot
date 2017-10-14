
const ExpressWrapper = require('./lib/ExpressWrapper.js')

function requireController(path) {
    let controllerClass = require(path)
    return new controllerClass()
}

var server = ExpressWrapper.builder()
    .withContentPath(process.cwd())
    .with404('notfound.html')
    .with500('internalerror.html')
    .build()

server.run()