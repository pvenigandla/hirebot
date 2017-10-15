
const mongodb = require('mongodb')

module.exports = DatabaseProvider

function DatabaseProvider(uri) {
    var uri = uri

    this.query = function(collectionName, params) {
        var client = mongodb.MongoClient;
        return client.connect(uri)
        .then(database => {
            return database.collection(collectionName).find(params).toArray()
            .then(results => {
                console.log(results)
                database.close()
                return results
            })
        })
        .catch(err => {
            console.log('Query Failure: ' + err)
            throw err
        })
    }
}