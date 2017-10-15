
const path = require('path')
const express = require('express')
const handlebars = require('handlebars')
const fs = require('fs')

module.exports = ContentProvider

function ContentProvider(dataDir) {
    var dataDir = dataDir
    var staticDir = path.join(dataDir, 'content/static')

    this.getStaticContentRouter = function() {
        return express.static(staticDir)
    }

    this.getStaticContentPath = function(filename) {
        return path.join(staticDir, filename)
    }
}