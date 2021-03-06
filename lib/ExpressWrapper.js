
const express = require('express')
const ContentProvider = require('./ContentProvider.js')
const DatabaseProvider = require('./DatabaseProvider.js')

module.exports = ExpressWrapper

function ApplicationBuilder() {
    var contentProvider = null
    var databaseProvider = null
    var apiRegistrations = []
    var viewRegistrations = []
    var staticRegistrations = []
    var notFoundContentPath = null
    var serverErrorContentPath = null

    this.build = function() {
        return new ExpressWrapper(viewRegistrations, apiRegistrations, staticRegistrations,
            contentProvider, databaseProvider, notFoundContentPath, serverErrorContentPath)
    }

    this.withContentPath = function(path) {
        contentProvider = new ContentProvider(path)
        return this
    }

    this.withDatabase = function(uri) {
        databaseProvider = new DatabaseProvider(uri)
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

function ExpressWrapper(viewRegistrations, apiRegistrations, staticRegistrations,
        contentProvider, databaseProvider, notFoundContentPath, serverErrorContentPath) {
    var _this = this
    this.content = contentProvider
    this.database = databaseProvider
    var app = express()
    apiRegistrations.forEach(endpoint => endpoint(app, sendAPIResponse))
    viewRegistrations.forEach(view => view(app, sendViewResponse))
    staticRegistrations.forEach(static => static(app, sendStaticResponse))

    function sendAPIResponse(request, response, controller) {
        controller.prepare(request, _this)
        .then(data => {
            response.json(data)
        })
        .catch(err => {
            console.log("REST Error: " + err)
            sendStaticResponse(response, serverErrorContentPath)
        })
    }

    function sendViewResponse(request, response, controller) {
        controller.prepare(request, _this)
        .then(data => {
            response.send(data)
        })
        .catch(err => {
            console.log("View Error: " + err)
            sendStaticResponse(response, serverErrorContentPath)
        })
    }

    function sendStaticResponse(response, path) {
        try {
            response.sendFile(contentProvider.getStaticContentPath(path))
        } catch (err) {
            console.log("Static Error: " + err)
            response.status(500).send()
        }
    }

    this.run = function() {
        app.use('/static', contentProvider.getStaticContentRouter())
        app.use((request, response, next) => sendStaticResponse(response, notFoundContentPath))
        app.listen(8080, () => {
            console.log('Started.')
        })
    }
}

ExpressWrapper.builder = () => new ApplicationBuilder()