
module.exports = AdminViewController

function AdminViewController() {

    this.prepare = function(request, server) {
        return Promise.resolve('Admin View')
    }
}