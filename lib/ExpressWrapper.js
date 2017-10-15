
const express = require('express')
const ContentProvider = require('./ContentProvider.js')

module.exports = ExpressWrapper

function ApplicationBuilder() {
    var contentProvider = null
    var apiRegistrations = []
    var viewRegistrations = []
    var staticRegistrations = []
    var notFoundContentPath = null
    var serverErrorContentPath = null

    this.build = function() {
        return new ExpressWrapper(viewRegistrations, apiRegistrations, staticRegistrations,
            contentProvider, notFoundContentPath, serverErrorContentPath)
    }

    this.withContentPath = function(path) {
        contentProvider = new ContentProvider(path)
        return this
    }

    this.with404 = function(path) {
        notFoundContentPath = path
        return this
    }

    this.with500 = function(path) {
        serverErrorContentPath = path
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

    this.addStaticView = function(route, path) {
        staticRegistrations.push(function(app, respond) {
            app.get(route, function(request, response) {
                respond(response, path)
            })
        })
        return this
    }
}

function ExpressWrapper(viewRegistrations, apiRegistrations, staticRegistrations, contentProvider, notFoundContentPath, serverErrorContentPath) {
    this.content = contentProvider
    var app = express()
    apiRegistrations.forEach(endpoint => endpoint(app, sendAPIResponse))
    viewRegistrations.forEach(view => view(app, sendViewResponse))
    staticRegistrations.forEach(static => static(app, sendStaticResponse))

    function sendAPIResponse(request, response, controller) {
        controller.prepare(request, this)
        .then(data => {
            response.json(data)
        })
        .catch(err => {
            sendStaticResponse(response, serverErrorContentPath)
        })
    }

    function sendViewResponse(request, response, controller) {
        controller.prepare(request, this)
        .then(data => {
            response.send(data)
        })
        .catch(err => {
            sendStaticResponse(response, serverErrorContentPath)
        })
    }

    function sendStaticResponse(response, path) {
        try {
            response.sendFile(contentProvider.getStaticContentPath(path))
        } catch (err) {
            response.status(500).send()
        }
    }

    this.run = function() {
        app.use('/static', contentProvider.getStaticContentRouter())
        app.use((request, response, next) => sendStaticResponse(response, 'notfound.html'))
        app.listen(8080, () => {
            console.log('Started.')
        })
    }
}

ExpressWrapper.builder = () => new ApplicationBuilder()