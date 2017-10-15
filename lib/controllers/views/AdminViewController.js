
module.exports = AdminViewController

function AdminViewController() {

    this.prepare = function(request, server) {
        return server.content.render('admin.html', {})
    }
}