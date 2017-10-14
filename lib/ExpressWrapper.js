
const express = require('express')
const ContentProvider = require('./ContentProvider.js')

module.exports = ExpressWrapper

function ApplicationBuilder() {
    var contentProvider = null
    var apiRegistrations = []
    var viewRegistrations = []
    var notFoundController = null
    var serverErrorController = null

    this.build = function() {
        return new ExpressWrapper(viewRegistrations, apiRegistrations, contentProvider, notFoundController, serverErrorController)
    }

    this.withContentPath = function(path) {
        contentProvider = new ContentProvider(path)
        return this
    }

    this.with404Controller = function(controller) {
        notFoundController = controller
        return this
    }

    this.with500Controller = function(controller) {
        serverErrorController = controller
        return this
    }

    this.addAPI = function(route, controller) {
        apiRegistrations.push(function(app, respond) {
            app.get(route, function(request, response) {
                respond(request, response, controller)
            })
        })
        return this
    }

    this.addView = function(route, controller) {
        viewRegistrations.push(function(app, respond) {
            app.get(route, function(request, response) {
                respond(request, response, controller)
            })
        })
        return this
    }
}

function ExpressWrapper(viewRegistrations, apiRegistrations, contentProvider, notFoundController, serverErrorController) {
    var app = express()
    apiRegistrations.forEach(endpoint => endpoint(app, sendAPIResponse))
    viewRegistrations.forEach(view => view(app, sendViewResponse))

    function sendAPIResponse(request, response, controller) {
        try {
            response.json(controller.prepare(request, this))
        } catch (err) {
            response.status(500).send(serverErrorController.prepare(request, this))
        }
    }

    function sendViewResponse(request, response, controller) {
        try {
            response.send(controller.prepare(request, this))
        } catch (err) {
            response.status(500).send(serverErrorController.prepare(request, this))
        }
    }

    this.run = function() {
        app.get('/static', contentProvider.getStaticContentRouter())
        app.use((request, response, next) => respond(request, response, notFoundController))
        app.listen(8080, () => {
            console.log('Started.')
        })
    }
}

ExpressWrapper.builder = () => new ApplicationBuilder()