const Koa = require('koa'),
    path = require('path'),
    api = require('../index')

process.env.NODE_ENV = 'test'

exports.startServer = function (port) {
    const app = new Koa(),
        filePath = path.join(process.cwd(), 'test', 'json-api.hbs')

    app.use(api({ urlPrefix: 'api', filePath }))

    return app.listen(port)
}
