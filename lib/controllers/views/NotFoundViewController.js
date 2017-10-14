
module.exports = NotFoundViewController

function NotFoundViewController() {

    this.prepare = function(request, server) {
        return "Not Found"
    }
}