
module.exports = AdminViewController

function AdminViewController() {

    this.prepare = function(request, server) {
        console.log(server)
        return server.content.render('admin.html', {})
    }
}