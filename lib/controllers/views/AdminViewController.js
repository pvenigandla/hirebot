module.exports = AdminViewController

function AdminViewController() {

    this.prepare = function(request, server) {
        return server.database.query('applications', {})
        .then(results => {
            server.content.render('admin.html', {
                applications: results
            })
        })
    }
}