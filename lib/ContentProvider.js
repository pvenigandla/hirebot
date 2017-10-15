
const path = require('path')
const express = require('express')
const handlebars = require('handlebars')
const fs = require('fs-extra')

module.exports = ContentProvider

function ContentProvider(dataDir) {
    var dataDir = dataDir
    var staticDir = path.join(dataDir, 'content/static')
    var viewDir = path.join(dataDir, 'content/views')

    this.getStaticContentRouter = function() {
        return express.static(staticDir)
    }

    this.getStaticContentPath = function(filename) {
        return path.join(staticDir, filename)
    }

    this.render = function(filename, context) {
        return fs.readFile(path.join(viewDir, filename), 'utf-8')
        .then(data => {
            let template = handlebars.compile(data)
            return template(context)
        })
    }
}