
const express = require('express')

module.exports = ExpressWrapper

function ExpressWrapper(contentProvider, notFoundControllerClass) {
    var contentProvider = contentProvider
    var notFoundController = new notFoundControllerClass()
    var app = express()

    this.viewController = function(route, controllerClass) {
        app.get(route, (request, response) => {
            
        })
    }

    this.run = function() {
        app.get('/static', contentProvider.getStaticContentRouter())
        
        app.use((req, res, next) => {
            res.send(notFoundController.serve(contentProvider))
        })

        app.listen(8080, () => {
            console.log('Started.')
        })
    }
}