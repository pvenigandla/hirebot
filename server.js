
const ExpressWrapper = require('./lib/ExpressWrapper.js')

function requireController(path) {
    let controllerClass = require(path)
    return new controllerClass()
}

var server = ExpressWrapper.builder()
    .withContentPath(process.cwd())
    .with404Controller(requireController('./lib/controllers/views/NotFoundViewController.js'))
    .with500Controller(requireController('./lib/controllers/views/ServerErrorViewController.js'))
    .build()

server.run()