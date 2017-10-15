
const path = require('path')
const mongodb = require('mongodb')

module.exports = DatabaseProvider

function DatabaseProvider(uri) {
    var uri = uri

    this.getAll = function(collectionName, params) {
        fs.readJson(path.join())
        .then(data => {

        })
    }

    this.queryNonfunctional = function(collectionName, params) {
        var client = mongodb.MongoClient;
        return client.connect(uri, {})
        .then(database => {
            console.log(database.databaseName)
            return database.collection(collectionName).find(params).toArray()
            .then(results => {
                console.log(results)
                return database.close().then(() => {
                    return results
                })
            })
        })
        .catch(err => {
            console.log('Query Failure: ' + err)
            throw err
        })
    }
}