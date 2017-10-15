
module.exports = CareersViewController

function CareersViewController() {

    this.prepare = function(request, server) {
        return server.content.render('careers.html', {})
    }
}