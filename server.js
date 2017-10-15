const ExpressWrapper = require('./lib/ExpressWrapper.js')

function requireController(path) {
    let controllerClass = require(path)
    return new controllerClass()
}

var server = ExpressWrapper.builder()
    .withContentPath(process.cwd())
    .withDatabase('mongodb://hirebot:NGJAqLyC9Yo0fBHeiJGeJK6CD8HWcmbnirEtdcdDjyH7Jd95mlhIS6AOjXbajB9Fr2s9mvy0fYcg38uRO8RcKw==@hirebot.documents.azure.com:10255/?ssl=true')
    .with404('html/notfound.html')
    .with500('html/internalerror.html')
    .addStaticView('/adminlogin', 'html/adminlogin.html')
    .addStaticView('/applicantlogin', 'html/applicantlogin.html')
    // .addStaticView('/', 'html/index.html')
    .addView('/', requireController('./lib/controllers/views/CareersViewController.js'))
    .addView('/admin', requireController('./lib/controllers/views/AdminViewController.js'))
    .addView('/careers', requireController('./lib/controllers/views/CareersViewController.js'))
    .build()

server.run()