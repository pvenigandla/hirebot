
module.exports = ServerErrorViewController

function ServerErrorViewController() {

    this.prepare = function(request, server) {
        return "Internal Server Error"
    }
}