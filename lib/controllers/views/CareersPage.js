module.exports = CareerPageController

function CareerPageController() {

    this.prepare = function(request, server) {
        return Promise.resolve('Career Page')
    }
}