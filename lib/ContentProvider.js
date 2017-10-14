
const path = require('path')
const express = require('express')

module.exports = ContentProvider

function ContentProvider(dataDir) {
    var dataDir = dataDir

    this.getStaticContentRouter = function() {
        return express.static(path.join(dataDir, 'static'))
    }
}